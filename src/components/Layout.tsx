import { ReactNode } from 'react';
import { LayoutDashboard } from 'lucide-react';
import useViewStore from '../store/viewStore';

const Layout = ({ children }: { children: ReactNode }) => {
    const { activeView, setActiveView } = useViewStore();

    return (
        <div className="flex h-screen bg-background text-text-primary overflow-hidden font-sans selection:bg-indigo-500/30 relative">

            {/* Top Right Mode Switcher */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-surface/80 backdrop-blur-xl p-1.5 rounded-xl border border-white/10 shadow-2xl">
                <button
                    onClick={() => setActiveView('flow')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${activeView === 'flow'
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                        }`}
                >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-sm font-medium">Flow</span>
                </button>
                <button
                    onClick={() => setActiveView('terminal')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === 'terminal'
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    Terminal
                </button>
                <button
                    onClick={() => setActiveView('docs')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === 'docs'
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    Docs
                </button>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-hidden w-full h-full">
                {children}
            </main>
        </div>
    );
};

export default Layout;
