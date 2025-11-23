import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useReactFlow,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import Header from './components/Header';
import useFlowStore from './store/flowStore';
import { nodeTypes } from './nodes';

const Flow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
  } = useFlowStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: crypto.randomUUID(),
        type,
        position,
        data: { label: 'New Message', content: '' },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  return (
    <div className="relative w-screen h-screen bg-background overflow-hidden font-sans">
      <Header />

      <div className="absolute inset-0 z-0" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          minZoom={0.5}
          maxZoom={2}
          className="bg-background"
          proOptions={{ hideAttribution: true }}
        >
          <Background
            color="#27272a"
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
          />
          <Controls
            className="!bg-surface/90 !backdrop-blur-md !border-border !fill-text-primary !shadow-2xl rounded-xl overflow-hidden m-4"
            position="bottom-left"
            showInteractive={false}
          />
        </ReactFlow>
      </div>

      <Sidebar />
      <PropertiesPanel />
    </div>
  );
};

const App = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
};

export default App;
