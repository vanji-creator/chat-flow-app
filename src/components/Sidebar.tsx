import { MessageSquare, GripVertical, GitFork } from 'lucide-react';

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

                <div
                    className="group flex items-center p-3 bg-white/5 border border-white/5 rounded-xl cursor-grab active:cursor-grabbing hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-200"
                    onDragStart={(event) => onDragStart(event, 'condition')}
                    draggable
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500/20 to-orange-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                        <GitFork className="w-5 h-5 text-rose-400 group-hover:text-rose-300" />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-white group-hover:text-rose-200 transition-colors">Condition</div>
                        <div className="text-xs text-text-secondary">Branch logic flow</div>
                    </div>
                    <GripVertical className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
