import { Handle, Position, NodeProps } from '@xyflow/react';
import { Mail, AlertTriangle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import useFlowStore from '../store/flowStore';

export default function PhishingNode({ id, data, selected }: NodeProps) {
    const status = useFlowStore((state) => state.execution.nodeStatuses[id]);

    const getStatusColor = () => {
        if (status === 'running') return 'border-blue-500 shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]';
        if (status === 'success') return 'border-green-500 shadow-[0_0_30px_-5px_rgba(34,197,94,0.4)]';
        if (status === 'failed') return 'border-red-500 shadow-[0_0_30px_-5px_rgba(239,68,68,0.4)]';
        return selected ? 'border-rose-500 shadow-[0_0_30px_-5px_rgba(244,63,94,0.4)]' : 'border-white/10 hover:border-white/20';
    };

    const getHeaderColor = () => {
        if (status === 'running') return 'bg-blue-500/10 border-blue-500/20';
        if (status === 'success') return 'bg-green-500/10 border-green-500/20';
        if (status === 'failed') return 'bg-red-500/10 border-red-500/20';
        return selected ? 'border-rose-500/20' : 'border-white/5';
    };

    const getIconBg = () => {
        if (status === 'running') return 'bg-blue-500 text-white animate-pulse';
        if (status === 'success') return 'bg-green-500 text-white';
        if (status === 'failed') return 'bg-red-500 text-white';
        return selected ? 'bg-rose-500 text-white' : 'bg-white/5 text-rose-400';
    };

    return (
        <div
            className={`relative min-w-[200px] rounded-2xl border transition-all duration-300 ${selected ? 'bg-rose-500/10' : 'bg-surface/60 backdrop-blur-xl'} ${getStatusColor()}`}
        >
            {/* Header */}
            <div className={`flex items-center gap-3 p-3 border-b ${getHeaderColor()}`}>
                <div className={`p-2 rounded-xl transition-colors ${getIconBg()}`}>
                    {status === 'running' ? <Loader2 className="w-4 h-4 animate-spin" /> :
                        status === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                            status === 'failed' ? <XCircle className="w-4 h-4" /> :
                                <Mail className="w-4 h-4" />}
                </div>
                <div>
                    <div className="text-sm font-bold text-white">Phishing Campaign</div>
                    <div className="text-[10px] text-rose-400 font-medium tracking-wide uppercase">Initial Access</div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div>
                    <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">
                        Success Rate (%)
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={data.successRate as number || 30}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors font-mono"
                            onChange={(evt) => {
                                data.successRate = parseInt(evt.target.value);
                            }}
                        />
                        <span className="text-xs text-text-secondary">%</span>
                    </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <AlertTriangle className="w-3 h-3 text-rose-400 mt-0.5" />
                    <p className="text-[10px] text-rose-300/80 leading-tight">
                        Simulates user click behavior based on probability.
                    </p>
                </div>
            </div>

            {/* Handles */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-surface !border-2 !border-rose-500 transition-transform hover:scale-125"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-rose-500 !border-2 !border-surface transition-transform hover:scale-125"
            />
        </div>
    );
}
