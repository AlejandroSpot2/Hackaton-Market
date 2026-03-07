import { NODE_TYPE_META } from "@/lib/constants";
import { AtlasNode, CompetitorDetail } from "@/lib/types";

interface DetailPanelProps {
  node: AtlasNode | null;
  detail: CompetitorDetail | null;
}

function renderList(items: string[]) {
  return (
    <ul className="detail-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function nodeLore(node: AtlasNode): { label: string; copy: string } {
  switch (node.type) {
    case "idea":
      return {
        label: "Core thesis",
        copy: "This is the founder premise. Every other island is being judged by how much gravity it exerts on this initial claim."
      };
    case "segment":
      return {
        label: "Biome read",
        copy: "Segments compress the market into shared buyer language, pricing expectations, and workflow habits."
      };
    case "adjacent_category":
      return {
        label: "Border pressure",
        copy: "Adjacent categories often steal budget or shape expectations before a new entrant wins trust in its own lane."
      };
    case "opportunity":
      return {
        label: "Wedge signal",
        copy: "Opportunity nodes are realistic insertion paths. They are not a roadmap, they are a first foothold."
      };
    default:
      return {
        label: "Competitive gravity",
        copy: "Competitor islands reveal where user expectations are already formed and which promises are hardest to dislodge."
      };
  }
}

export function DetailPanel({ node, detail }: DetailPanelProps) {
  if (!node) {
    return (
      <aside className="surface detail-panel detail-panel--empty">
        <div>
          <p className="eyebrow">Codex panel</p>
          <h2>Select an island</h2>
          <p className="muted">
            Focus any part of the atlas to open its field notes, competitive pressure, and wedge interpretation in this codex.
          </p>
        </div>
      </aside>
    );
  }

  const meta = NODE_TYPE_META[node.type];
  const lore = nodeLore(node);

  return (
    <aside className={`surface detail-panel detail-panel--${node.type}`}>
      <div className="detail-panel-head">
        <div>
          <p className="eyebrow">{meta.eyebrow}</p>
          <h2>{node.label}</h2>
          <p className="muted detail-type">{meta.label}</p>
        </div>
        <span className={`card-pill ${node.type === "opportunity" ? "ready" : "waiting"}`}>
          {node.type === "opportunity" ? "wedge" : meta.eyebrow.toLowerCase()}
        </span>
      </div>

      <div className="detail-callout detail-callout--signal">
        <span className="detail-label">Market signal</span>
        <p>{node.market_signal}</p>
      </div>

      <div className="detail-section relic-section">
        <span className="detail-label">Atlas read</span>
        <p>{node.summary}</p>
      </div>

      <div className="detail-section relic-section">
        <span className="detail-label">{lore.label}</span>
        <p>{lore.copy}</p>
      </div>

      {detail ? (
        <>
          {detail.website ? (
            <div className="detail-section relic-section">
              <span className="detail-label">Website</span>
              <p>
                <a href={detail.website} rel="noreferrer" target="_blank">
                  {detail.website}
                </a>
              </p>
            </div>
          ) : null}

          {detail.tagline ? (
            <div className="detail-section relic-section">
              <span className="detail-label">Positioning</span>
              <p>{detail.tagline}</p>
            </div>
          ) : null}

          {detail.why_it_wins ? (
            <div className="detail-section relic-section">
              <span className="detail-label">Why it wins</span>
              <p>{detail.why_it_wins}</p>
            </div>
          ) : null}

          {detail.pricing_hint ? (
            <div className="detail-section relic-section">
              <span className="detail-label">Pricing hint</span>
              <p>{detail.pricing_hint}</p>
            </div>
          ) : null}

          {detail.signals.length > 0 ? (
            <div className="detail-section relic-section">
              <span className="detail-label">Signals gathered</span>
              {renderList(detail.signals)}
            </div>
          ) : null}

          {detail.risks.length > 0 ? (
            <div className="detail-section relic-section">
              <span className="detail-label">Risks</span>
              {renderList(detail.risks)}
            </div>
          ) : null}

          {detail.sources.length > 0 ? (
            <div className="detail-section relic-section">
              <span className="detail-label">Sources</span>
              <ul className="detail-list">
                {detail.sources.map((source) => (
                  <li key={source}>
                    <a href={source} rel="noreferrer" target="_blank">
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      ) : (
        <div className="detail-section detail-callout">
          <span className="detail-label">Node-specific note</span>
          <p>This island does not carry a dedicated competitor dossier, so the atlas summary remains the primary source of truth.</p>
        </div>
      )}
    </aside>
  );
}
