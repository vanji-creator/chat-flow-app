
import { create } from 'zustand';

type ActiveView = 'flow' | 'terminal' | 'docs';

type ViewState = {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
};

const useViewStore = create<ViewState>((set) => ({
    activeView: 'flow',
    setActiveView: (view) => set({ activeView: view }),
}));

export default useViewStore;
