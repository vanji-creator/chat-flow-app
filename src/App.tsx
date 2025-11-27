import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useShallow } from 'zustand/react/shallow';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import useFlowStore from './store/flowStore';
import useViewStore from './store/viewStore';
import { nodeTypes } from './nodes';
import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import Layout from './components/Layout';
import TerminalView from './views/TerminalView';
import DocsView from './views/DocsView';
import { useState } from 'react';
import { Save, FolderOpen, Play } from 'lucide-react';

const selector = (state: any) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
});

function FlowBuilder() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, setNodes, setEdges } = useFlowStore(
    useShallow(selector)
  );

  const [flowName, setFlowName] = useState('Untitled Flow');
  const [flows, setFlows] = useState<any[]>([]);
  const [showLoadMenu, setShowLoadMenu] = useState(false);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const position = {
      x: event.clientX - 300, // Adjust for sidebar
      y: event.clientY - 100, // Adjust for header
    };

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { label: `${type} node` },
    };

    addNode(newNode);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: flowName, nodes, edges })
      });
      const data = await response.json();
      alert(`Flow saved: ${data.id}`);
    } catch (error) {
      console.error('Failed to save flow:', error);
      alert('Failed to save flow');
    }
  };

  const loadFlows = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/flows');
      const data = await response.json();
      setFlows(data);
      setShowLoadMenu(true);
    } catch (error) {
      console.error('Failed to load flows:', error);
    }
  };

  const handleLoad = (flow: any) => {
    setNodes(flow.nodes);
    setEdges(flow.edges);
    setFlowName(flow.name);
    setShowLoadMenu(false);
  };

  const handleRun = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/run-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges })
      });
      const data = await response.json();
      console.log('Execution started:', data.executionId);
    } catch (error) {
      console.error('Failed to run flow:', error);
    }
  };

  return (
    <div className="flex-1 relative h-full flex flex-col">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-surface/80 backdrop-blur-xl p-1.5 rounded-xl border border-white/10 shadow-2xl">
        <input
          type="text"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          className="bg-transparent border-none text-white font-medium focus:ring-0 text-sm w-32 text-center"
        />
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button onClick={handleSave} className="p-2 hover:bg-white/10 rounded-lg text-text-secondary hover:text-white transition-colors" title="Save Flow">
          <Save className="w-4 h-4" />
        </button>
        <div className="relative">
          <button onClick={loadFlows} className="p-2 hover:bg-white/10 rounded-lg text-text-secondary hover:text-white transition-colors" title="Load Flow">
            <FolderOpen className="w-4 h-4" />
          </button>
          {showLoadMenu && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
              {flows.map(flow => (
                <button
                  key={flow.id}
                  onClick={() => handleLoad(flow)}
                  className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-white/5 hover:text-white"
                >
                  {flow.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button onClick={handleRun} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors">
          <Play className="w-3 h-3" />
          Run
        </button>
      </div>

      <div className="flex-1 flex relative">
        <Sidebar />
        <PropertiesPanel />

        <div className="flex-1 h-full w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDragOver={onDragOver}
            onDrop={onDrop}
            defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
            fitView
            className="bg-background"
          >
            <Background color="#4f46e5" gap={20} size={1} className="opacity-5" />
            <Controls className="!bg-surface !border-white/10 !fill-white [&>button]:!border-b-white/10 hover:[&>button]:!bg-white/5" />
            <MiniMap
              className="!bg-surface !border-white/10 !rounded-xl overflow-hidden"
              nodeColor="#6366f1"
              maskColor="rgba(0, 0, 0, 0.3)"
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

function App() {
  const activeView = useViewStore((state) => state.activeView);

  return (
    <ReactFlowProvider>
      <Layout>
        {activeView === 'flow' && <FlowBuilder />}
        {activeView === 'terminal' && <TerminalView />}
        {activeView === 'docs' && <DocsView />}
      </Layout>
    </ReactFlowProvider>
  );
}

export default App;
