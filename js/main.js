// Wasted Years - Homebrewing Website
// Data and rendering logic

// Recipe data imported from Brewfather
const recipes = [
    {
        id: 1,
        name: "4PyRyeO Pale Ale",
        style: "American Pale Ale",
        category: "ale",
        description: "A hop-forward pale ale with rye spice and a solid malt backbone. Columbus provides the bitter punch while Mosaic brings tropical fruit on the dry hop.",
        og: 1.056,
        fg: 1.013,
        abv: 5.64,
        ibu: 33.7,
        grains: [
            "8 lb Golden Promise Pale Ale",
            "2 lb BEST Red X",
            "2 lb Flaked Rye",
            "1 lb Melanoidin Malt",
            "1 lb Wheat Malt",
            "0.5 lb Munich II"
        ],
        hops: [
            "0.4 oz Columbus (First Wort, 60 min)",
            "0.7 oz Columbus (5 min)",
            "0.5 oz Cascade (5 min)",
            "3 oz Mosaic (Dry Hop)"
        ],
        yeast: "Omega West Coast Ale I (OYL-004)"
    },
    {
        id: 2,
        name: "Extra Special Bitter",
        style: "ESB",
        category: "ale",
        description: "Classic English ESB from David Heath's recipe. Rich malt character with earthy, floral UK hops. Fermented fast and hot with Voss Kveik.",
        og: 1.051,
        fg: 1.011,
        abv: 5.25,
        ibu: 34.3,
        grains: [
            "8.4 lb Pale Ale Malt",
            "0.6 lb Chateau Crystal",
            "0.5 lb Lyle's Golden Syrup",
            "0.3 lb Chateau Wheat Blanc",
            "0.2 lb Carafa Special III"
        ],
        hops: [
            "0.95 oz Northdown (60 min)",
            "0.6 oz Fuggle (10 min)",
            "0.5 oz Fuggle (Aroma)"
        ],
        yeast: "Lallemand Voss Kveik"
    },
    {
        id: 3,
        name: "Pumpkin Ale",
        style: "Pumpkin Spice Beer",
        category: "ale",
        description: "Fall seasonal with roasted butternut squash in the boil. Warm spices of cinnamon, allspice, ginger, and nutmeg with vanilla in secondary.",
        og: 1.058,
        fg: 1.011,
        abv: 6.17,
        ibu: 14.5,
        grains: [
            "8.3 lb Pale Malt 2-Row",
            "1.3 lb Wheat Malt",
            "0.9 lb Dark Brown Sugar",
            "0.7 lb Crystal Malt",
            "0.7 lb Flaked Oats",
            "0.7 lb Victory Malt",
            "0.4 lb Acid Malt",
            "0.4 lb Carapils"
        ],
        hops: [
            "0.2 oz Magnum (60 min)",
            "0.5 oz Mount Hood (15 min)",
            "0.9 oz Mount Hood (Aroma)"
        ],
        yeast: "Fermentis SafAle S-04",
        extras: "2 Roasted Butternut Squash, Cinnamon, Allspice, Ginger, Nutmeg, Vanilla Extract"
    },
    {
        id: 4,
        name: "Sample Blonde Ale",
        style: "Blonde Ale",
        category: "ale",
        description: "A clean, approachable blonde ale. Light body with subtle malt sweetness and a pleasant hop character from Saaz and Amarillo.",
        og: 1.044,
        fg: 1.008,
        abv: 4.73,
        ibu: 19.8,
        grains: [
            "4.4 lb BestMalz Pale Ale",
            "4.4 lb BestMalz Pilsen",
            "1.3 lb Caramel Pils",
            "0.2 lb Pale Crystal Malt"
        ],
        hops: [
            "0.2 oz Summit (60 min)",
            "0.7 oz Saaz (15 min)",
            "0.2 oz Amarillo (15 min)",
            "0.7 oz Saaz (Aroma)",
            "0.2 oz Amarillo (Aroma)",
            "0.7 oz Amarillo (Dry Hop)"
        ],
        yeast: "Fermentis Safale US-05"
    }
];

// Brew log data - add your brew history here
// Each entry tracks a specific batch you've brewed
const brewLog = [
    // Example entry format:
    // {
    //     batchNumber: 1,
    //     recipeId: 1,
    //     name: "4PyRyeO Pale Ale",
    //     style: "American Pale Ale",
    //     brewDate: "2024-01-15",
    //     status: "ready", // fermenting, conditioning, ready, archived
    //     og: 1.056,
    //     fg: 1.013,
    //     abv: 5.64,
    //     notes: "Your notes about this batch...",
    //     rating: 4 // 1-5 stars, or null if not rated
    // }
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
                ${recipe.extras ? `
                <h5 style="margin-top: 0.75rem;">Extras</h5>
                <ul>
                    <li>${recipe.extras}</li>
                </ul>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Render brew log
function renderBrewLog() {
    const container = document.getElementById('brew-log');
    if (!container) return;

    if (brewLog.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No brews logged yet. Time to fire up the kettle.</p>
                <p class="hint">Add your brew history in js/main.js</p>
            </div>
        `;
        return;
    }

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

    if (brewLog.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No brews logged yet.</p>
            </div>
        `;
        return;
    }

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
