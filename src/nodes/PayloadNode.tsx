import { Handle, Position, NodeProps } from '@xyflow/react';
import { Skull, Terminal, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import useFlowStore from '../store/flowStore';

export default function PayloadNode({ id, data, selected }: NodeProps) {
    const status = useFlowStore((state) => state.execution.nodeStatuses[id]);

    const getStatusColor = () => {
        if (status === 'running') return 'border-blue-500 shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]';
        if (status === 'success') return 'border-green-500 shadow-[0_0_30px_-5px_rgba(34,197,94,0.4)]';
        if (status === 'failed') return 'border-red-500 shadow-[0_0_30px_-5px_rgba(239,68,68,0.4)]';
        return selected ? 'border-orange-500 shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)]' : 'border-white/10 hover:border-white/20';
    };

    const getHeaderColor = () => {
        if (status === 'running') return 'bg-blue-500/10 border-blue-500/20';
        if (status === 'success') return 'bg-green-500/10 border-green-500/20';
        if (status === 'failed') return 'bg-red-500/10 border-red-500/20';
        return selected ? 'border-orange-500/20' : 'border-white/5';
    };

    const getIconBg = () => {
        if (status === 'running') return 'bg-blue-500 text-white animate-pulse';
        if (status === 'success') return 'bg-green-500 text-white';
        if (status === 'failed') return 'bg-red-500 text-white';
        return selected ? 'bg-orange-500 text-white' : 'bg-white/5 text-orange-400';
    };

    return (
        <div
            className={`relative min-w-[200px] rounded-2xl border transition-all duration-300 ${selected ? 'bg-orange-500/10' : 'bg-surface/60 backdrop-blur-xl'} ${getStatusColor()}`}
        >
            {/* Header */}
            <div className={`flex items-center gap-3 p-3 border-b ${getHeaderColor()}`}>
                <div className={`p-2 rounded-xl transition-colors ${getIconBg()}`}>
                    {status === 'running' ? <Loader2 className="w-4 h-4 animate-spin" /> :
                        status === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                            status === 'failed' ? <XCircle className="w-4 h-4" /> :
                                <Skull className="w-4 h-4" />}
                </div>
                <div>
                    <div className="text-sm font-bold text-white">Malware Payload</div>
                    <div className="text-[10px] text-orange-400 font-medium tracking-wide uppercase">Execution</div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div>
                    <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">
                        Payload Type
                    </label>
                    <select
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors font-mono appearance-none"
                        defaultValue={data.payloadType as string || 'reverse_shell'}
                        onChange={(evt) => {
                            data.payloadType = evt.target.value;
                        }}
                    >
                        <option value="reverse_shell">Reverse Shell (TCP)</option>
                        <option value="ransomware">Ransomware Sim</option>
                        <option value="keylogger">Keylogger</option>
                        <option value="beacon">Cobalt Strike Beacon</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-text-secondary font-mono">
                    <Terminal className="w-3 h-3" />
                    <span>{status === 'success' ? 'Payload Executed' : 'Waiting for execution...'}</span>
                </div>
            </div>

            {/* Handles */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-surface !border-2 !border-orange-500 transition-transform hover:scale-125"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-orange-500 !border-2 !border-surface transition-transform hover:scale-125"
            />
        </div>
    );
}
