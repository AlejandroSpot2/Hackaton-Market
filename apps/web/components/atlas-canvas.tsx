"use client";

import ReactFlow, { Background, Controls, Edge, MiniMap, Node } from "reactflow";

import { MarketAtlas, NodeType } from "@/lib/types";

interface AtlasCanvasProps {
  atlas: MarketAtlas | null;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

const toneMap: Record<NodeType, { border: string; background: string; chip: string }> = {
  idea: { border: "#f59e0b", background: "rgba(245, 158, 11, 0.12)", chip: "Idea" },
  competitor: { border: "#22c55e", background: "rgba(34, 197, 94, 0.12)", chip: "Competitor" },
  segment: { border: "#38bdf8", background: "rgba(56, 189, 248, 0.12)", chip: "Segment" },
  adjacent_category: { border: "#f97316", background: "rgba(249, 115, 22, 0.12)", chip: "Adjacent" },
  opportunity: { border: "#facc15", background: "rgba(250, 204, 21, 0.14)", chip: "Opportunity" }
};

export function AtlasCanvas({ atlas, selectedNodeId, onSelectNode }: AtlasCanvasProps) {
  if (!atlas || atlas.nodes.length === 0) {
    return <div className="empty-state">The atlas appears here as soon as the first pulse is ready.</div>;
  }

  const nodes: Node[] = atlas.nodes.map((node) => {
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
        width: 190,
        borderRadius: 18,
        border: `1px solid ${tone.border}`,
        background: tone.background,
        color: "#f4f7ff",
        padding: 10,
        boxShadow: isSelected ? `0 0 0 1px ${tone.border}` : "0 14px 32px rgba(5, 10, 24, 0.24)"
      }
    };
  });

  const edges: Edge[] = atlas.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    animated: edge.type === "competes_with" || edge.type === "opportunity_in",
    style: { stroke: "rgba(157, 170, 204, 0.7)", strokeWidth: 1.4 },
    labelStyle: { fill: "#cdd6ea", fontSize: 11 },
    labelBgStyle: { fill: "rgba(8, 13, 28, 0.9)", fillOpacity: 1 }
  }));

  return (
    <div className="atlas-stage">
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        nodesDraggable={false}
        nodesConnectable={false}
        onNodeClick={(_, node) => onSelectNode(node.id)}
        panOnScroll
      >
        <Background color="rgba(148, 163, 184, 0.14)" gap={20} />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </div>
  );
}