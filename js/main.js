// Wasted Years - Homebrewing Website
// Data and rendering logic

// Sample recipe data - edit this to add your own recipes
const recipes = [
    {
        id: 1,
        name: "Number of the Yeast",
        style: "Belgian Tripel",
        category: "ale",
        description: "A strong, golden Belgian-style ale with fruity esters and spicy phenolics. Deceptively drinkable for its strength.",
        og: 1.080,
        fg: 1.012,
        abv: 8.9,
        ibu: 25,
        grains: [
            "12 lb Pilsner Malt",
            "2 lb Belgian Candi Sugar (Clear)"
        ],
        hops: [
            "1.5 oz Styrian Goldings (60 min)",
            "0.5 oz Saaz (15 min)"
        ],
        yeast: "Belgian Abbaye Yeast"
    },
    {
        id: 2,
        name: "Hallowed Be Thy Grain",
        style: "Oatmeal Stout",
        category: "stout",
        description: "A smooth, roasty stout with silky mouthfeel from flaked oats. Notes of coffee and dark chocolate.",
        og: 1.054,
        fg: 1.014,
        abv: 5.2,
        ibu: 30,
        grains: [
            "9 lb Maris Otter",
            "1 lb Flaked Oats",
            "0.75 lb Chocolate Malt",
            "0.5 lb Roasted Barley"
        ],
        hops: [
            "1.5 oz East Kent Goldings (60 min)",
            "0.5 oz Fuggle (15 min)"
        ],
        yeast: "English Ale Yeast"
    },
    {
        id: 3,
        name: "Run to the Pills",
        style: "Czech Pilsner",
        category: "lager",
        description: "A crisp, golden lager with a firm bitterness and floral hop aroma. Lagered for 6 weeks.",
        og: 1.048,
        fg: 1.010,
        abv: 5.0,
        ibu: 40,
        grains: [
            "10 lb Bohemian Pilsner Malt"
        ],
        hops: [
            "2 oz Saaz (60 min)",
            "1 oz Saaz (15 min)",
            "1 oz Saaz (Dry hop)"
        ],
        yeast: "Czech Lager Yeast"
    },
    {
        id: 4,
        name: "Fear of the Hop",
        style: "West Coast IPA",
        category: "ipa",
        description: "An aggressively hopped IPA with pine and citrus notes. Dry, bitter, and unapologetically hoppy.",
        og: 1.068,
        fg: 1.012,
        abv: 7.3,
        ibu: 70,
        grains: [
            "12 lb Pale Ale Malt",
            "1 lb Munich Malt",
            "0.5 lb Crystal 40L"
        ],
        hops: [
            "2 oz Centennial (60 min)",
            "1 oz Simcoe (15 min)",
            "1 oz Citra (5 min)",
            "2 oz Citra (Dry hop)",
            "1 oz Simcoe (Dry hop)"
        ],
        yeast: "American Ale Yeast"
    },
    {
        id: 5,
        name: "The Trooper Ale",
        style: "English Bitter",
        category: "ale",
        description: "A sessionable English bitter with biscuity malt and earthy hops. Perfect for a long night.",
        og: 1.042,
        fg: 1.010,
        abv: 4.2,
        ibu: 32,
        grains: [
            "8 lb Maris Otter",
            "0.5 lb Crystal 60L",
            "0.25 lb Victory Malt"
        ],
        hops: [
            "1 oz East Kent Goldings (60 min)",
            "0.5 oz Fuggle (30 min)",
            "0.5 oz East Kent Goldings (5 min)"
        ],
        yeast: "English Ale Yeast"
    }
];

// Sample brew log data - edit this to add your brew history
const brewLog = [
    {
        batchNumber: 12,
        recipeId: 4,
        name: "Fear of the Hop",
        style: "West Coast IPA",
        brewDate: "2024-11-15",
        status: "conditioning",
        og: 1.070,
        fg: 1.013,
        abv: 7.5,
        notes: "Pushed the OG a bit higher than target. Fermentation was vigorous. Dry hopped for 5 days with an extra ounce of Citra.",
        rating: null
    },
    {
        batchNumber: 11,
        recipeId: 2,
        name: "Hallowed Be Thy Grain",
        style: "Oatmeal Stout",
        brewDate: "2024-10-20",
        status: "ready",
        og: 1.055,
        fg: 1.015,
        abv: 5.3,
        notes: "Hit all targets. Really smooth mouthfeel from the oats. Chocolate notes are prominent. Will definitely brew again.",
        rating: 4
    },
    {
        batchNumber: 10,
        recipeId: 5,
        name: "The Trooper Ale",
        style: "English Bitter",
        brewDate: "2024-09-28",
        status: "ready",
        og: 1.044,
        fg: 1.011,
        abv: 4.3,
        notes: "Classic session beer. Great balance of malt and hops. Carbed a bit high but still drinks well.",
        rating: 4
    },
    {
        batchNumber: 9,
        recipeId: 1,
        name: "Number of the Yeast",
        style: "Belgian Tripel",
        brewDate: "2024-08-10",
        status: "ready",
        og: 1.078,
        fg: 1.010,
        abv: 8.9,
        notes: "Slightly under target OG but finished dry. Fermented at 68F for clean esters. Getting better with age.",
        rating: 5
    },
    {
        batchNumber: 8,
        recipeId: 3,
        name: "Run to the Pills",
        style: "Czech Pilsner",
        brewDate: "2024-06-15",
        status: "archived",
        og: 1.049,
        fg: 1.011,
        abv: 5.0,
        notes: "First lager attempt. Fermentation temp control was tricky but managed to keep it at 50F. Lagered for 6 weeks. Clean and crisp.",
        rating: 4
    }
];

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function renderStars(rating) {
    if (!rating) return '<span class="rating-stars">Not rated yet</span>';
    const filled = '★'.repeat(rating);
    const empty = '☆'.repeat(5 - rating);
    return `<span class="rating-stars">${filled}${empty}</span>`;
}

