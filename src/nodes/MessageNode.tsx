import { Handle, Position } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';

const MessageNode = ({ data, selected }: { data: any; selected: boolean }) => {
    return (
        <div
            className={`relative w-72 shadow-xl rounded-2xl border transition-all duration-300 group ${selected
                    ? 'border-indigo-500 shadow-indigo-500/20 bg-surface'
                    : 'border-white/5 bg-surface/50 hover:border-white/10 hover:bg-surface'
                }`}
        >
            {/* Glow Effect */}
            {selected && (
                <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl -z-10 opacity-50 blur-sm" />
            )}

            <div className={`flex items-center px-4 py-3 border-b rounded-t-2xl transition-colors ${selected ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/5 border-white/5'
                }`}>
                <div className={`p-2 rounded-lg mr-3 ${selected ? 'bg-indigo-500 text-white' : 'bg-white/10 text-text-secondary'
                    }`}>
                    <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-white tracking-wide">Message</span>
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
                className={`!w-4 !h-4 !border-4 transition-all duration-300 ${selected
                        ? '!bg-indigo-500 !border-surface'
                        : '!bg-surface-highlight !border-surface group-hover:!bg-indigo-400'
                    }`}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={`!w-4 !h-4 !border-4 transition-all duration-300 ${selected
                        ? '!bg-indigo-500 !border-surface'
                        : '!bg-surface-highlight !border-surface group-hover:!bg-indigo-400'
                    }`}
            />
        </div>
    );
};

export default MessageNode;
