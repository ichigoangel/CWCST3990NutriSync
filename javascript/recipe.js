// Theme Toggle Functionality
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    const icon = this.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// User Profile Button
document.getElementById('userProfile').addEventListener('click', function() {
    alert('User profile functionality will be implemented soon!');
});

// Recipe Search Functionality
document.getElementById('findRecipes').addEventListener('click', function() {
    const ingredients = document.getElementById('ingredients').value;
    const dietary = document.getElementById('dietary').value;
    const cuisine = document.getElementById('cuisine').value;
    const time = document.getElementById('time').value;
    
    // Show loading spinner
    document.getElementById('loading').style.display = 'block';
    document.getElementById('recommendations').style.display = 'none';
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        // Hide loading spinner
        document.getElementById('loading').style.display = 'none';
        
        // Get AI recommendations
        const recommendations = getAIRecommendations(ingredients, dietary, cuisine, time);
        
        // Display recommendations
        displayRecipes(recommendations);
        document.getElementById('recommendations').style.display = 'block';
    }, 1500);
});

// Display recipes in the DOM
function displayRecipes(recipes) {
    const container = document.getElementById('recipeResults');
    container.innerHTML = '';
    
    if (recipes.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-utensils fa-3x mb-3 text-muted"></i>
                <h4>No recipes found</h4>
                <p class="text-muted">Try adjusting your filters or adding more ingredients</p>
            </div>
        `;
        return;
    }
    
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
            <div class="card recipe-card">
                <div class="position-relative">
                    <img src="${recipe.image}" class="recipe-img" alt="${recipe.title}">
                    <span class="recipe-badge">${recipe.time} min</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${recipe.title}</h5>
                    <p class="card-text text-muted">${recipe.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-secondary">${recipe.cuisine}</span>
                        <button class="btn btn-sm btn-outline-success view-recipe" data-id="${recipe.id}">
                            View Recipe <i class="fas fa-chevron-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    // Add event listeners to view recipe buttons
    document.querySelectorAll('.view-recipe').forEach(button => {
        button.addEventListener('click', function() {
            const recipeId = this.getAttribute('data-id');
            viewRecipeDetails(recipeId);
        });
    });
}

// View recipe details (placeholder)
function viewRecipeDetails(recipeId) {
    alert(`Viewing details for recipe ID: ${recipeId}\nThis would open a modal or new page in a complete implementation.`);
}