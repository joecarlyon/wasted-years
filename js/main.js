// Wasted Years - Homebrewing Website
// Rendering logic (recipe data loaded from recipes.js)

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

    let filteredRecipes;
    if (filter === 'all') {
        filteredRecipes = recipes;
    } else if (filter === 'ipa') {
        filteredRecipes = recipes.filter(r => r.style.toLowerCase().includes('ipa'));
    } else if (filter === 'wheat') {
        filteredRecipes = recipes.filter(r => r.style.toLowerCase().includes('weissbier') || r.style.toLowerCase().includes('wheat'));
    } else if (filter === 'lager') {
        filteredRecipes = recipes.filter(r => r.category === 'lager');
    } else if (filter === 'stout') {
        filteredRecipes = recipes.filter(r => r.style.toLowerCase().includes('stout'));
    } else if (filter === 'spirit') {
        filteredRecipes = recipes.filter(r => r.category === 'spirit');
    } else {
        filteredRecipes = recipes.filter(r => r.category === filter);
    }

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