function getStatusClass(status) {
    return `status status-${status}`;
}

// Render recipe cards
function renderRecipes(filter = 'all') {
    const container = document.getElementById('recipes-container');
    if (!container) return;

    const filteredRecipes = filter === 'all'
        ? recipes
        : recipes.filter(r => r.category === filter);

    container.innerHTML = filteredRecipes.map(recipe => `
        <div class="recipe-card" data-category="${recipe.category}">
            <h4>${recipe.name}</h4>
            <div class="style">${recipe.style}</div>
            <p class="description">${recipe.description}</p>
            <div class="specs">
                <div class="spec">
                    <div class="spec-value">${recipe.og.toFixed(3)}</div>
                    <div class="spec-label">OG</div>
                </div>
                <div class="spec">
                    <div class="spec-value">${recipe.fg.toFixed(3)}</div>
                    <div class="spec-label">FG</div>
                </div>
                <div class="spec">
                    <div class="spec-value">${recipe.abv}%</div>
                    <div class="spec-label">ABV</div>
                </div>
                <div class="spec">
                    <div class="spec-value">${recipe.ibu}</div>
                    <div class="spec-label">IBU</div>
                </div>
            </div>
            <div class="ingredients">
                <h5>Fermentables</h5>
                <ul>
                    ${recipe.grains.map(g => `<li>${g}</li>`).join('')}
                </ul>
                <h5 style="margin-top: 0.75rem;">Hops</h5>
                <ul>
                    ${recipe.hops.map(h => `<li>${h}</li>`).join('')}
                </ul>
                <h5 style="margin-top: 0.75rem;">Yeast</h5>
                <ul>
                    <li>${recipe.yeast}</li>
                </ul>
            </div>
        </div>
    `).join('');
}

// Render brew log
function renderBrewLog() {
    const container = document.getElementById('brew-log');
    if (!container) return;

    container.innerHTML = brewLog.map(brew => `
        <div class="brew-entry">
            <div class="batch-info">
                <div class="batch-number">Batch</div>
                <div class="batch-num">#${brew.batchNumber}</div>
                <div class="brew-date">${formatDate(brew.brewDate)}</div>
            </div>
            <div class="brew-details">
                <h4>${brew.name}</h4>
                <div class="brew-style">${brew.style}</div>
                <span class="${getStatusClass(brew.status)}">${brew.status}</span>
                <p class="brew-notes">${brew.notes}</p>
                <div class="brew-stats">
                    <div class="brew-stat">
                        <span>OG:</span>
                        <span>${brew.og.toFixed(3)}</span>
                    </div>
                    <div class="brew-stat">
                        <span>FG:</span>
                        <span>${brew.fg.toFixed(3)}</span>
                    </div>
                    <div class="brew-stat">
                        <span>ABV:</span>
                        <span>${brew.abv}%</span>
                    </div>
                </div>
                <div class="rating">
                    <span class="rating-label">Rating:</span>
                    ${renderStars(brew.rating)}
                </div>
            </div>
        </div>
    `).join('');
}

// Render recent brews on home page
function renderRecentBrews() {
    const container = document.getElementById('recent-brews');
    if (!container) return;

    const recentBrews = brewLog.slice(0, 3);

    container.innerHTML = recentBrews.map(brew => `
        <div class="card">
            <h4>${brew.name}</h4>
            <div class="style">${brew.style}</div>
            <div class="date">${formatDate(brew.brewDate)}</div>
            <span class="${getStatusClass(brew.status)}">${brew.status}</span>
            <div class="stats">
                <div class="stat">
                    <span class="stat-label">ABV</span>
                    <span class="stat-value">${brew.abv}%</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Batch</span>
                    <span class="stat-value">#${brew.batchNumber}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter button handling
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderRecipes(btn.dataset.filter);
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderRecipes();
    renderBrewLog();
    renderRecentBrews();
    initFilters();
});
