import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface LogEntry {
    type: 'command' | 'info' | 'success' | 'error' | 'result' | 'data';
    content: string;
    severity?: 'info' | 'low' | 'medium' | 'high' | 'critical';
    timestamp: number;
}

export interface FindingsState {
    os: string;
    ports: any[];
    vulns: any[];
    subdomains: any[];
    tech: any[];
    dirs: any[];
}

interface TerminalState {
    logs: LogEntry[];
    findings: FindingsState;
    socket: Socket | null;
    isScanning: boolean;
    addLog: (entry: Omit<LogEntry, 'timestamp'>) => void;
    clearLogs: () => void;
    connect: () => void;
    sendCommand: (command: string) => void;
    runTool: (tool: string, target: string) => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
    logs: [],
    findings: {
        os: 'Unknown',
        ports: [],
        vulns: [],
        subdomains: [],
        tech: [],
        dirs: []
    },
    socket: null,
    isScanning: false,

    addLog: (entry) => set((state) => ({
        logs: [...state.logs, { ...entry, timestamp: Date.now() }]
    })),

    clearLogs: () => set({ logs: [] }),

    connect: () => {
        const socket = io('http://localhost:3001');

        socket.on('connect', () => {
            get().addLog({ type: 'success', content: 'Connected to security terminal.' });
        });

        socket.on('terminal-output', (data) => {
            get().addLog(data);
        });

        socket.on('finding', (finding) => {
            set((state) => {
                const newFindings = { ...state.findings };
                if (finding.type === 'os') newFindings.os = finding.data;
                if (finding.type === 'port') newFindings.ports = [...newFindings.ports, finding.data];
                if (finding.type === 'vuln') newFindings.vulns = [...newFindings.vulns, finding.data];
                if (finding.type === 'subdomain') newFindings.subdomains = [...newFindings.subdomains, finding.data];
                if (finding.type === 'tech') newFindings.tech = [...newFindings.tech, finding.data];
                if (finding.type === 'dir') newFindings.dirs = [...newFindings.dirs, finding.data];
                return { findings: newFindings };
            });
        });

        set({ socket });
    },

    sendCommand: (command: string) => {
        const { socket } = get();
        if (socket) {
            socket.emit('terminal-command', command);
            // Clear previous findings if starting a new scan
            if (command.startsWith('/scan')) {
                set({
                    findings: { os: 'Unknown', ports: [], vulns: [], subdomains: [], tech: [], dirs: [] }
                });
            }
        } else {
            get().addLog({ type: 'error', content: 'Not connected to server.' });
        }
    },

    runTool: (tool: string, target: string) => {
        const { sendCommand } = get();
        sendCommand(`/${tool} ${target}`);
    }
}));

export default useTerminalStore;
