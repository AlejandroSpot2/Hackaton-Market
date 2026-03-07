"use client";

import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  BaseEdge,
  Controls,
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  MarkerType,
  MiniMap,
  Node,
  ReactFlowInstance,
  getBezierPath
} from "reactflow";

import { NODE_TONE_MAP } from "@/lib/constants";
import { EdgeType, MarketAtlas, NodeType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AtlasCanvasProps {
  atlas: MarketAtlas | null;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

interface AtlasSceneNodeData {
  label: JSX.Element;
  nodeType: NodeType;
}

interface GraphEdgeData {
  active: boolean;
  edgeType: EdgeType;
}

function focusZoom(nodeType: NodeType): number {
  switch (nodeType) {
    case "idea":
      return 0.9;
    case "segment":
      return 0.84;
    default:
      return 0.98;
  }
}

function edgeColor(edgeType: EdgeType, active: boolean): string {
  if (edgeType === "opportunity_in") {
    return active ? "rgba(125, 100, 184, 0.88)" : "rgba(125, 100, 184, 0.35)";
  }

  if (edgeType === "adjacent_to") {
    return active ? "rgba(162, 101, 151, 0.78)" : "rgba(162, 101, 151, 0.28)";
  }

  if (edgeType === "belongs_to_segment") {
    return active ? "rgba(204, 142, 115, 0.78)" : "rgba(204, 142, 115, 0.24)";
  }

  return active ? "rgba(104, 136, 168, 0.8)" : "rgba(99, 3, 48, 0.18)";
}

function countLabel(atlas: MarketAtlas): string[] {
  const competitors = atlas.nodes.filter((node) => node.type === "competitor").length;
  const segments = atlas.nodes.filter((node) => node.type === "segment").length;
  const opportunities = atlas.nodes.filter((node) => node.type === "opportunity").length;

  return [
    `${competitors} competitor${competitors === 1 ? "" : "s"}`,
    `${segments} segment${segments === 1 ? "" : "s"}`,
    `${opportunities} opportunit${opportunities === 1 ? "y" : "ies"}`
  ];
}

function GraphEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  markerEnd,
  data
}: EdgeProps<GraphEdgeData>) {
  const active = data?.active ?? false;
  const stroke = edgeColor(data?.edgeType ?? "competes_with", active);
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: active ? 0.32 : 0.2
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={{
          stroke,
          strokeWidth: active ? 2.3 : 1.25,
          strokeDasharray: data?.edgeType === "adjacent_to" ? "8 12" : undefined,
          filter: active ? `drop-shadow(0 0 10px ${stroke})` : undefined
        }}
      />
      {active && label ? (
        <EdgeLabelRenderer>
          <div
            className="rounded-full border border-white/85 bg-white/72 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary shadow-[0_16px_34px_-24px_rgba(99,3,48,0.32)] backdrop-blur-xl"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

const edgeTypes = {
  graph: GraphEdge
};

export function AtlasCanvas({ atlas, selectedNodeId, onSelectNode }: AtlasCanvasProps) {
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(null);

  useEffect(() => {
    if (!flowInstance || !atlas || atlas.nodes.length === 0) {
      return;
    }

    const focusNode = atlas.nodes.find((node) => node.id === selectedNodeId) ?? atlas.nodes[0];

    void flowInstance.setCenter(focusNode.position.x, focusNode.position.y, {
      zoom: focusZoom(focusNode.type),
      duration: 680
    });
  }, [atlas, flowInstance, selectedNodeId]);

  const focusNode = atlas?.nodes.find((node) => node.id === selectedNodeId) ?? atlas?.nodes[0] ?? null;

  const nodes = useMemo<Node<AtlasSceneNodeData>[]>(() => {
    if (!atlas) {
      return [];
    }

    return atlas.nodes.map((node) => {
      const tone = NODE_TONE_MAP[node.type];
      const isSelected = node.id === selectedNodeId;
      const width = node.type === "segment" ? 270 : node.type === "idea" ? 244 : node.type === "opportunity" ? 220 : 206;

      return {
        id: node.id,
        position: node.position,
        draggable: false,
        selectable: false,
        data: {
          nodeType: node.type,
          label: (
            <div className={cn("atlas-node-shell", `atlas-node-shell--${node.type}`, { "is-selected": isSelected })}>
              <span className="atlas-node-accent" style={{ background: tone.glow }} />
              <span className="glass-chip relative z-10 w-fit !px-2.5 !py-1 !text-[0.62rem]">{tone.chip}</span>
              <strong className="relative z-10 text-[0.98rem] leading-tight font-semibold text-foreground">{node.label}</strong>
              <span className="relative z-10 text-xs leading-5 text-muted-foreground">{node.market_signal}</span>
            </div>
          )
        },
        className: `atlas-node atlas-node--${node.type} ${isSelected ? "is-selected" : ""}`,
        style: {
          width,
          background: "transparent",
          border: "none",
          padding: 0,
          boxShadow: "none"
        }
      };
    });
  }, [atlas, selectedNodeId]);

  const edges = useMemo<Edge<GraphEdgeData>[]>(() => {
    if (!atlas) {
      return [];
    }

    return atlas.edges.map((edge) => {
      const active = edge.source === selectedNodeId || edge.target === selectedNodeId;
      return {
        id: edge.id,
        type: "graph",
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: edge.type === "opportunity_in",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color: edgeColor(edge.type, active)
        },
        data: {
          active,
          edgeType: edge.type
        }
      };
    });
  }, [atlas, selectedNodeId]);

  if (!atlas || atlas.nodes.length === 0) {
    return (
      <div className="glass-panel glass-panel-soft grid min-h-[420px] place-items-center p-8 text-center">
        <div className="space-y-3">
          <p className="section-kicker">Market atlas</p>
          <h3 className="font-serif text-3xl tracking-[-0.03em] text-foreground">The graph appears as soon as the first pulse is ready.</h3>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Queued and running states preserve the run, but the atlas surface remains reserved until the backend writes the first usable result.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-[1.8rem] border border-white/75 bg-white/46 p-5 backdrop-blur-xl lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="section-kicker">Graph surface</p>
          <h3 className="font-serif text-2xl tracking-[-0.03em] text-foreground">Nodes stay interactive while the surrounding analysis keeps moving.</h3>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {countLabel(atlas).map((item) => (
            <span key={item} className="glass-chip">
              {item}
            </span>
          ))}
          <span className="glass-chip">Focus: {focusNode?.label ?? "Pending"}</span>
        </div>
      </div>

      <div className="atlas-canvas-shell">
        <div className="pointer-events-none absolute left-8 top-8 z-[3] flex flex-wrap gap-2.5">
          {Object.entries(NODE_TONE_MAP).map(([type, tone]) => (
            <div key={type} className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/66 px-3 py-1.5 text-xs font-medium text-foreground shadow-[0_12px_28px_-24px_rgba(99,3,48,0.28)] backdrop-blur-xl">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: tone.border }} />
              <span>{tone.chip}</span>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 z-[1]">
          <div className="absolute left-[12%] top-[16%] h-32 w-32 rounded-full bg-[rgba(168,61,116,0.12)] blur-[72px]" />
          <div className="absolute right-[10%] top-[20%] h-36 w-36 rounded-full bg-[rgba(136,185,221,0.16)] blur-[84px]" />
          <div className="absolute bottom-[12%] left-[34%] h-44 w-44 rounded-full bg-[rgba(236,228,251,0.9)] blur-[92px]" />
        </div>

        <div className="relative z-[2] h-[640px]">
          <ReactFlow
            fitView
            fitViewOptions={{ padding: 0.22, duration: 600 }}
            minZoom={0.38}
            maxZoom={1.5}
            nodeOrigin={[0.5, 0.5]}
            nodes={nodes}
            edges={edges}
            edgeTypes={edgeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag
            panOnScroll
            onInit={setFlowInstance}
            onNodeClick={(_, node) => onSelectNode(node.id)}
            proOptions={{ hideAttribution: true }}
          >
            <Controls position="top-right" showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              nodeColor={(node) => {
                const nodeType = (node.data as AtlasSceneNodeData | undefined)?.nodeType ?? "competitor";
                return NODE_TONE_MAP[nodeType].border;
              }}
              maskColor="rgba(255, 255, 255, 0.58)"
              style={{ background: "rgba(255,255,255,0.55)" }}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
