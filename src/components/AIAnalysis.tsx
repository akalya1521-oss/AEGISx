import { useState } from "react";
import { analyzeText, AnalysisResponse } from "../api";

export default function AIAnalysis() {
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
      console.error(err);
      setError(
        "Unable to connect to the AEGISx backend. Make sure FastAPI is running on port 8001."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-analysis">
      <h2>AI Cybercrime Analysis</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter cybercrime information..."
        rows={6}
      />

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {result && (
        <div className="analysis-result">

          <h3>Analysis Result</h3>

          <p>
            <strong>Risk Level:</strong>{" "}
            <span>{result.risk_level}</span>
          </p>

          <h4>Detected Keywords</h4>

          {result.detected_keywords.length > 0 ? (
            <ul>
              {result.detected_keywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
          ) : (
            <p>No cybercrime keywords detected.</p>
          )}

          <h4>Relationships</h4>

          {result.relationships.length > 0 ? (
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

          <h4>Graph Data</h4>

          <p>
            Nodes: {result.graph.nodes.length}
          </p>

          <p>
            Edges: {result.graph.edges.length}
          </p>

        </div>
      )}
    </div>
  );
}