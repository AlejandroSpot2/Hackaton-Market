"use client";

import ReactFlow, { Background, Controls, Edge, Node, useNodesState, useEdgesState } from "reactflow";
import { MarketAtlas, NodeType } from "@/lib/types";
import { useMemo } from "react";

interface AtlasCanvasProps {
  atlas: MarketAtlas | null;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  isLoading?: boolean;
}

const toneMap: Record<NodeType, { border: string; background: string; chip: string; glow: string }> = {
  idea: { border: "#f59e0b", background: "rgba(245,158,11,0.1)", chip: "💡 Idea", glow: "rgba(245,158,11,0.4)" },
  competitor: { border: "#22c55e", background: "rgba(34,197,94,0.1)", chip: "⚔️ Competitor", glow: "rgba(34,197,94,0.4)" },
  segment: { border: "#38bdf8", background: "rgba(56,189,248,0.1)", chip: "📊 Segment", glow: "rgba(56,189,248,0.4)" },
  adjacent_category: { border: "#f97316", background: "rgba(249,115,22,0.1)", chip: "🔗 Adjacent", glow: "rgba(249,115,22,0.4)" },
  opportunity: { border: "#facc15", background: "rgba(250,204,21,0.1)", chip: "🌟 Opportunity", glow: "rgba(250,204,21,0.4)" },
};

function LoadingAtlas() {
  return (
    <div className="loading-stage">
      <div className="loading-wrapper">
        <div className="orbit-center">
          <div className="orbit-nucleus">🧠</div>
          <div className="orbit-particle" />
          <div className="orbit-particle" />
          <div className="orbit-particle" />
        </div>
        <div className="loading-text">
          <div className="loading-phase">Building market atlas</div>
          <div className="loading-detail">Scanning competitive landscape</div>
        </div>
      </div>
    </div>
  );
}

export function AtlasCanvas({ atlas, selectedNodeId, onSelectNode, isLoading }: AtlasCanvasProps) {
  if (isLoading || !atlas || atlas.nodes.length === 0) {
    return <LoadingAtlas />;
  }

  const initialNodes: Node[] = atlas.nodes.map((node) => {
    const tone = toneMap[node.type];
    const isSelected = node.id === selectedNodeId;
    return {
      id: node.id,
      position: node.position,
      data: {
        label: (
          <div>
            <div className="flow-node-kicker">{tone.chip}</div>
            <div className="flow-node-title">{node.label}</div>
            <div className="flow-node-signal">{node.market_signal}</div>
          </div>
        )
      },
      style: {
        width: 200,
        borderRadius: 16,
        border: `1.5px solid ${isSelected ? tone.border : "rgba(99,120,170,0.25)"}`,
        background: isSelected ? tone.background : "rgba(9,16,32,0.96)",
        color: "#eef2ff",
        padding: 12,
        boxShadow: isSelected
          ? `0 0 0 2px ${tone.glow}, 0 16px 40px rgba(0,0,0,0.5)`
          : "0 8px 24px rgba(0,0,0,0.4)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        animation: "node-appear 0.4s ease both",
      }
    };
  });

  const initialEdges: Edge[] = atlas.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    animated: edge.type === "competes_with" || edge.type === "opportunity_in",
    style: {
      stroke: edge.type === "competes_with" ? "rgba(248,113,113,0.5)" :
        edge.type === "opportunity_in" ? "rgba(250,204,21,0.5)" :
          "rgba(99,120,170,0.4)",
      strokeWidth: 1.5,
    },
    labelStyle: { fill: "#9aa7c4", fontSize: 10 },
    labelBgStyle: { fill: "rgba(5,12,24,0.9)", fillOpacity: 1 },
  }));

  return (
    <div className="atlas-stage">
      <ReactFlowInner
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        onSelectNode={onSelectNode}
      />
    </div>
  );
}

function ReactFlowInner({ initialNodes, initialEdges, onSelectNode }: {
  initialNodes: Node[];
  initialEdges: Edge[];
  onSelectNode: (id: string) => void;
}) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      nodesDraggable={true}
      nodesConnectable={false}
      onNodeClick={(_, node) => onSelectNode(node.id)}
      fitView
      panOnScroll
      minZoom={0.3}
    >
      <Background color="rgba(99,120,170,0.07)" gap={24} />
      <Controls
        style={{
          background: "rgba(9,16,32,0.9)",
          border: "1px solid rgba(99,120,170,0.2)",
          borderRadius: 12,
        }}
      />
    </ReactFlow>
  );
}