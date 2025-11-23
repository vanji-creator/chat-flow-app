import { Handle, Position } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';
import useFlowStore from '../store/flowStore';

const MessageNode = ({ id, data, selected }: { id: string; data: any; selected: boolean }) => {
    const execution = useFlowStore((state) => state.execution);
    const isActive = execution.activeNodeId === id;
    const isVisited = execution.visitedNodeIds.includes(id);

    return (
        <div
            className={`relative w-72 shadow-xl rounded-2xl border transition-all duration-500 group ${isActive
                ? 'border-emerald-500 shadow-emerald-500/50 bg-surface scale-105'
                : selected
                    ? 'border-indigo-500 shadow-indigo-500/20 bg-surface'
                    : isVisited
                        ? 'border-emerald-500/30 bg-surface/50'
                        : 'border-white/5 bg-surface/50 hover:border-white/10 hover:bg-surface'
                }`}
        >
            {/* Glow Effect */}
            {(selected || isActive) && (
                <div className={`absolute -inset-[1px] bg-gradient-to-r rounded-2xl -z-10 opacity-50 blur-sm transition-all duration-500 ${isActive ? 'from-emerald-500 to-teal-400 opacity-100' : 'from-indigo-500 to-violet-600'
                    }`} />
            )}

            <div className={`flex items-center px-4 py-3 border-b rounded-t-2xl transition-colors duration-500 ${isActive
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : selected
                    ? 'bg-indigo-500/10 border-indigo-500/20'
                    : 'bg-white/5 border-white/5'
                }`}>
                <div className={`p-2 rounded-lg mr-3 transition-colors duration-500 ${isActive
                    ? 'bg-emerald-500 text-white'
                    : selected
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white/10 text-text-secondary'
                    }`}>
                    <MessageSquare className="w-4 h-4" />
                </div>
                <span className={`text-sm font-bold tracking-wide transition-colors duration-500 ${isActive ? 'text-emerald-400' : 'text-white'
                    }`}>Message</span>
            </div>

            <div className="p-5">
                <div className="text-sm font-semibold text-white mb-2">{data.label}</div>
                <div className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                    {data.content || 'No content'}
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Left}
                className={`!w-4 !h-4 !border-4 transition-all duration-300 ${isActive
                    ? '!bg-emerald-500 !border-surface'
                    : selected
                        ? '!bg-indigo-500 !border-surface'
                        : '!bg-surface-highlight !border-surface group-hover:!bg-indigo-400'
                    }`}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={`!w-4 !h-4 !border-4 transition-all duration-300 ${isActive
                    ? '!bg-emerald-500 !border-surface'
                    : selected
                        ? '!bg-indigo-500 !border-surface'
                        : '!bg-surface-highlight !border-surface group-hover:!bg-indigo-400'
                    }`}
            />
        </div>
    );
};

export default MessageNode;
