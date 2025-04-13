// Theme Toggle Functionality
// document.getElementById('themeToggle').addEventListener('click', function() {
//     document.body.classList.toggle('dark-mode');
    
//     const icon = this.querySelector('i');
//     if (document.body.classList.contains('dark-mode')) {
//         icon.classList.remove('fa-moon');
//         icon.classList.add('fa-sun');
//     } else {
//         icon.classList.remove('fa-sun');
//         icon.classList.add('fa-moon');
//     }
// });

// Initialize date variables
let currentDate = new Date();
let currentView = 'weekly';

// DOM Elements
const weeklyPlanView = document.getElementById('weeklyPlanView');
const monthlyPlanView = document.getElementById('monthlyPlanView');
const weeklyViewBtn = document.getElementById('weeklyView');
const monthlyViewBtn = document.getElementById('monthlyView');
const weekRangeElement = document.getElementById('weekRange');
const monthYearElement = document.getElementById('monthYear');
const planDateInput = document.getElementById('planDate');
const generatePlanBtn = document.getElementById('generatePlan');
const mealDetailsModal = new bootstrap.Modal(document.getElementById('mealDetailsModal'));
const replaceMealModal = new bootstrap.Modal(document.getElementById('replaceMealModal'));

// Initialize the planner
document.addEventListener('DOMContentLoaded', function() {
    // Set current date in date picker
    planDateInput.valueAsDate = currentDate;
    updateView();
    setupEventListeners();
});

function setupEventListeners() {
        // View toggle buttons
        weeklyViewBtn.addEventListener('click', function() {
            currentView = 'weekly';
            updateView();
        });
        
        monthlyViewBtn.addEventListener('click', function() {
            currentView = 'monthly';
            updateView();
        });
    
    // Week navigation
    document.getElementById('prevWeek').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 7);
        updateView();
    });
    
    document.getElementById('nextWeek').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 7);
        updateView();
    });
    
    // Month navigation
    document.getElementById('prevMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateView();
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateView();
    });
    
    // Date picker
    document.getElementById('goToDate').addEventListener('click', function() {
        if (planDateInput.value) {
            currentDate = new Date(planDateInput.value);
            updateView();
        }
    });
    
    // Generate plan button
    generatePlanBtn.addEventListener('click', generateMealPlan);
    
    // Replace meal button in modal
    document.getElementById('replaceMeal').addEventListener('click', function() {
        mealDetailsModal.hide();
        showReplaceMealOptions();
    });
}

function updateView() {
    // Update date picker
    planDateInput.valueAsDate = currentDate;
    
    if (currentView === 'weekly') {
        weeklyPlanView.style.display = 'block';
        monthlyPlanView.style.display = 'none';
        renderWeeklyView();
        weekRangeElement.textContent = getWeekRangeString(currentDate);
    } else {
        weeklyPlanView.style.display = 'none';
        monthlyPlanView.style.display = 'block';
        renderMonthlyView();
        monthYearElement.textContent = getMonthYearString(currentDate);
    }
}

function renderWeeklyView() {
    // Get start of week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    // Render each day of the week
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        
        const dayCell = document.getElementById(`${getDayAbbreviation(day)}-meals`);
        dayCell.innerHTML = renderDayMeals(day);
        
        // Add click handlers to meal cards
        dayCell.querySelectorAll('.meal-card').forEach(card => {
            card.addEventListener('click', function() {
                showMealDetails(this.dataset.mealId);
            });
        });
    }
}

function renderMonthlyView() {
    const monthDays = document.getElementById('monthDays');
    monthDays.innerHTML = '';
    
    // Get first day of month and last day of month
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Calculate days from previous month to show
    let day = new Date(firstDay);
    day.setDate(day.getDate() - day.getDay()); // Start from Sunday
    
    // Create calendar rows
    while (day <= lastDay || day.getDay() !== 0) {
        const weekRow = document.createElement('tr');
        
        // Create cells for each day of the week
        for (let i = 0; i < 7; i++) {
            const dayCell = document.createElement('td');
            dayCell.className = 'calendar-day';
            
            if (day.getMonth() !== currentDate.getMonth()) {
                dayCell.classList.add('other-month');
            }
            
            if (isSameDay(day, new Date())) {
                dayCell.classList.add('today');
            }
            
            dayCell.innerHTML = `
                <div class="calendar-date">${day.getDate()}</div>
                <div class="calendar-meals">${renderMiniMeals(day)}</div>
            `;
            
            // Add click handler to switch to weekly view
            dayCell.addEventListener('click', function() {
                currentDate = new Date(day);
                currentView = 'weekly';
                updateView();
                weeklyViewBtn.click();
            });
            
            weekRow.appendChild(dayCell);
            day.setDate(day.getDate() + 1);
        }
        
        monthDays.appendChild(weekRow);
    }
}

