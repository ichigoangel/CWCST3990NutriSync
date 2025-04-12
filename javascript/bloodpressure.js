// Get DOM elements
const systolicInput = document.getElementById("systolic");
const diastolicInput = document.getElementById("diastolic");
const genderSelect = document.getElementById("gender");
const ageInput = document.getElementById("age");
const outputTarget = document.getElementById("outputTarget");

// Calculate blood pressure
function calculateBP() {
    const systolic = parseInt(systolicInput.value);
    const diastolic = parseInt(diastolicInput.value);
    const age = parseInt(ageInput.value);
    const gender = genderSelect.value;

    // Validate inputs
    if (!systolic || !diastolic || !age || age <= 0 || systolic <= 0 || diastolic <= 0) {
        outputTarget.innerHTML = "<p style='color:#dc3545'>Please enter valid values for all fields</p>";
        outputTarget.style.backgroundColor = "#f8f9fa";
        outputTarget.style.borderLeftColor = "#dc3545";
        return;
    }

    // Determine BP category
    let category = "";
    let color = "";
    let message = "";

    if (systolic > 180 || diastolic > 120) {
        category = "HYPERTENSIVE CRISIS";
        color = "#dc3545";
        message = "SEEK EMERGENCY CARE IMMEDIATELY!";
    } else if (systolic >= 140 || diastolic >= 90) {
        category = "HIGH BLOOD PRESSURE (Stage 2)";
        color = "#fd7e14";
        message = "Consult your doctor immediately";
    } else if (systolic >= 130 || diastolic >= 80) {
        category = "HIGH BLOOD PRESSURE (Stage 1)";
        color = "#ffc107";
        message = "Monitor regularly and consider lifestyle changes";
    } else if (systolic >= 120 && diastolic < 80) {
        category = "ELEVATED";
        color = "#17a2b8";
        message = "Normal but higher than ideal";
    } else {
        category = "NORMAL";
        color = "#28a745";
        message = "Healthy blood pressure";
    }

    // Display result
    outputTarget.innerHTML = `
        <p style="margin-bottom: 10px; font-weight: bold;">Your Blood Pressure: ${systolic}/${diastolic} mmHg</p>
        <p style="margin-bottom: 5px; color: ${color}; font-weight: bold;">Category: ${category}</p>
        <p>${message}</p>
    `;
    outputTarget.style.backgroundColor = color + "20"; // Add transparency
    outputTarget.style.borderLeftColor = color;
}

// Clear inputs
function clearBP() {
    systolicInput.value = "";
    diastolicInput.value = "";
    ageInput.value = "";
    genderSelect.value = "male";
    outputTarget.innerHTML = "";
    outputTarget.style.backgroundColor = "#f8f9fa";
    outputTarget.style.borderLeftColor = "#175c26";
}

// Add event listeners
document.getElementById("btnCalc").addEventListener("click", calculateBP);
document.getElementById("btnClear").addEventListener("click", clearBP);