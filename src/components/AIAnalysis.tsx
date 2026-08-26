import React, { useState } from "react";
import { analyzeText, AnalysisResponse } from "../api";
import { useIntelligence } from "../context/IntelligenceContext";

export const AIAnalysis: React.FC = () => {
  const [text, setText] = useState("");
  const [result, setResult] =
    useState<AnalysisResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setCurrentRiskScore, addToast } =
    useIntelligence();

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

      // -----------------------------
      // Convert risk level to score
      // -----------------------------

      let score = 30;

      if (data.risk_level === "HIGH") {
        score = 90;
      } else if (data.risk_level === "MEDIUM") {
        score = 60;
      } else if (data.risk_level === "LOW") {
        score = 25;
      }

      // Update dashboard RiskPanel
      setCurrentRiskScore(score);

      addToast({
        title: "AI ANALYSIS COMPLETED",
        message: `Threat level: ${data.risk_level} | Risk score: ${score}/100`,
        type:
          data.risk_level === "HIGH"
            ? "critical"
            : data.risk_level === "MEDIUM"
            ? "warning"
            : "success",
      });
} catch (err) {
  console.error("AI ANALYSIS ERROR:", err);

  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Unknown error occurred while connecting to AEGISx.");
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="cyber-panel"
      style={{ marginTop: 20 }}
    >
      {/* HEADER */}
      <div className="cyber-panel-header">
        <div className="cyber-panel-title">
          <span>🤖</span>
          <span>AI CYBERCRIME ANALYSIS</span>
        </div>

        <span
          className="code-tag"
          style={{
            color: "var(--accent-cyan)",
            borderColor:
              "rgba(0, 229, 255, 0.4)",
          }}
        >
          AEGIS AI
        </span>
      </div>

      {/* BODY */}
      <div className="cyber-panel-body">
        <textarea
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Enter cybercrime information for AI analysis...

Example:
A ransomware botnet is using phishing emails to steal credentials and perform DDoS attacks."
          rows={7}
          style={{
            width: "100%",
            resize: "vertical",
            padding: "14px",
            background: "rgba(0,0,0,0.35)",
            color: "var(--text-primary)",
            border:
              "1px solid var(--border-cyan)",
            borderRadius: "4px",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {/* ANALYZE BUTTON */}

        <button
          className="cyber-btn cyber-btn-primary"
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            marginTop: 12,
          }}
        >
          {loading
            ? "ANALYZING THREAT..."
            : "ANALYZE CYBERCRIME"}
        </button>

        {/* ERROR */}

        {error && (
          <div
            style={{
              marginTop: 12,
              padding: "10px",
              border:
                "1px solid var(--danger-red)",
              color: "var(--danger-red)",
              background:
                "rgba(255,59,92,0.08)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
            }}
          >
            {error}
          </div>
        )}

        {/* RESULT */}

        {result && (
          <div
            style={{
              marginTop: 20,
              padding: 16,
              border:
                "1px solid var(--border-cyan)",
              background:
                "rgba(0,229,255,0.03)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "var(--accent-cyan)",
              }}
            >
              ANALYSIS RESULT
            </h3>

            {/* RISK LEVEL */}

            <div
              style={{
                marginBottom: 15,
              }}
            >
              <strong>
                Risk Level:
              </strong>{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color:
                    result.risk_level ===
                    "HIGH"
                      ? "var(--danger-red)"
                      : result.risk_level ===
                        "MEDIUM"
                      ? "var(--warning-amber)"
                      : "var(--accent-cyan)",
                }}
              >
                {result.risk_level}
              </span>
            </div>

            {/* KEYWORDS */}

            <h4>
              Detected Keywords
            </h4>

            {result.detected_keywords
              .length > 0 ? (
              <ul>
                {result.detected_keywords.map(
                  (keyword, index) => (
                    <li key={index}>
                      {keyword}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>
                No cybercrime keywords
                detected.
              </p>
            )}

            {/* RELATIONSHIPS */}

            <h4>
              Relationships
            </h4>

            {result.relationships
              .length > 0 ? (
              <ul>
                {result.relationships.map(
                  (
                    relationship,
                    index
                  ) => (
                    <li key={index}>
                      <strong>
                        {
                          relationship.source
                        }
                      </strong>{" "}
                      →{" "}
                      {
                        relationship.relationship
                      }{" "}
                      →{" "}
                      <strong>
                        {
                          relationship.target
                        }
                      </strong>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>
                No relationships
                detected.
              </p>
            )}

            {/* GRAPH */}

            <h4>
              Graph Data
            </h4>

            <p>
              Nodes:{" "}
              {result.graph.nodes.length}
            </p>

            <p>
              Edges:{" "}
              {result.graph.edges.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;