function renderDayMeals(day) {
    const meals = getMealsForDay(day);
    const mealsPerDay = parseInt(document.getElementById('mealsPerDay').value);
    let html = '';
    
    // Breakfast
    if (mealsPerDay >= 1) {
        html += renderMealCard(meals?.breakfast, 'Breakfast', 'breakfast');
    }
    
    // Lunch
    if (mealsPerDay >= 2) {
        html += renderMealCard(meals?.lunch, 'Lunch', 'lunch');
    }
    
    // Dinner
    if (mealsPerDay >= 3) {
        html += renderMealCard(meals?.dinner, 'Dinner', 'dinner');
    }
    
    // Snacks (if enabled)
    if (mealsPerDay >= 6) {
        html += renderMealCard(meals?.snacks, 'Snacks', 'snacks');
    }
    
    return html || '<div class="text-muted text-center py-3">No meals planned</div>';
}

function renderMealCard(meal, time, mealType) {
    if (meal) {
        return `
            <div class="meal-card" data-meal-id="${meal.id}">
                <div class="meal-time">${time}</div>
                <div class="meal-title">${meal.title}</div>
                <div class="meal-calories">${meal.calories} kcal • ${meal.time} min</div>
            </div>
        `;
    } else {
        return `
            <div class="meal-card empty" data-meal-type="${mealType}">
                <div class="meal-time">${time}</div>
                <div class="text-muted">Click to add meal</div>
            </div>
        `;
    }
}

function renderMiniMeals(day) {
    const meals = getMealsForDay(day);
    let html = '';
    
    if (meals?.breakfast) html += `<div class="calendar-meal">☀️ ${meals.breakfast.title.substring(0, 15)}</div>`;
    if (meals?.lunch) html += `<div class="calendar-meal">🌞 ${meals.lunch.title.substring(0, 15)}</div>`;
    if (meals?.dinner) html += `<div class="calendar-meal">🌙 ${meals.dinner.title.substring(0, 15)}</div>`;
    
    return html || '<div class="text-muted">No meals</div>';
}

