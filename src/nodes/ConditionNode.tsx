import { Handle, Position } from '@xyflow/react';
import { GitFork } from 'lucide-react';

const ConditionNode = ({ data, selected }: { data: any; selected: boolean }) => {
    return (
        <div
            className={`relative w-64 shadow-xl rounded-2xl border transition-all duration-300 group ${selected
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
                    <GitFork className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-white tracking-wide">Condition</span>
            </div>

            <div className="p-5">
                <div className="text-sm font-semibold text-white mb-2">{data.label || 'Check Condition'}</div>
                <div className="text-xs text-text-secondary leading-relaxed">
                    {data.content || 'If variable equals value...'}
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

            {/* True Output */}
            <div className="absolute -right-2 top-10 flex items-center">
                <span className="absolute right-4 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">True</span>
                <Handle
                    type="source"
                    position={Position.Right}
                    id="true"
                    className={`!w-4 !h-4 !border-4 transition-all duration-300 ${selected
                            ? '!bg-indigo-500 !border-surface'
                            : '!bg-surface-highlight !border-surface group-hover:!bg-indigo-400'
                        }`}
                />
            </div>

            {/* False Output */}
            <div className="absolute -right-2 bottom-10 flex items-center">
                <span className="absolute right-4 text-[10px] font-bold text-rose-400 uppercase tracking-wider">False</span>
                <Handle
                    type="source"
                    position={Position.Right}
                    id="false"
                    className={`!w-4 !h-4 !border-4 transition-all duration-300 ${selected
                            ? '!bg-rose-500 !border-surface'
                            : '!bg-surface-highlight !border-surface group-hover:!bg-rose-400'
                        }`}
                    style={{ top: 'auto', bottom: '40px' }}
                />
            </div>
        </div>
    );
};

export default ConditionNode;
