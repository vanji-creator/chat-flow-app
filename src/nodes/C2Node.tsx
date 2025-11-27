import { Handle, Position, NodeProps } from '@xyflow/react';
import { Radio, Signal, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import useFlowStore from '../store/flowStore';

export default function C2Node({ id, data, selected }: NodeProps) {
    const status = useFlowStore((state) => state.execution.nodeStatuses[id]);

    const getStatusColor = () => {
        if (status === 'running') return 'border-blue-500 shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]';
        if (status === 'success') return 'border-green-500 shadow-[0_0_30px_-5px_rgba(34,197,94,0.4)]';
        if (status === 'failed') return 'border-red-500 shadow-[0_0_30px_-5px_rgba(239,68,68,0.4)]';
        return selected ? 'border-purple-500 shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)]' : 'border-white/10 hover:border-white/20';
    };

    const getHeaderColor = () => {
        if (status === 'running') return 'bg-blue-500/10 border-blue-500/20';
        if (status === 'success') return 'bg-green-500/10 border-green-500/20';
        if (status === 'failed') return 'bg-red-500/10 border-red-500/20';
        return selected ? 'border-purple-500/20' : 'border-white/5';
    };

    const getIconBg = () => {
        if (status === 'running') return 'bg-blue-500 text-white animate-pulse';
        if (status === 'success') return 'bg-green-500 text-white';
        if (status === 'failed') return 'bg-red-500 text-white';
        return selected ? 'bg-purple-500 text-white' : 'bg-white/5 text-purple-400';
    };

    return (
        <div
            className={`relative min-w-[200px] rounded-2xl border transition-all duration-300 ${selected ? 'bg-purple-500/10' : 'bg-surface/60 backdrop-blur-xl'} ${getStatusColor()}`}
        >
            {/* Header */}
            <div className={`flex items-center gap-3 p-3 border-b ${getHeaderColor()}`}>
                <div className={`p-2 rounded-xl transition-colors ${getIconBg()}`}>
                    {status === 'running' ? <Loader2 className="w-4 h-4 animate-spin" /> :
                        status === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                            status === 'failed' ? <XCircle className="w-4 h-4" /> :
                                <Radio className="w-4 h-4" />}
                </div>
                <div>
                    <div className="text-sm font-bold text-white">C2 Server</div>
                    <div className="text-[10px] text-purple-400 font-medium tracking-wide uppercase">Command & Control</div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">
                            LHOST
                        </label>
                        <input
                            type="text"
                            placeholder="10.10.x.x"
                            defaultValue={data.lhost as string || '127.0.0.1'}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors font-mono"
                            onChange={(evt) => {
                                data.lhost = evt.target.value;
                            }}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">
                            LPORT
                        </label>
                        <input
                            type="number"
                            placeholder="4444"
                            defaultValue={data.lport as number || 4444}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors font-mono"
                            onChange={(evt) => {
                                data.lport = parseInt(evt.target.value);
                            }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Signal className={`w-3 h-3 text-purple-400 ${status === 'success' ? 'animate-ping' : 'animate-pulse'}`} />
                    <span className="text-[10px] text-purple-300/80 font-mono">
                        {status === 'success' ? 'Connected' : 'Listening...'}
                    </span>
                </div>
            </div>

            {/* Handles */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-surface !border-2 !border-purple-500 transition-transform hover:scale-125"
            />
        </div>
    );
}
