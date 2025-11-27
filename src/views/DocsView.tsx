import React, { useState } from 'react';
import { Book, Server, Terminal, Shield, Database, Layers, Code, Zap, Globe } from 'lucide-react';

const DocsView: React.FC = () => {
    const [activeSection, setActiveSection] = useState('architecture');

    const sections = [
        { id: 'architecture', label: 'Architecture', icon: Layers },
        { id: 'backend', label: 'Backend Services', icon: Server },
        { id: 'frontend', label: 'Frontend Engine', icon: Code },
        { id: 'terminal', label: 'Terminal System', icon: Terminal },
        { id: 'security', label: 'Security Tools', icon: Shield },
        { id: 'database', label: 'Data Persistence', icon: Database },
        { id: 'usage', label: 'Usage Guide', icon: Book },
    ];

    return (
        <div className="flex h-full bg-black text-gray-300 font-sans overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <Book className="text-indigo-500" />
                        Documentation
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">v2.6.0 Enterprise</p>
                </div>
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${activeSection === section.id
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <section.icon size={18} />
                            {section.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-12 scrollbar-thin scrollbar-thumb-gray-700">
                <div className="max-w-4xl mx-auto space-y-12">

                    {activeSection === 'architecture' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <h2 className="text-3xl font-bold text-white mb-4">System Architecture</h2>
                            <p className="text-lg text-gray-400 leading-relaxed">
                                Chatflow is a high-performance, dual-mode security orchestration platform designed for Red Team operations.
                                It combines a real-time <strong>Hacker Terminal</strong> for manual reconnaissance with a visual <strong>Flow Builder</strong> for automated exploitation chains.
                            </p>

                            <div className="grid grid-cols-2 gap-6 mt-8">
                                <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                        <Terminal className="text-green-400" /> Terminal Mode
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Direct interaction with security tools via a WebSocket-powered CLI.
                                        Supports real-time streaming of Nmap, Nuclei, Gobuster, and WhatWeb outputs.
                                    </p>
                                </div>
                                <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                        <Zap className="text-yellow-400" /> Flow Mode
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Visual programming interface to chain tools together.
                                        Example: <em>If Port 80 Open &rarr; Run Gobuster &rarr; If Admin Found &rarr; Run Nuclei</em>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'backend' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <h2 className="text-3xl font-bold text-white mb-4">Backend Services</h2>
                            <p className="text-gray-400">
                                Built on <strong>Node.js</strong> and <strong>Express</strong>, the backend serves as the command center for all operations.
                            </p>

                            <div className="space-y-4 mt-6">
                                <div className="p-4 bg-gray-900 rounded-lg border-l-4 border-indigo-500">
                                    <h3 className="font-bold text-white">Socket.IO Server</h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Handles real-time bidirectional communication. Listens for <code>terminal-command</code> events and emits
                                        <code>terminal-output</code> (logs) and <code>finding</code> (structured data) events.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-900 rounded-lg border-l-4 border-blue-500">
                                    <h3 className="font-bold text-white">Tool Services</h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Located in <code>server/services/</code>. Each tool (Nmap, Nuclei, etc.) has a dedicated wrapper service
                                        that spawns a child process, parses the stdout/stderr streams, and normalizes the output into JSON.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'frontend' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <h2 className="text-3xl font-bold text-white mb-4">Frontend Engine</h2>
                            <p className="text-gray-400">
                                A modern <strong>React</strong> application powered by <strong>Vite</strong> and <strong>Zustand</strong> for state management.
                            </p>

                            <ul className="list-disc list-inside space-y-2 text-gray-400 mt-4">
                                <li><strong>TerminalView:</strong> Renders the CLI interface and the Dashboard sidebar. Uses <code>terminalStore</code> to manage logs and findings.</li>
                                <li><strong>FlowBuilder:</strong> Uses <code>ReactFlow</code> to render the node-based editor. Nodes are custom components located in <code>src/nodes/</code>.</li>
                                <li><strong>State Management:</strong> Zustand stores (`terminalStore`, `flowStore`, `viewStore`) decouple business logic from UI components.</li>
                            </ul>
                        </div>
                    )}

                    {activeSection === 'terminal' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <h2 className="text-3xl font-bold text-white mb-4">Terminal System</h2>
                            <p className="text-gray-400">
                                The heart of the manual reconnaissance workflow. It mimics a real Linux terminal but with enhanced capabilities.
                            </p>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">Command Processor</h3>
                            <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-gray-300">
                                <p><span className="text-yellow-400">/scan &lt;target&gt;</span> : Runs full recon suite (Nmap, Nuclei, Gobuster, WhatWeb, Subfinder)</p>
                                <p><span className="text-yellow-400">/nmap &lt;target&gt;</span> : Runs Port Scan + Service Detection (-sV)</p>
                                <p><span className="text-yellow-400">/nuclei &lt;target&gt;</span> : Runs Vulnerability Scanner</p>
                                <p><span className="text-yellow-400">/gobuster &lt;target&gt;</span> : Runs Directory Brute-force</p>
                                <p><span className="text-yellow-400">/whatweb &lt;target&gt;</span> : Runs Tech Stack Detection</p>
                                <p><span className="text-yellow-400">/subfinder &lt;target&gt;</span> : Runs Subdomain Enumeration</p>
                            </div>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">Event System</h3>
                            <p className="text-gray-400">
                                The terminal listens for two key events:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400 mt-2">
                                <li><code>terminal-output</code>: Raw text logs with styling metadata (color, severity).</li>
                                <li><code>finding</code>: Structured JSON data (e.g., open port, vuln details) used to populate the Dashboard.</li>
                            </ul>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <h2 className="text-3xl font-bold text-white mb-4">Security Tools Integration</h2>
                            <p className="text-gray-400">
                                We integrate industry-standard security tools directly into the platform.
                            </p>

                            <div className="grid grid-cols-1 gap-4 mt-6">
                                <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 flex items-start gap-4">
                                    <div className="p-2 bg-green-900/30 rounded-lg text-green-400"><ActivityIcon /></div>
                                    <div>
                                        <h3 className="font-bold text-white">Nmap</h3>
                                        <p className="text-sm text-gray-400">Network Mapper. Used for port scanning, service version detection, and OS fingerprinting.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 flex items-start gap-4">
                                    <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400"><Shield /></div>
                                    <div>
                                        <h3 className="font-bold text-white">Nuclei</h3>
                                        <p className="text-sm text-gray-400">Template-based vulnerability scanner. Identifies CVEs, misconfigurations, and exposed secrets.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 flex items-start gap-4">
                                    <div className="p-2 bg-orange-900/30 rounded-lg text-orange-400"><FolderIcon /></div>
                                    <div>
                                        <h3 className="font-bold text-white">Gobuster</h3>
                                        <p className="text-sm text-gray-400">Directory/File brute-forcer. Finds hidden paths like /admin, .env, and backups.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 flex items-start gap-4">
                                    <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400"><Globe /></div>
                                    <div>
                                        <h3 className="font-bold text-white">WhatWeb & Subfinder</h3>
                                        <p className="text-sm text-gray-400">Web recon tools. Identify technology stacks (CMS, Frameworks) and enumerate subdomains.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'database' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <h2 className="text-3xl font-bold text-white mb-4">Data Persistence</h2>
                            <p className="text-gray-400">
                                All findings are stored in a <strong>SQLite</strong> database using <strong>Prisma ORM</strong>.
                            </p>

                            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 font-mono text-sm">
                                <p className="text-purple-400">model Finding {'{'}</p>
                                <p className="pl-4 text-gray-300">id          String   @id @default(uuid())</p>
                                <p className="pl-4 text-gray-300">type        String   // port, vuln, tech, dir</p>
                                <p className="pl-4 text-gray-300">severity    String   // critical, high, medium, low, info</p>
                                <p className="pl-4 text-gray-300">description String</p>
                                <p className="pl-4 text-gray-300">metadata    String   // JSON blob with full details</p>
                                <p className="pl-4 text-gray-300">createdAt   DateTime @default(now())</p>
                                <p className="text-purple-400">{'}'}</p>
                            </div>
                        </div>
                    )}

                    {activeSection === 'usage' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <h2 className="text-3xl font-bold text-white mb-4">Usage Guide</h2>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">1. Starting a Scan</h3>
                                    <p className="text-gray-400 mb-2">
                                        Navigate to the <strong>Terminal</strong> view. Type <code>/scan &lt;target&gt;</code> (e.g., <code>/scan localhost</code>) and hit Enter.
                                    </p>
                                    <p className="text-gray-400">
                                        The system will automatically run Nmap, then Subfinder, WhatWeb, Nuclei, and Gobuster in sequence.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">2. Monitoring Progress</h3>
                                    <p className="text-gray-400">
                                        Watch the terminal logs for real-time updates. The <strong>Dashboard Sidebar</strong> on the right will populate with findings as they are discovered.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">3. Analyzing Findings</h3>
                                    <p className="text-gray-400">
                                        Use the Dashboard to quickly identify critical vulnerabilities (red) or interesting open ports.
                                        Clicking on findings (coming soon) will provide more details.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

// Helper Icons
const ActivityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
);
const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
);

export default DocsView;
