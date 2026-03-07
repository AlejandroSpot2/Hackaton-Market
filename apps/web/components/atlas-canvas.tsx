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

interface AtlasCanvasProps {
  atlas: MarketAtlas | null;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

interface AtlasSceneNodeData {
  label: JSX.Element;
  nodeType: NodeType;
}

interface LeyLineData {
  active: boolean;
  edgeType: EdgeType;
}

function focusZoom(nodeType: NodeType): number {
  switch (nodeType) {
    case "idea":
      return 0.92;
    case "segment":
      return 0.85;
    default:
      return 1.02;
  }
}

function edgeColor(edgeType: EdgeType, active: boolean): string {
  if (edgeType === "opportunity_in") {
    return active ? "rgba(246, 208, 115, 0.96)" : "rgba(246, 208, 115, 0.46)";
  }

  if (edgeType === "adjacent_to") {
    return active ? "rgba(255, 176, 118, 0.92)" : "rgba(255, 176, 118, 0.34)";
  }

  return active ? "rgba(140, 214, 255, 0.94)" : "rgba(148, 163, 184, 0.34)";
}

function countLabel(atlas: MarketAtlas): string[] {
  const competitors = atlas.nodes.filter((node) => node.type === "competitor").length;
  const segments = atlas.nodes.filter((node) => node.type === "segment").length;
  const opportunities = atlas.nodes.filter((node) => node.type === "opportunity").length;

  return [
    `${competitors} rival${competitors === 1 ? "" : "s"}`,
    `${segments} market biome${segments === 1 ? "" : "s"}`,
    `${opportunities} live wedge${opportunities === 1 ? "" : "s"}`
  ];
}

function LeyLineEdge({
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
}: EdgeProps<LeyLineData>) {
  const active = Boolean(data?.active);
  const stroke = edgeColor(data?.edgeType ?? "competes_with", active);
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: active ? 0.34 : 0.26
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={{
          stroke,
          strokeWidth: active ? 2.2 : 1.28,
          strokeDasharray: data?.edgeType === "adjacent_to" ? "7 10" : undefined,
          filter: active ? "drop-shadow(0 0 12px rgba(125, 211, 252, 0.34))" : undefined
        }}
      />
      {active && label ? (
        <EdgeLabelRenderer>
          <div
            className="leyline-label"
            style={{
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
  leyline: LeyLineEdge
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
      duration: 720
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
      const width = node.type === "segment" ? 268 : node.type === "idea" ? 238 : node.type === "opportunity" ? 214 : 196;

      return {
        id: node.id,
        position: node.position,
        draggable: false,
        selectable: false,
        data: {
          nodeType: node.type,
          label: (
            <div className={`atlas-node-body atlas-node-body--${node.type} ${isSelected ? "is-selected" : ""}`}>
              <span className="atlas-node-halo" />
              <span className="atlas-node-shadow" />
              <div className="atlas-node-island">
                <span className="atlas-node-kicker">{tone.chip}</span>
                <strong className="atlas-node-title">{node.label}</strong>
                <span className="atlas-node-signal">{node.market_signal}</span>
              </div>
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

  const edges = useMemo<Edge<LeyLineData>[]>(() => {
    if (!atlas) {
      return [];
    }

    return atlas.edges.map((edge) => ({
      id: edge.id,
      type: "leyline",
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.type === "opportunity_in",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 18,
        height: 18,
        color: edgeColor(edge.type, edge.source === selectedNodeId || edge.target === selectedNodeId)
      },
      data: {
        active: edge.source === selectedNodeId || edge.target === selectedNodeId,
        edgeType: edge.type
      }
    }));
  }, [atlas, selectedNodeId]);

  if (!atlas || atlas.nodes.length === 0) {
    return (
      <div className="atlas-scene-shell">
        <div className="empty-state atlas-empty-state">
          <div>
            <p className="eyebrow">Orb atlas</p>
            <h3>The map materializes the moment the pulse is ready.</h3>
            <p className="muted">Queued and running still persist the run. The first explorable terrain lands at pulse_ready.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="atlas-scene-shell">
      <div className="atlas-scene-topline">
        <div>
          <p className="eyebrow">Orb atlas</p>
          <h3 className="atlas-scene-title">A navigable sky-map of rivals, biomes, and entry routes.</h3>
        </div>
        <div className="atlas-census" aria-label="Atlas census">
          {countLabel(atlas).map((item) => (
            <span key={item} className="scene-pill">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="atlas-scene-frame">
        <div className="atlas-mist atlas-mist--amber" />
        <div className="atlas-mist atlas-mist--blue" />
        <div className="atlas-grid-rings" />
        <div className="atlas-stars" />

        <div className="atlas-scene-hud">
          <div className="scene-pill scene-pill--focus">Focus: {focusNode?.label ?? "Awaiting pulse"}</div>
          <div className="atlas-legend" aria-label="Atlas legend">
            {Object.entries(NODE_TONE_MAP).map(([type, tone]) => (
              <div key={type} className="legend-chip">
                <span className="legend-dot" style={{ background: tone.border }} />
                <span>{tone.chip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="atlas-stage">
          <ReactFlow
            fitView
            fitViewOptions={{ padding: 0.2, duration: 600 }}
            minZoom={0.42}
            maxZoom={1.45}
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
              maskColor="rgba(4, 8, 19, 0.62)"
              style={{ background: "rgba(8, 14, 31, 0.78)" }}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