function showMealDetails(mealId) {
    if (!mealId) return;
    
    const meal = recipeDatabase.find(r => r.id == mealId);
    if (!meal) return;
    
    document.getElementById('mealModalTitle').textContent = meal.title;
    document.getElementById('mealModalContent').innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${meal.image}" class="meal-detail-img w-100 mb-3" alt="${meal.title}">
                <div class="d-flex justify-content-between mb-3">
                    <span class="badge bg-success">${meal.cuisine}</span>
                    <span>${meal.time} min</span>
                    <span>${meal.calories} kcal</span>
                </div>
                <h5>Ingredients</h5>
                <ul>
                    ${meal.ingredients.map(i => `<li>${i}</li>`).join('')}
                </ul>
            </div>
            <div class="col-md-6">
                <h5>Description</h5>
                <p>${meal.description}</p>
                <h5>Dietary Information</h5>
                <div>
                    ${meal.dietary.map(d => `<span class="badge bg-secondary me-1">${d}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    mealDetailsModal.show();
}

function showReplaceMealOptions() {
    // Get current meal details
    const currentMealId = document.getElementById('mealModalTitle').dataset.mealId;
    const currentMeal = recipeDatabase.find(r => r.id == currentMealId);
    
    if (!currentMeal) return;
    
    const replacementOptionsContainer = document.getElementById('replacementOptions');
    replacementOptionsContainer.innerHTML = '';

    // Filter meals of the same type
    const sameTypeMeals = recipeDatabase.filter(meal =>
        meal.type === currentMeal.type && meal.id !== currentMeal.id
    );

    if (sameTypeMeals.length === 0) {
        replacementOptionsContainer.innerHTML = '<p class="text-muted">No replacement options available.</p>';
        return;
    }

    // Render replacement options
    sameTypeMeals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'replacement-meal-card';
        mealCard.innerHTML = `
            <img src="${meal.image}" alt="${meal.title}" class="img-fluid mb-2">
            <h6>${meal.title}</h6>
            <p>${meal.calories} kcal • ${meal.time} min</p>
            <button class="btn btn-outline-primary btn-sm replaceBtn" data-new-meal-id="${meal.id}">Replace</button>
        `;
        replacementOptionsContainer.appendChild(mealCard);
    });

    // Handle replacement selection
    replacementOptionsContainer.querySelectorAll('.replaceBtn').forEach(button => {
        button.addEventListener('click', function () {
            const newMealId = this.dataset.newMealId;
            replaceMeal(currentMealId, newMealId);
            replaceMealModal.hide();
            updateView(); // Refresh the current view to reflect the change
        });
    });
    
    replaceMealModal.show();
    
    // Simulate API call
    setTimeout(() => {
        // Get recommended alternatives
        const filters = {
            dietary: getSelectedDietary(),
            cuisine: document.getElementById('cuisine').value,
            maxTime: currentMeal.time + 10 // Allow slightly longer recipes
        };
        
        const alternatives = getRecommendedRecipes(currentMeal.mealType, filters)
            .filter(r => r.id != currentMealId)
            .slice(0, 4);
        
        document.getElementById('replacementOptions').innerHTML = alternatives.map(meal => `
            <div class="col-md-6 mb-3">
                <div class="card meal-replacement" data-meal-id="${meal.id}">
                    <img src="${meal.image}" class="card-img-top" alt="${meal.title}">
                    <div class="card-body">
                        <h6 class="card-title">${meal.title}</h6>
                        <div class="d-flex justify-content-between">
                            <span class="badge bg-secondary">${meal.cuisine}</span>
                            <small>${meal.time} min • ${meal.calories} kcal</small>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        document.querySelectorAll('.meal-replacement').forEach(card => {
            card.addEventListener('click', function() {
                const newMealId = this.dataset.mealId;
                replaceMeal(currentMealId, newMealId);
                replaceMealModal.hide();
                updateView();
            });
        });
    }, 800);
}

function replaceMeal(oldMealId, newMealId) {
    // Find and replace the meal in the plan
    for (const date in mealPlanStorage) {
        for (const mealType in mealPlanStorage[date]) {
            if (mealPlanStorage[date][mealType]?.id == oldMealId) {
                const newMeal = recipeDatabase.find(r => r.id == newMealId);
                if (newMeal) {
                    mealPlanStorage[date][mealType] = newMeal;
                }
            }
        }
    }
}

function generateMealPlan() {
    const dietary = getSelectedDietary();
    const calories = document.getElementById('calories').value;
    const cuisine = document.getElementById('cuisine').value;
    const mealsPerDay = document.getElementById('mealsPerDay').value;
    
    // Show loading state
    const loadingHTML = `
        <tr>
            <td colspan="7" class="text-center py-5">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Generating your personalized meal plan...</p>
            </td>
        </tr>
    `;
    
    document.querySelector('#weeklyPlanView tbody').innerHTML = loadingHTML;
    
    // Simulate AI processing
    setTimeout(() => {
        const plan = generateAIMealPlan({
            dietaryPrefs: dietary,
            cuisinePrefs: cuisine !== 'any' ? [cuisine] : [],
            calorieTarget: calories,
            cookingTime: 60,
            startDate: currentDate
        });
        
        saveMealPlan(plan);
        updateView();
    }, 1500);
}

function getSelectedDietary() {
    const dietarySelect = document.getElementById('dietary');
    return dietarySelect.value !== 'any' ? [dietarySelect.value] : [];
}

// Helper functions
function getDayAbbreviation(date) {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[date.getDay()];
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function getWeekRangeString(date) {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return `Week of ${formatDate(start, 'MMM d')} - ${formatDate(end, 'MMM d, yyyy')}`;
}

function getMonthYearString(date) {
    return formatDate(date, 'MMMM yyyy');
}

function formatDate(date, format = 'yyyy-MM-dd') {
    const options = {
        year: 'numeric',
        month: format.includes('MMM') ? 'short' : 'numeric',
        day: 'numeric'
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Meal plan storage functions
let mealPlanStorage = {};

function getMealsForDay(day) {
    const dateStr = formatDate(day);
    return mealPlanStorage[dateStr] || null;
}

function saveMealPlan(plan) {
    mealPlanStorage = { ...mealPlanStorage, ...plan };
}
