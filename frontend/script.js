const API_URL = "http://127.0.0.1:8001/api/analysis/analyze";


async function analyzeNetwork() {

    const inputElement = document.getElementById("networkInput");
    const resultElement = document.getElementById("result");

    if (!inputElement) {
        console.error("networkInput element not found");
        return;
    }

    const text = inputElement.value.trim();

    if (!text) {

        if (resultElement) {
            resultElement.style.display = "block";
            resultElement.innerHTML = `
                <h3>Input Required</h3>
                <p>Please enter cybercrime/network information.</p>
            `;
        }

        return;
    }


    if (resultElement) {
        resultElement.style.display = "block";
        resultElement.innerHTML = `
            <h3>Analyzing...</h3>
            <p>AEGISx AI is analyzing the submitted data.</p>
        `;
    }


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: text
            })

        });


        if (!response.ok) {

            throw new Error(
                `Backend returned ${response.status}`
            );

        }


        const data = await response.json();

        console.log("AEGISx Backend Response:", data);


        /*
         * Convert backend risk level
         * into dashboard information.
         */

        let riskScore = 30;

        if (data.risk_level === "HIGH") {
            riskScore = 85;
        }
        else if (data.risk_level === "MEDIUM") {
            riskScore = 60;
        }
        else if (data.risk_level === "LOW") {
            riskScore = 25;
        }


        const dashboardData = {

            risk_score: riskScore,

            risk_level: data.risk_level || "LOW",

            priority:
                data.risk_level === "HIGH"
                    ? "HIGH"
                    : data.risk_level === "MEDIUM"
                        ? "MEDIUM"
                        : "LOW",

            reason:
                data.detected_keywords &&
                data.detected_keywords.length > 0

                    ? `Detected keywords: ${data.detected_keywords.join(", ")}`

                    : "No major suspicious indicators detected.",

            keywords:
                data.detected_keywords || [],

            relationships:
                data.relationships || [],

            graph:
                data.graph || {
                    nodes: [],
                    edges: []
                }

        };


        /*
         * Update dashboard
         */

        updateRiskDashboard(dashboardData);

        updateRiskStatus(dashboardData.risk_level);

        createRiskAlert(dashboardData);


        /*
         * Display complete backend result
         */

        if (resultElement) {

            resultElement.innerHTML = `

                <h3>Analysis Completed</h3>

                <p>
                    <strong>Risk Level:</strong>
                    ${dashboardData.risk_level}
                </p>

                <p>
                    <strong>Risk Score:</strong>
                    ${dashboardData.risk_score}
                </p>

                <p>
                    <strong>Detected Keywords:</strong>
                    ${dashboardData.keywords.join(", ") || "None"}
                </p>

                <p>
                    <strong>Relationships:</strong>
                    ${dashboardData.relationships.length}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${data.status}
                </p>

            `;

        }


    }
    catch (error) {

        console.error("AEGISx API Error:", error);


        if (resultElement) {

            resultElement.style.display = "block";

            resultElement.innerHTML = `

                <h3>Backend Connection Error</h3>

                <p>
                    Could not connect to AEGISx FastAPI backend.
                </p>

                <p>
                    Make sure FastAPI is running on port 8001.
                </p>

                <p>
                    Error: ${error.message}
                </p>

            `;

        }

    }

}


/*
====================================================
UPDATE RISK DASHBOARD
====================================================
*/

function updateRiskDashboard(data) {

    const riskScore =
        document.getElementById("riskScore");

    const circleScore =
        document.getElementById("circleScore");

    const riskLevel =
        document.getElementById("riskLevel");

    const priority =
        document.getElementById("priority");

    const riskReason =
        document.getElementById("riskReason");

    const riskProgress =
        document.getElementById("riskProgress");


    if (riskScore) {
        riskScore.textContent = data.risk_score;
    }


    if (circleScore) {
        circleScore.textContent = data.risk_score;
    }


    if (riskLevel) {
        riskLevel.textContent = data.risk_level;
    }


    if (priority) {
        priority.textContent = data.priority;
    }


    if (riskReason) {
        riskReason.textContent = data.reason;
    }


    if (riskProgress) {
        riskProgress.style.width =
            `${data.risk_score}%`;
    }

}


/*
====================================================
RISK STATUS COLOR
====================================================
*/

function updateRiskStatus(level) {

    const riskLevel =
        document.getElementById("riskLevel");


    if (!riskLevel) {
        return;
    }


    riskLevel.classList.remove(
        "high",
        "medium",
        "low"
    );


    if (level === "HIGH") {

        riskLevel.classList.add("high");

    }
    else if (level === "MEDIUM") {

        riskLevel.classList.add("medium");

    }
    else {

        riskLevel.classList.add("low");

    }

}


/*
====================================================
ALERTS
====================================================
*/

function createRiskAlert(data) {

    const alertList =
        document.querySelector(".alert-list");

    const alertCount =
        document.querySelector(".alert-count");


    if (!alertList) {
        return;
    }


    alertList.innerHTML = "";


    const alerts = [];


    if (data.risk_level === "HIGH") {

        alerts.push({

            title: "High-risk activity detected",

            message:
                `AI risk score reached ${data.risk_score}. Immediate investigation recommended.`,

            time: "NOW"

        });

    }


    if (data.priority === "HIGH") {

        alerts.push({

            title: "Priority escalation",

            message:
                "This activity has been classified as HIGH priority.",

            time: "NOW"

        });

    }


    if (data.keywords &&
        data.keywords.length > 0) {

        alerts.push({

            title: "Suspicious indicators detected",

            message:
                data.keywords.join(", "),

            time: "NOW"

        });

    }


    if (data.reason) {

        alerts.push({

            title: "AI detection reason",

            message: data.reason,

            time: "NOW"

        });

    }


    alerts.forEach(alert => {

        const alertItem =
            document.createElement("div");


        alertItem.className =
            "alert-item";


        alertItem.innerHTML = `

            <span class="alert-indicator"></span>

            <div>

                <strong>
                    ${alert.title}
                </strong>

                <p>
                    ${alert.message}
                </p>

            </div>

            <span class="alert-time">
                ${alert.time}
            </span>

        `;


        alertList.appendChild(alertItem);

    });


    if (alertCount) {

        alertCount.textContent =
            String(alerts.length).padStart(2, "0");

    }

}


/*
====================================================
INITIAL DASHBOARD
====================================================
*/

const initialRiskData = {

    risk_score: 0,

    risk_level: "LOW",

    priority: "LOW",

    reason: "Waiting for cybercrime analysis."

};


updateRiskDashboard(initialRiskData);

updateRiskStatus(initialRiskData.risk_level);

createRiskAlert(initialRiskData);sss