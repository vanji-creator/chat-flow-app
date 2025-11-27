import { create } from 'zustand';
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    OnConnect,
    OnEdgesChange,
    OnNodesChange,
} from '@xyflow/react';
import { io, Socket } from 'socket.io-client';

type NodeStatus = 'pending' | 'running' | 'success' | 'failed';

type ExecutionState = {
    isRunning: boolean;
    activeNodeId: string | null;
    visitedNodeIds: string[];
    logs: string[];
    nodeStatuses: Record<string, NodeStatus>;
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

// Initialize Socket.io
const socket: Socket = io('http://localhost:3001');

const useFlowStore = create<FlowState>((set, get) => {
    // Socket Event Listeners
    socket.on('connect', () => {
        console.log('Connected to backend');
    });

    socket.on('log', (data: { message: string }) => {
        set(state => ({
            execution: {
                ...state.execution,
                logs: [...state.execution.logs, data.message]
            }
        }));
    });

    socket.on('node-start', (data: { nodeId: string }) => {
        set(state => ({
            execution: {
                ...state.execution,
                activeNodeId: data.nodeId,
                visitedNodeIds: [...state.execution.visitedNodeIds, data.nodeId]
            }
        }));
    });

    socket.on('node-status', (data: { nodeId: string; status: NodeStatus }) => {
        set(state => ({
            execution: {
                ...state.execution,
                nodeStatuses: {
                    ...state.execution.nodeStatuses,
                    [data.nodeId]: data.status
                }
            }
        }));
    });

    socket.on('execution-end', () => {
        set(state => ({
            execution: {
                ...state.execution,
                isRunning: false,
                activeNodeId: null,
                logs: [...state.execution.logs, 'Execution completed.']
            }
        }));
    });

    socket.on('error', (data: { message: string }) => {
        set(state => ({
            execution: {
                ...state.execution,
                isRunning: false,
                logs: [...state.execution.logs, `Error: ${data.message} `]
            }
        }));
    });

    return {
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
            nodeStatuses: {},
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
        onConnect: (connection) => {
            set({
                edges: addEdge(connection, get().edges),
            });
        },
        setNodes: (nodes) => set({ nodes }),
        setEdges: (edges) => set({ edges }),
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

        // Execution Logic (Remote)
        runFlow: async () => {
            const { nodes, edges } = get();

            // Reset state
            set({
                execution: {
                    isRunning: true,
                    activeNodeId: null,
                    visitedNodeIds: [],
                    logs: ['Sending flow to backend...'],
                    nodeStatuses: {}
                }
            });

            try {
                const response = await fetch('http://localhost:3001/api/run-flow', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nodes, edges }),
                });

                if (!response.ok) {
                    throw new Error('Failed to start execution');
                }

                const data = await response.json();
                set(state => ({
                    execution: {
                        ...state.execution,
                        logs: [...state.execution.logs, `Execution started(ID: ${data.executionId})`]
                    }
                }));

            } catch (error: any) {
                set(state => ({
                    execution: {
                        ...state.execution,
                        isRunning: false,
                        logs: [...state.execution.logs, `Error: ${error.message} `]
                    }
                }));
            }
        },

        stopFlow: () => {
            // TODO: Implement stop endpoint on backend
            set(state => ({ execution: { ...state.execution, isRunning: false } }));
        },

        resetExecution: () => {
            set({
                execution: {
                    isRunning: false,
                    activeNodeId: null,
                    visitedNodeIds: [],
                    logs: [],
                    nodeStatuses: {}
                }
            });
        }
    };
});

export default useFlowStore;
