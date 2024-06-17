// src/components/FlowBuilder.tsx
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
  Node,
  Edge,
  Connection,
  OnConnect,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

let id = 0;
const getId = () => `node_${id++}`;

const initialNodes: Node[] = [
  {
    id: getId(),
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 0 },
  },
];

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeLabel, setNodeLabel] = useState<string>('');

  const onConnect: OnConnect = useCallback(
    (params: Edge | Connection) => {
      const sourceExists = edges.some(
        (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle
      );

      if (!sourceExists) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        alert('A source handle can only have one edge originating from it.');
      }
    },
    [edges]
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setNodeLabel(node.data.label);
  };

  const addTextNode = () => {
    const newNode: Node = {
      id: getId(),
      type: 'default',
      data: { label: 'Text Node' },
      position: { x: Math.random() * 600, y: Math.random() * 400 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setNodeLabel(newLabel);

    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id ? { ...node, data: { ...node.data, label: newLabel } } : node
        )
      );
    }
  };

  const deleteNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
      setSelectedNode(null);
      setNodeLabel('');
    }
  };

  const saveFlow = () => {
    const flow = { nodes, edges };
    console.log('Saved Flow:', flow);
    alert('Flow saved to console');
  };

  useEffect(() => {
    if (selectedNode) {
      setNodeLabel(selectedNode.data.label);
    }
  }, [selectedNode]);

  return (
    <div className="flow-builder">
      <div className="nodes-panel">
        <button onClick={addTextNode}>Add Text Node</button>
      </div>
      <div className="flow-area">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {selectedNode && (
        <div className="settings-panel">
          <input
            type="text"
            value={nodeLabel}
            onChange={handleLabelChange}
          />
          <button onClick={deleteNode}>Delete Node</button>
        </div>
      )}
      <div className="save-panel">
        <button onClick={saveFlow}>Save Flow</button>
      </div>
    </div>
  );
};

export default FlowBuilder;
