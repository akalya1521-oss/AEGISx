const riskData = {
    risk_score: 70.93,
    risk_level: "HIGH",
    priority: "HIGH",
    reason: "Multiple suspicious indicators detected"
};


function updateRiskDashboard(data) {

    const riskScore = document.getElementById("riskScore");
    const circleScore = document.getElementById("circleScore");
    const riskLevel = document.getElementById("riskLevel");
    const priority = document.getElementById("priority");
    const riskReason = document.getElementById("riskReason");
    const riskProgress = document.getElementById("riskProgress");


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
        riskProgress.style.width = `${data.risk_score}%`;
    }
}


function updateRiskStatus(level) {

    const riskLevel = document.getElementById("riskLevel");

    if (!riskLevel) {
        return;
    }

    riskLevel.classList.remove("high", "medium", "low");

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


updateRiskDashboard(riskData);
updateRiskStatus(riskData.risk_level);
function createRiskAlert(data) {

    const alertList = document.querySelector(".alert-list");
    const alertCount = document.querySelector(".alert-count");

    if (!alertList) {
        return;
    }

    alertList.innerHTML = "";

    const alerts = [];

    if (data.risk_level === "HIGH") {
        alerts.push({
            title: "High-risk activity detected",
            message: `AI risk score reached ${data.risk_score}. Immediate investigation recommended.`,
            time: "NOW"
        });
    }

    if (data.priority === "HIGH") {
        alerts.push({
            title: "Priority escalation",
            message: "This activity has been classified as HIGH priority.",
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

        const alertItem = document.createElement("div");

        alertItem.className = "alert-item";

        alertItem.innerHTML = `
            <span class="alert-indicator"></span>

            <div>
                <strong>${alert.title}</strong>
                <p>${alert.message}</p>
            </div>

            <span class="alert-time">${alert.time}</span>
        `;

        alertList.appendChild(alertItem);
    });

    if (alertCount) {
        alertCount.textContent = String(alerts.length).padStart(2, "0");
    }
}


createRiskAlert(riskData);