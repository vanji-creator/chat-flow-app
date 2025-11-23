import { useEffect, useState } from 'react';
import useFlowStore from '../store/flowStore';
import { X, Settings2 } from 'lucide-react';

const PropertiesPanel = () => {
    const { nodes, updateNodeData } = useFlowStore();
    const [selectedNode, setSelectedNode] = useState<any>(null);

    useEffect(() => {
        const node = nodes.find((n) => n.selected);
        setSelectedNode(node || null);
    }, [nodes]);

    if (!selectedNode) return null;

    const handleChange = (field: string, value: string) => {
        updateNodeData(selectedNode.id, { [field]: value });
    };

    return (
        <aside className="absolute right-6 top-24 w-80 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col shadow-2xl z-40 animate-slide-in">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-sm font-bold text-white tracking-wide">Properties</h2>
                </div>
                <button
                    onClick={() => setSelectedNode(null)}
                    className="text-text-secondary hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-2">
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Label
                    </label>
                    <input
                        type="text"
                        value={selectedNode.data.label || ''}
                        onChange={(e) => handleChange('label', e.target.value)}
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        placeholder="Enter label..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Content
                    </label>
                    <textarea
                        rows={6}
                        value={selectedNode.data.content || ''}
                        onChange={(e) => handleChange('content', e.target.value)}
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                        placeholder="Enter message content..."
                    />
                </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20 rounded-b-2xl">
                <p className="text-xs text-text-secondary text-center">
                    ID: <span className="font-mono text-indigo-400">{selectedNode.id}</span>
                </p>
            </div>
        </aside>
    );
};

export default PropertiesPanel;
