export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    data?: any;
    stack?: string;
}

const MAX_LOGS = 100;
const STORAGE_KEY = 'synthesis_debug_logs';

export class LoggingService {
    private static instance: LoggingService;
    private logs: LogEntry[] = [];
    private isProd: boolean = import.meta.env.PROD;

    private constructor() {
        this.loadLogs();
    }

    public static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    public log(level: LogLevel, message: string, data?: any) {
        // Safe logger wrapper to prevent recursion
        try {
            const entry: LogEntry = {
                timestamp: new Date().toISOString(),
                level,
                message,
                data: this.scrub(data),
            };

            if (data instanceof Error) {
                entry.stack = data.stack;
                entry.message = data.message || message;
                // Don't duplicate the error object in data if it's the main data
                if (entry.data === data) {
                    delete entry.data;
                }
            }

            // 1. Console Output (formatted)
            this.consoleLog(level, entry);

            // 2. Storage Persistence (only meaningful logs in prod)
            if (this.shouldPersist(level)) {
                this.addLog(entry);
            }
        } catch (err) {
            // Fallback to native console if logger fails
            console.error('CRITICAL: LoggingService failed internally', err);
        }
    }

    public debug(message: string, data?: any) { this.log('DEBUG', message, data); }
    public info(message: string, data?: any) { this.log('INFO', message, data); }
    public warn(message: string, data?: any) { this.log('WARN', message, data); }
    public error(message: string, error?: any) { this.log('ERROR', message, error); }
    public fatal(message: string, error?: any) { this.log('FATAL', message, error); }

    public getLogs(): LogEntry[] {
        return [...this.logs];
    }

    public clearLogs() {
        this.logs = [];
        this.saveLogs();
    }

    public exportLogs(): string {
        return JSON.stringify(this.logs, null, 2);
    }

    private addLog(entry: LogEntry) {
        this.logs.push(entry);
        if (this.logs.length > MAX_LOGS) {
            this.logs.shift(); // Remove oldest
        }
        this.saveLogs();
    }

    private saveLogs() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
        } catch (e) {
            console.error('Failed to save logs to localStorage', e);
        }
    }

    private loadLogs() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                this.logs = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Failed to load logs', e);
            this.logs = [];
        }
    }

    private shouldPersist(level: LogLevel): boolean {
        // In Prod, ignore DEBUG
        if (this.isProd && level === 'DEBUG') return false;
        return true;
    }

    private consoleLog(level: LogLevel, entry: LogEntry) {
        const style = {
            DEBUG: 'color: #7f8c8d',
            INFO: 'color: #2980b9',
            WARN: 'color: #f39c12',
            ERROR: 'color: #c0392b; font-weight: bold',
            FATAL: 'background: #c0392b; color: white; font-weight: bold',
        }[level];

        console.log(`%c[${level}] ${entry.message}`, style, entry.data || '');
    }

    private scrub(data: any): any {
        if (!data) return data;

        try {
            // Deep clone to avoid mutating original
            const str = JSON.stringify(data);

            // Regex patterns to scrub
            const sensitiveKeys = ['apiKey', 'password', 'secret', 'token', 'auth'];

            // Simple replace for common key-value patterns in JSON string
            // This is a basic scrubber. For complex objects, we might need recursive descent.
            let scrubbed = str;
            sensitiveKeys.forEach(key => {
                // Matches "key": "value"
                const regex = new RegExp(`("${key}"\s*:\s*")[^"]*"`, 'gi');
                scrubbed = scrubbed.replace(regex, `$1[REDACTED]"`);
            });

            return JSON.parse(scrubbed);
        } catch (e) {
            return '[UNPROCESSABLE DATA];'
        }
    }
}

export const logger = LoggingService.getInstance();
