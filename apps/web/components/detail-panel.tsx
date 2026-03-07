import { AtlasNode, CompetitorDetail } from "@/lib/types";

interface DetailPanelProps {
  node: AtlasNode | null;
  detail: CompetitorDetail | null;
}

export function DetailPanel({ node, detail }: DetailPanelProps) {
  if (!node) {
    return (
      <aside className="surface detail-panel">
        <p className="eyebrow">Node detail</p>
        <p className="muted">Select a node in the atlas to inspect its role in the market map.</p>
      </aside>
    );
  }

  return (
    <aside className="surface detail-panel">
      <p className="eyebrow">Node detail</p>
      <h2>{node.label}</h2>
      <p className="muted detail-type">{node.type.replace("_", " ")}</p>
      <p>{node.summary}</p>
      <div className="detail-section">
        <span className="detail-label">Market signal</span>
        <p>{node.market_signal}</p>
      </div>
      {detail ? (
        <>
          <div className="detail-section">
            <span className="detail-label">Positioning</span>
            <p>{detail.tagline}</p>
          </div>
          <div className="detail-section">
            <span className="detail-label">Why it wins</span>
            <p>{detail.why_it_wins}</p>
          </div>
          <div className="detail-section">
            <span className="detail-label">Pricing hint</span>
            <p>{detail.pricing_hint}</p>
          </div>
          <div className="detail-section">
            <span className="detail-label">Signals</span>
            <ul className="detail-list">
              {detail.signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </div>
          <div className="detail-section">
            <span className="detail-label">Risks</span>
            <ul className="detail-list">
              {detail.risks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </div>
          <div className="detail-section">
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
        </>
      ) : null}
    </aside>
  );
}