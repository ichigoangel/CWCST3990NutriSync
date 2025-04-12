function calculateBAC() {
    // Get input values
    const gender = document.getElementById("gender").value;
    const age = parseFloat(document.getElementById("age").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const beer = parseFloat(document.getElementById("beer").value) || 0;
    const wine = parseFloat(document.getElementById("wine").value) || 0;
    const shot = parseFloat(document.getElementById("shot").value) || 0;
    const hours = parseFloat(document.getElementById("time").value) || 0;

    // Validate inputs
    if (!age || !weight || age <= 0 || weight <= 0) {
        document.getElementById("outputTarget").innerHTML = 
            "<p style='color:#dc3545'>Please enter valid age and weight</p>";
        return;
    }

    // Calculate total alcohol in grams
    const beerAlcohol = beer * 14;  // average beer has ~14g alcohol
    const wineAlcohol = wine * 14;  // average glass of wine has ~14g alcohol
    const shotAlcohol = shot * 14;  // average shot has ~14g alcohol
    const totalAlcohol = beerAlcohol + wineAlcohol + shotAlcohol;

    // Calculate BAC (Widmark formula)
    const genderConstant = (gender === 'male') ? 0.68 : 0.55;
    let bac = (totalAlcohol / (weight * genderConstant * 1000)) * 100;
    
    // Subtract 0.015% per hour since last drink
    bac = bac - (hours * 0.015);
    bac = Math.max(0, bac);  // BAC can't be negative
    
    // Format BAC to 3 decimal places
    const formattedBAC = bac.toFixed(3);
    
    // Determine result message
    let message = "";
    let color = "";
    
    if (bac <= 0) {
        message = "Your BAC is 0.000% - You're sober";
        color = "#28a745"; // green
    } else if (bac < 0.05) {
        message = `Your BAC is ${formattedBAC}% - No significant impairment`;
        color = "#28a745"; // green
    } else if (bac < 0.08) {
        message = `Your BAC is ${formattedBAC}% - Mild impairment (Legal limit in most countries is 0.08%)`;
        color = "#ffc107"; // yellow
    } else if (bac < 0.15) {
        message = `Your BAC is ${formattedBAC}% - Significant impairment (Above legal limit)`;
        color = "#fd7e14"; // orange
    } else if (bac < 0.30) {
        message = `Your BAC is ${formattedBAC}% - Severe impairment (Dangerous)`;
        color = "#dc3545"; // red
    } else {
        message = `Your BAC is ${formattedBAC}% - Life-threatening (Seek medical help immediately)`;
        color = "#dc3545"; // red
    }
    
    // Display result
    document.getElementById("outputTarget").innerHTML = 
        `<p style="color:${color}; font-weight:bold">${message}</p>`;
}

function clearInputs() {
    document.getElementById("age").value = "";
    document.getElementById("weight").value = "";
    document.getElementById("beer").value = "";
    document.getElementById("wine").value = "";
    document.getElementById("shot").value = "";
    document.getElementById("time").value = "";
    document.getElementById("outputTarget").innerHTML = "";
}