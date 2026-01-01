import { supabase } from '../lib/supabase';

interface SynthesisData {
    id?: string;
    title: string;
    url: string;
    content: string; // Markdown summary/chat
    source_type: 'web' | 'youtube' | 'search';
    created_at?: string;
}

export class SyncService {
    /**
     * Pushes a new synthesis to Supabase
     */
    static async pushSynthesis(data: SynthesisData): Promise<string | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: inserted, error } = await supabase
            .from('syntheses')
            .insert({
                user_id: user.id,
                title: data.title,
                url: data.url,
                content: data.content, // Storing strict content for now, can expand to JSON
                source_type: data.source_type
            })
            .select('id')
            .single();

        if (error) {
            console.error('Sync push failed:', error);
            return null;
        }
        return inserted.id;
    }

    /**
     * Pulls all syntheses for the current user
     */
    static async pullSyntheses() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('syntheses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Sync pull failed:', error);
            return [];
        }
        return data;
    }
}
