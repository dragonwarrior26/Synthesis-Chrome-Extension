"use client";

import { Container } from "@/components/ui/Container";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <Container className="max-w-3xl">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy for Synthesis</h1>
                <p className="text-neutral-400 mb-8">Last Updated: December 7, 2025</p>

                <div className="prose prose-invert prose-neutral max-w-none">
                    <p>
                        Synthesis ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how our Chrome Extension ("Synthesis") handles your data.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">1. Data Collection and Usage</h2>
                    <p><strong>Synthesis is a "Local-First" application.</strong> We do not maintain our own servers to store your browsing history or conversation data.</p>

                    <h3 className="text-xl font-medium mt-6 mb-3">Types of Data We Process:</h3>
                    <ul className="list-disc pl-6 space-y-2 text-neutral-300">
                        <li><strong>Website Content:</strong> When you click "Sync" or "Summarize", the extension reads the text content of the active tab to generate summaries. This data is sent directly from your browser to the Google Gemini API using your personal API Key.</li>
                        <li><strong>API Keys:</strong> Your Google Gemini API Key is stored locally on your device using <code>chrome.storage.local</code>. It is never transmitted to us or any third party other than Google (for the purpose of making API calls).</li>
                        <li><strong>Chat History:</strong> Your conversation history is stored locally in your browser's memory and is cleared when you close the extension or browser, unless you explicitly use a future "Save" feature (which would store it locally).</li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">2. Third-Party Services</h2>
                    <h3 className="text-xl font-medium mt-6 mb-3">Google Gemini API</h3>
                    <p>Synthesis uses the Google Gemini API to provide AI analysis.</p>
                    <ul className="list-disc pl-6 space-y-2 text-neutral-300">
                        <li>When you use the extension, the text content of the page you are viewing and your prompts are sent to Google.</li>
                        <li>Please refer to <a href="https://policies.google.com/privacy" className="text-blue-400 hover:text-blue-300">Google's Generative AI Privacy Policy</a> for details on how they handle API data.</li>
                        <li><strong>We do not have access to this data.</strong></li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Retention</h2>
                    <ul className="list-disc pl-6 space-y-2 text-neutral-300">
                        <li><strong>Local Data:</strong> Your API Key and preferences remain on your device until you uninstall the extension or clear your data.</li>
                        <li><strong>Server Data:</strong> We do not have servers. We do not retain any of your data.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your Rights</h2>
                    <p>Since we do not store your data, there is nothing for us to delete. You have full control over your data by simply managing your local browser storage and API keys.</p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact</h2>
                    <p>For questions about this policy, please contact us at: <a href="mailto:support@synthesisext.com" className="text-blue-400 hover:text-blue-300">support@synthesisext.com</a></p>
                </div>
            </Container>
        </div>
    );
}
