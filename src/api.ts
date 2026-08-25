const API_BASE_URL = "http://127.0.0.1:8001";

export interface AnalysisRequest {
  text: string;
}

export interface Relationship {
  source: string;
  source_type: string;
  target: string;
  target_type: string;
  relationship: string;
}

export interface GraphNode {
  id: string;
  type: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

export interface AnalysisResponse {
  input: string;
  status: string;
  risk_level: string;
  detected_keywords: string[];
  relationships: Relationship[];
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
}

export async function analyzeText(
  text: string
): Promise<AnalysisResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/analysis/analyze`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Analysis failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}