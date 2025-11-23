import { Handle, Position } from '@xyflow/react';
import { GitFork } from 'lucide-react';
import useFlowStore from '../store/flowStore';

const ConditionNode = ({ id, data, selected }: { id: string; data: any; selected: boolean }) => {
    const execution = useFlowStore((state) => state.execution);
    const isActive = execution.activeNodeId === id;
    const isVisited = execution.visitedNodeIds.includes(id);

    return (
        <div
            className={`relative w-64 shadow-xl rounded-2xl border transition-all duration-500 group ${isActive
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
                    <GitFork className="w-4 h-4" />
                </div>
                <span className={`text-sm font-bold tracking-wide transition-colors duration-500 ${isActive ? 'text-emerald-400' : 'text-white'
                    }`}>Condition</span>
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
                className={`!w-4 !h-4 !border-4 transition-all duration-300 ${isActive
                    ? '!bg-emerald-500 !border-surface'
                    : selected
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
                    className={`!w-4 !h-4 !border-4 transition-all duration-300 ${isActive
                        ? '!bg-emerald-500 !border-surface'
                        : selected
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
                    className={`!w-4 !h-4 !border-4 transition-all duration-300 ${isActive
                        ? '!bg-emerald-500 !border-surface'
                        : selected
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
