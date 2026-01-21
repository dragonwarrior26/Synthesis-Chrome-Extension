import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, type Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { TierService, type UserTier } from '../services/TierService';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    tier: UserTier;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshTier: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [tier, setTier] = useState<UserTier>('free');

    // Sync tier from TierService
    const refreshTier = async () => {
        const currentTier = await TierService.getCurrentTier();
        setTier(currentTier);
    };

    useEffect(() => {
        // Check for initial session
        supabase.auth.getSession().then(async ({ data: { session } }: { data: { session: Session | null } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            // Sync tier after getting session
            await refreshTier();
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
            setSession(session);
            setUser(session?.user ?? null);
            // Sync tier after auth change
            await refreshTier();
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const redirectUrl = chrome.identity.getRedirectURL();
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;
            if (!data.url) throw new Error('No URL returned from Supabase');

            const responseUrl = await chrome.identity.launchWebAuthFlow({
                url: data.url,
                interactive: true,
            });

            if (!responseUrl) throw new Error('No response URL');

            // Parse tokens from hash
            const url = new URL(responseUrl);
            const params = new URLSearchParams(url.hash.substring(1)); // Remove leading #
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (!accessToken || !refreshToken) {
                // Try query params if hash fails (sometimes Supabase redirects differently)
                const queryParams = new URLSearchParams(url.search);
                const queryAccess = queryParams.get('access_token');
                const queryRefresh = queryParams.get('refresh_token');
                if (queryAccess && queryRefresh) {
                    await supabase.auth.setSession({
                        access_token: queryAccess,
                        refresh_token: queryRefresh,
                    });
                    return;
                }
                throw new Error('No tokens found in redirect URL');
            }

            const { error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });

            if (sessionError) throw sessionError;

        } catch (error) {
            console.error('Error signing in:', error);
            alert('Sign in failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error signing out:', error.message);
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, tier, signInWithGoogle, signOut, refreshTier }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
