const API_BASE_URL = "http://127.0.0.1:9000";

export interface AnalysisResponse {
  input: string;
  status: string;
  risk_level: string;
  detected_keywords: string[];
  relationships: {
    source: string;
    source_type: string;
    target: string;
    target_type: string;
    relationship: string;
  }[];
  graph: {
    nodes: {
      id: string;
      type: string;
    }[];
    edges: {
      source: string;
      target: string;
      label: string;
    }[];
  };
}

export async function analyzeCyberText(
  text: string
): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/analysis/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.status}`);
  }

  return response.json();
}