import { create } from 'zustand';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    getOutgoers,
} from '@xyflow/react';

type ExecutionState = {
    isRunning: boolean;
    activeNodeId: string | null;
    visitedNodeIds: string[];
    logs: string[];
};

type FlowState = {
    nodes: Node[];
    edges: Edge[];
    execution: ExecutionState;

    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;

    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (node: Node) => void;
    updateNodeData: (nodeId: string, data: any) => void;

    // Execution Actions
    runFlow: () => void;
    stopFlow: () => void;
    resetExecution: () => void;
};

const useFlowStore = create<FlowState>((set, get) => ({
    nodes: [
        {
            id: '1',
            type: 'message',
            position: { x: 250, y: 5 },
            data: { label: 'Welcome Message', content: 'Hello! How can I help you today?' },
        },
    ],
    edges: [],
    execution: {
        isRunning: false,
        activeNodeId: null,
        visitedNodeIds: [],
        logs: [],
    },

    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
    },
    setNodes: (nodes: Node[]) => {
        set({ nodes });
    },
    setEdges: (edges: Edge[]) => {
        set({ edges });
    },
    addNode: (node: Node) => {
        set({
            nodes: [...get().nodes, node],
        });
    },
    updateNodeData: (nodeId: string, data: any) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, ...data } };
                }
                return node;
            }),
        });
    },

    // Execution Logic
    runFlow: async () => {
        const { nodes, edges } = get();

        // Reset state
        set({
            execution: {
                isRunning: true,
                activeNodeId: null,
                visitedNodeIds: [],
                logs: ['Starting execution...']
            }
        });

        // Find start node (node with no incoming edges, or just the first one for now)
        // For simplicity, let's assume the first node is the start or look for one.
        // Better: Look for a node with no incoming edges.
        const incomingEdges = new Set(edges.map(e => e.target));
        const startNode = nodes.find(n => !incomingEdges.has(n.id)) || nodes[0];

        if (!startNode) {
            set(state => ({ execution: { ...state.execution, isRunning: false, logs: [...state.execution.logs, 'No start node found.'] } }));
            return;
        }

        let currentNode: Node | undefined = startNode;

        while (currentNode && get().execution.isRunning) {
            // Highlight current node
            set(state => ({
                execution: {
                    ...state.execution,
                    activeNodeId: currentNode!.id,
                    visitedNodeIds: [...state.execution.visitedNodeIds, currentNode!.id],
                    logs: [...state.execution.logs, `Executing node: ${currentNode!.data.label || currentNode!.id}`]
                }
            }));

            // Simulate processing time (Animation effect)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Determine next node
            const outgoers = getOutgoers(currentNode, nodes, edges);

            if (outgoers.length === 0) {
                currentNode = undefined; // End of flow
            } else if (outgoers.length === 1) {
                currentNode = outgoers[0]; // Simple transition
            } else {
                // Branching logic (Condition Node)
                if (currentNode.type === 'condition') {
                    // Mock logic: Randomly choose True or False
                    const isTrue = Math.random() > 0.5;
                    const handleId = isTrue ? 'true' : 'false';

                    set(state => ({
                        execution: {
                            ...state.execution,
                            logs: [...state.execution.logs, `Condition evaluated to: ${isTrue ? 'TRUE' : 'FALSE'}`]
                        }
                    }));

                    // Find edge connected to the specific handle
                    const edge = edges.find(e => e.source === currentNode!.id && e.sourceHandle === handleId);
                    currentNode = edge ? nodes.find(n => n.id === edge.target) : undefined;
                } else {
                    // Default to first output if not a condition node (or handle parallel later)
                    currentNode = outgoers[0];
                }
            }
        }

        set(state => ({
            execution: {
                ...state.execution,
                isRunning: false,
                activeNodeId: null,
                logs: [...state.execution.logs, 'Execution completed.']
            }
        }));
    },

    stopFlow: () => {
        set(state => ({ execution: { ...state.execution, isRunning: false } }));
    },

    resetExecution: () => {
        set({
            execution: {
                isRunning: false,
                activeNodeId: null,
                visitedNodeIds: [],
                logs: []
            }
        });
    }
}));

export default useFlowStore;
