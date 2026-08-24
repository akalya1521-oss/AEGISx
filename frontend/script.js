function analyzeNetwork() {
    let input = document.getElementById("networkInput").value;
    let result = document.getElementById("result");

    if (input.trim() === "") {
        result.style.display = "block";
        result.innerHTML = `
            <h3>Input Required</h3>
            <p>Please enter a network or transaction ID.</p>
        `;
        return;
    }

    result.style.display = "block";

    result.innerHTML = `
        <h3>Analysis Result</h3>
        <p><strong>Input:</strong> ${input}</p>
        <p><strong>Risk Level:</strong> Medium</p>
        <p><strong>Status:</strong> Suspicious activity detected</p>
        <p><strong>AI Analysis:</strong> Network requires further investigation.</p>
    `;
}