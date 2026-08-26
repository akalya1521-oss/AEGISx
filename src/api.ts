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
  risk_score: number;
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
  const url = `${API_BASE_URL}/api/analysis/analyze`;

  console.log("AEGISx: Sending request to:", url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        text: text.trim(),
      }),
    });

    console.log("AEGISx: Backend response:", response.status);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Backend returned ${response.status}: ${errorText}`
      );
    }

    const data: AnalysisResponse = await response.json();

    console.log("AEGISx: Analysis result:", data);

    return data;
  } catch (error) {
    console.error("AEGISx API ERROR:", error);

    throw error;
  }
}