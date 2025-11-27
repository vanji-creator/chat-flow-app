import React, { useEffect, useRef, useState } from 'react';
import { useTerminalStore, LogEntry } from '../store/terminalStore';
import { Terminal, Play, Trash2, Shield } from 'lucide-react';

const TerminalView: React.FC = () => {
    const { logs, connect, clearLogs, runTool, sendCommand } = useTerminalStore();
    const logsEndRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState('');

    useEffect(() => {
        connect();
    }, []);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (input.trim()) {
                sendCommand(input);
                setInput('');
            }
        }
    };

    const getLogColor = (entry: LogEntry) => {
        if (entry.type === 'command') return 'text-yellow-400 font-bold';
        if (entry.type === 'error') return 'text-red-500';
        if (entry.type === 'success') return 'text-green-400';
        if (entry.type === 'result') {
            if (entry.severity === 'critical') return 'text-purple-500 font-bold';
            if (entry.severity === 'high') return 'text-red-500 font-bold';
            if (entry.severity === 'medium') return 'text-orange-400';
            if (entry.severity === 'low') return 'text-blue-400';
            return 'text-blue-300';
        }
        return 'text-gray-300';
    };

    return (
        <div className="flex flex-col h-full bg-black text-green-500 font-mono p-4 overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                    <Terminal size={20} />
                    <span className="font-bold text-lg">Security Terminal</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => runTool('scan', 'localhost')}
                        className="px-3 py-1 bg-green-900 hover:bg-green-800 text-green-100 rounded text-sm flex items-center gap-1"
                    >
                        <Play size={14} /> Auto-Scan
                    </button>
                    <button
                        onClick={() => runTool('nuclei', 'localhost')}
                        className="px-3 py-1 bg-purple-900 hover:bg-purple-800 text-purple-100 rounded text-sm flex items-center gap-1"
                    >
                        <Shield size={14} /> Nuclei
                    </button>
                    <button onClick={clearLogs} className="p-1 hover:text-red-400" title="Clear Logs">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Logs */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-700 bg-gray-900/50 p-4 rounded">
                {logs.map((log, i) => (
                    <div key={i} className={`${getLogColor(log)} break-words`}>
                        <span className="opacity-50 text-xs mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        {log.content}
                    </div>
                ))}
                <div ref={logsEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex items-center gap-2 bg-gray-900 p-2 rounded">
                <span className="text-green-500 font-bold">{'>'}</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder-gray-600 font-mono"
                    placeholder="Enter command (e.g., /scan localhost)..."
                    autoFocus
                />
            </div>
        </div>
    );

};

export default TerminalView;
