"use client";

import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  useNodesState,
  type Node,
  type Edge,
} from "reactflow";
import { MarketAtlas, AtlasNode } from "@/lib/types";

interface AtlasCanvasProps {
  atlas: MarketAtlas | null;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  isLoading?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  idea: "#f59e0b",
  competitor: "#22c55e",
  segment: "#38bdf8",
  adjacent_category: "#f97316",
  opportunity: "#facc15",
};

function hexRGB(hex: string) {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}

function toFlowNodes(atlas: MarketAtlas, selectedNodeId: string | null): Node[] {
  return atlas.nodes.map((n: AtlasNode, i: number) => {
    const c = TYPE_COLORS[n.type] ?? "#a78bfa";
    const sel = n.id === selectedNodeId;
    return {
      id: n.id,
      position: n.position ?? { x: 80 + (i % 4) * 180, y: 60 + Math.floor(i / 4) * 130 },
      data: { label: n.label },
      draggable: true,
      type: "default",
      style: {
        background: sel ? `rgba(${hexRGB(c)},0.15)` : "rgba(7,15,28,0.95)",
        border: sel ? `2px solid ${c}` : "1px solid rgba(99,120,170,0.25)",
        borderRadius: 12, padding: "10px 14px", fontSize: 12, fontWeight: 600,
        color: sel ? c : "#c8d7f0", cursor: "pointer",
        boxShadow: sel ? `0 0 16px ${c}44` : "none",
        transition: "all 0.25s",
      },
    };
  });
}

function toFlowEdges(atlas: MarketAtlas): Edge[] {
  return atlas.edges.map((e) => ({
    id: e.id ?? `${e.source}-${e.target}`,
    source: e.source,
    target: e.target,
    animated: true,
    style: { stroke: "rgba(167,139,250,0.35)", strokeWidth: 1.6 },
  }));
}

export function AtlasCanvas({ atlas, selectedNodeId, onSelectNode, isLoading }: AtlasCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [rfEdges, setRfEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!atlas) return;
    setNodes((prev) => {
      const next = toFlowNodes(atlas, selectedNodeId);
      if (!prev.length) return next;
      return next.map((n) => {
        const old = prev.find((p) => p.id === n.id);
        return old ? { ...n, position: old.position } : n;
      });
    });
    setRfEdges(toFlowEdges(atlas));
  }, [atlas, selectedNodeId, setNodes]);

  const onNodeClick = useCallback((_: unknown, n: Node) => onSelectNode(n.id), [onSelectNode]);

  if (isLoading || !atlas) {
    return (
      <div style={{ height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", border: "2px dashed rgba(56,189,248,0.3)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <span style={{ fontSize: 26 }}>🗺️</span>
        </div>
        <p style={{ fontSize: 12, color: "#7e90b8", marginTop: 16 }}>Building market atlas…</p>
      </div>
    );
  }

  return (
    <div style={{ height: 320, borderRadius: 12, overflow: "hidden" }}>
      <ReactFlow
        nodes={nodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="rgba(126,144,184,0.08)" />
      </ReactFlow>
    </div>
  );
}