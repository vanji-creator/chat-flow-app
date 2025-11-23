import { Save, Layers, Play, Square, RotateCcw } from 'lucide-react';
import useFlowStore from '../store/flowStore';

const Header = () => {
    const { nodes, edges, execution, runFlow, stopFlow, resetExecution } = useFlowStore();
    const { isRunning } = execution;

    const handleSave = () => {
        console.log('Saving flow:', { nodes, edges });
        alert('Flow saved! Check console for data.');
    };

    return (
        <header className="absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl h-16 bg-surface/70 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-between px-6 z-50 shadow-2xl transition-all duration-300 hover:bg-surface/80">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-tight">Chatflow</h1>
                    <p className="text-xs text-text-secondary font-medium">Enterprise Builder</p>
                </div>
            </div>

            {/* Execution Controls */}
            <div className="flex items-center gap-2 bg-black/20 p-1 rounded-xl border border-white/5">
                {!isRunning ? (
                    <button
                        onClick={runFlow}
                        className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        <Play className="w-4 h-4 mr-2 fill-current" />
                        Run Flow
                    </button>
                ) : (
                    <button
                        onClick={stopFlow}
                        className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-400 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                    >
                        <Square className="w-4 h-4 mr-2 fill-current" />
                        Stop
                    </button>
                )}

                <button
                    onClick={resetExecution}
                    className="p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    title="Reset Execution"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-white text-black rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all shadow-lg shadow-white/5 active:scale-95"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Flow
                </button>
            </div>
        </header>
    );
};

export default Header;
