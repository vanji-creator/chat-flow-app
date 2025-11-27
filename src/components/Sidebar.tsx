import { MessageSquare, GripVertical, GitFork, Target, Radar, Mail, Skull, Radio } from 'lucide-react';

const Sidebar = () => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="absolute left-6 top-24 w-64 bg-surface/80 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col shadow-2xl z-40 overflow-hidden transition-all duration-300 hover:shadow-indigo-500/10 hover:border-white/10">
            <div className="p-5 border-b border-white/5">
                <h2 className="text-sm font-bold text-white tracking-wide uppercase opacity-80">Components</h2>
                <p className="text-xs text-text-secondary mt-1">Drag to add to canvas</p>
            </div>

            <div className="p-4 space-y-3">
                <div
                    className="group flex items-center p-3 bg-white/5 border border-white/5 rounded-xl cursor-grab active:cursor-grabbing hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-200"
                    onDragStart={(event) => onDragStart(event, 'message')}
                    draggable
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                        <MessageSquare className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-white group-hover:text-indigo-200 transition-colors">Message</div>
                        <div className="text-xs text-text-secondary">Send a text message</div>
                    </div>
                    <GripVertical className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>

                <div className="space-y-1">
                    <div className="px-3 py-2">
                        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Red Team Ops</h3>
                        <div className="space-y-1">
                            <div
                                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 cursor-grab hover:bg-white/10 hover:border-rose-500/30 transition-all group"
                                onDragStart={(event) => onDragStart(event, 'phishing')}
                                draggable
                            >
                                <div className="p-1.5 rounded-md bg-rose-500/20 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-text-primary">Phishing</span>
                            </div>

                            <div
                                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 cursor-grab hover:bg-white/10 hover:border-orange-500/30 transition-all group"
                                onDragStart={(event) => onDragStart(event, 'payload')}
                                draggable
                            >
                                <div className="p-1.5 rounded-md bg-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    <Skull className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-text-primary">Payload</span>
                            </div>

                            <div
                                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 cursor-grab hover:bg-white/10 hover:border-purple-500/30 transition-all group"
                                onDragStart={(event) => onDragStart(event, 'c2')}
                                draggable
                            >
                                <div className="p-1.5 rounded-md bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    <Radio className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-text-primary">C2 Server</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-surface/50 p-4 rounded-xl border border-white/5 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-all group"
                    onDragStart={(event) => onDragStart(event, 'target')}
                    draggable
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <Target className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-white">Target</span>
                    </div>
                    <p className="text-xs text-text-secondary">Define target domain/IP</p>
                </div>

                <div
                    className="bg-surface/50 p-4 rounded-xl border border-white/5 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-all group"
                    onDragStart={(event) => onDragStart(event, 'port-scan')}
                    draggable
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            <Radar className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-white">Port Scan</span>
                    </div>
                    <p className="text-xs text-text-secondary">Run Nmap scan</p>
                </div>

                <div
                    className="bg-surface/50 p-4 rounded-xl border border-white/5 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-all group"
                    onDragStart={(event) => onDragStart(event, 'condition')}
                    draggable
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                            <GitFork className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-white">Condition</span>
                    </div>
                    <p className="text-xs text-text-secondary">Branching logic</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
