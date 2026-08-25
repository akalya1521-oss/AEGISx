import { useState } from "react";
import { analyzeText, AnalysisResponse } from "../api";

export function AIAnalysis() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeText(text);
      setResult(data);
    } catch (err) {
      console.error("Analysis error:", err);

      setError(
        "Unable to connect to the AEGISx backend. Make sure FastAPI is running on port 8001."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyber-panel" style={{ marginTop: "20px" }}>
      <div className="cyber-panel-header">
        <div className="cyber-panel-title">
          <span className="cyber-panel-title-icon">◈</span>
          <span>AI CYBERCRIME INTELLIGENCE ANALYST</span>
        </div>
      </div>

      <div className="cyber-panel-body">

        {/* INPUT */}
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
            }}
          >
            THREAT INTELLIGENCE INPUT
          </label>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter cybercrime information for AI analysis..."
            rows={6}
            style={{
              width: "100%",
              padding: "12px",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* ANALYZE BUTTON */}
        <button
          className="cyber-btn cyber-btn-primary"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "ANALYZING..." : "RUN AI ANALYSIS"}
        </button>

        {/* ERROR */}
        {error && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              border: "1px solid var(--danger-red)",
              color: "var(--danger-red)",
            }}
          >
            {error}
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div
            className="analysis-result"
            style={{
              marginTop: "20px",
              padding: "15px",
            }}
          >
            <h3>ANALYSIS RESULT</h3>

            {/* INPUT */}
            <div style={{ marginBottom: "12px" }}>
              <strong>Input:</strong>
              <p>{result.input}</p>
            </div>

            {/* STATUS */}
            <div style={{ marginBottom: "12px" }}>
              <strong>Status:</strong>
              <p>{result.status}</p>
            </div>

            {/* RISK LEVEL */}
            <div style={{ marginBottom: "12px" }}>
              <strong>Risk Level:</strong>

              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {result.risk_level}
              </p>
            </div>

            {/* DETECTED KEYWORDS */}
            <div style={{ marginBottom: "15px" }}>
              <h4>Detected Keywords</h4>

              {result.detected_keywords &&
              result.detected_keywords.length > 0 ? (
                <ul>
                  {result.detected_keywords.map((keyword, index) => (
                    <li key={`${keyword}-${index}`}>{keyword}</li>
                  ))}
                </ul>
              ) : (
                <p>No cybercrime keywords detected.</p>
              )}
            </div>

            {/* RELATIONSHIPS */}
            <div style={{ marginBottom: "15px" }}>
              <h4>Threat Relationships</h4>

              {result.relationships &&
              result.relationships.length > 0 ? (
                <ul>
                  {result.relationships.map((relationship, index) => (
                    <li key={index}>
                      <strong>{relationship.source}</strong>{" "}
                      → {relationship.relationship} →{" "}
                      <strong>{relationship.target}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No relationships detected.</p>
              )}
            </div>

            {/* GRAPH */}
            <div>
              <h4>Network Graph</h4>

              <p>
                <strong>Nodes:</strong>{" "}
                {result.graph?.nodes?.length ?? 0}
              </p>

              <p>
                <strong>Edges:</strong>{" "}
                {result.graph?.edges?.length ?? 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}