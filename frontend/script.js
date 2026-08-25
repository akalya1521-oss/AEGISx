async function analyzeNetwork() {
    const input = document.getElementById("networkInput").value;
    const result = document.getElementById("result");

    if (input.trim() === "") {
        result.style.display = "block";
        result.innerHTML = `
            <h3>Input Required</h3>
            <p>Please enter a network or threat description.</p>
        `;
        return;
    }

    result.style.display = "block";

    result.innerHTML = `
        <h3>Analyzing...</h3>
        <p>Please wait while AEGISx analyzes the threat.</p>
    `;

    try {
        const response = await fetch(
            "http://127.0.0.1:8001/api/analysis/analyze",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: input
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        result.innerHTML = `
            <h3>Analysis Result</h3>

            <p>
                <strong>Input:</strong>
                ${data.input}
            </p>

            <p>
                <strong>Risk Level:</strong>
                ${data.risk_level}
            </p>

            <p>
                <strong>Status:</strong>
                ${data.status}
            </p>

            <p>
                <strong>Detected Keywords:</strong>
                ${data.detected_keywords.length > 0
                    ? data.detected_keywords.join(", ")
                    : "None"}
            </p>

            <h4>Relationships</h4>

            ${
                data.relationships.length > 0
                    ? data.relationships.map(rel => `
                        <p>
                            <strong>${rel.source}</strong>
                            → ${rel.relationship} →
                            <strong>${rel.target}</strong>
                        </p>
                    `).join("")
                    : "<p>No relationships detected.</p>"
            }
        `;

    } catch (error) {

        console.error("Analysis Error:", error);

        result.innerHTML = `
            <h3>Connection Error</h3>
            <p>
                Unable to connect to the AEGISx backend.
            </p>
            <p>
                Make sure the FastAPI server is running on
                <strong>http://127.0.0.1:8001</strong>
            </p>
        `;
    }
}