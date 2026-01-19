// Wasted Years - Homebrewing Website
// Data and rendering logic

// Recipe data imported from Brewfather
const recipes = [
    {
        id: 1,
        name: "Anklebiter",
        style: "American IPA",
        category: "ale",
        description: "Hop-forward IPA with citrus and tropical notes from Cashmere, Mosaic, and German hops. Honey malt adds subtle sweetness.",
        og: 1.067,
        fg: 1.012,
        abv: 7.22,
        ibu: 48.8,
        grains: [
            "10.5 lb Pale Ale Malt 2-Row",
            "1.5 lb Vienna Malt",
            "1 lb Honey Malt",
            "1 lb Wheat Flaked"
        ],
        hops: [
            "0.5 oz Eukanot (60 min)",
            "1 oz Cashmere (10 min)",
            "1 oz Mandarina Bavaria (10 min)",
            "2 oz Cashmere (Whirlpool)",
            "1 oz Hallertau Blanc (Whirlpool)",
            "1 oz Mandarina Bavaria (Whirlpool)",
            "2 oz Cashmere (Dry Hop)",
            "2 oz Mosaic (Dry Hop)",
            "1 oz Hallertau Blanc (Dry Hop)"
        ],
        yeast: "Omega Voss Kveik (OYL-061)"
    },
    {
        id: 2,
        name: "Bavarian Hefeweizen",
        style: "Weissbier",
        category: "ale",
        description: "Classic German wheat beer with banana and clove character. Light, refreshing, and perfect for summer.",
        og: 1.049,
        fg: 1.012,
        abv: 4.86,
        ibu: 14.7,
        grains: [
            "4.5 lb Pale Malt 2-Row",
            "3.5 lb Wheat White Malt",
            "1 lb Wheat Flaked",
            "0.5 lb Carapils",
            "0.5 lb Munich I"
        ],
        hops: [
            "0.5 oz Cascade (60 min)",
            "1 oz Mandarina Bavaria (Whirlpool)",
            "0.5 oz Cascade (Whirlpool)"
        ],
        yeast: "Omega Hefeweizen Ale (OYL-021)"
    },
    {
        id: 3,
        name: "Czech It Out",
        style: "Czech Amber Lager",
        category: "lager",
        description: "Malty Czech amber with Saaz hops providing earthy, herbal notes. Rich Vienna and Munich character.",
        og: 1.040,
        fg: 1.007,
        abv: 4.33,
        ibu: 14.7,
        grains: [
            "6 lb Vienna Malt",
            "2 lb Munich",
            "1 lb Caramunich II",
            "0.5 lb Carafa Special I",
            "0.5 lb Dark Munich Malt 30L"
        ],
        hops: [
            "0.5 oz Saaz (60 min)",
            "0.5 oz Saaz (30 min)",
            "1 oz Saaz (Whirlpool)"
        ],
        yeast: "Omega Lutra Kveik (OYL-071)"
    },
    {
        id: 4,
        name: "Drunkle",
        style: "Dunkles Weissbier",
        category: "ale",
        description: "Dark German wheat beer with rich malt character. Banana, clove, and chocolate notes.",
        og: 1.053,
        fg: 1.013,
        abv: 5.25,
        ibu: 17.2,
        grains: [
            "5 lb Wheat White Malt",
            "3 lb Munich II",
            "2 lb Vienna Malt",
            "0.5 lb Caramunich II",
            "0.5 lb Chocolate Wheat"
        ],
        hops: [
            "1 oz Tettnang (60 min)"
        ],
        yeast: "Omega Hefeweizen Ale (OYL-021)"
    },
    {
        id: 5,
        name: "Helles Yeah",
        style: "German Helles Exportbier",
        category: "lager",
        description: "Clean, crisp German lager with subtle malt sweetness and noble hop character.",
        og: 1.051,
        fg: 1.009,
        abv: 5.51,
        ibu: 22.1,
        grains: [
            "5 lb Bohemian Pilsner",
            "4 lb Pilsner Malt",
            "1.25 lb Vienna Malt",
            "1 lb Munich Malt",
            "0.65 lb Carapils",
            "0.4 lb Carahell"
        ],
        hops: [
            "1 oz Hallertau (60 min)",
            "1 oz Hallertau (15 min)"
        ],
        yeast: "Omega Voss Kveik (OYL-061)"
    },
    {
        id: 6,
        name: "Imperial Hefe",
        style: "Weissbier",
        category: "ale",
        description: "Big, bold wheat beer with intense banana and clove. Higher ABV version of the classic style.",
        og: 1.076,
        fg: 1.019,
        abv: 7.48,
        ibu: 14.3,
        grains: [
            "7 lb Pale Malt 2-Row",
            "7 lb Wheat White Malt",
            "2 lb Wheat Flaked",
            "1 lb Carapils",
            "1 lb Munich"
        ],
        hops: [
            "1 oz Comet (15 min)",
            "1 oz Hallertauer Mittelfrueh (5 min)"
        ],
        yeast: "Omega Hefeweizen Ale (OYL-021)"
    },
    {
        id: 7,
        name: "Joeoverlord",
        style: "American IPA",
        category: "ale",
        description: "West Coast IPA with Cascade and Motueka providing citrus and tropical fruit character. Rye adds spicy complexity.",
        og: 1.060,
        fg: 1.014,
        abv: 6.04,
        ibu: 44.6,
        grains: [
            "13 lb Pale Ale Malt 2-Row",
            "1.25 lb Caramel Malt 20L",
            "1.25 lb Carapils",
            "1 lb Rye, Flaked"
        ],
        hops: [
            "1 oz Cascade (60 min)",
            "1 oz Cascade (45 min)",
            "3 oz Cascade (Whirlpool)",
            "2 oz Motueka (Whirlpool)",
            "3 oz Cascade (Dry Hop)",
            "1 oz Nelson Sauvin (Dry Hop)"
        ],
        yeast: "Omega West Coast IV (OYL-050)"
    },
    {
        id: 8,
        name: "Moo Moo Canoe",
        style: "American Stout",
        category: "ale",
        description: "Creamy milk stout with lactose sweetness and rich chocolate and roasted malt character.",
        og: 1.070,
        fg: 1.025,
        abv: 5.91,
        ibu: 43,
        grains: [
            "16 lb Pale Ale Malt 2-Row",
            "3 lb Milk Sugar (Lactose)",
            "2.5 lb Chocolate",
            "2 lb Barley, Flaked",
            "2 lb Caramel Malt 60L",
            "2 lb Munich II",
            "2 lb Roasted Barley",
            "1 lb Oats, Flaked"
        ],
        hops: [
            "2 oz Magnum (60 min)",
            "2 oz Goldings, East Kent (10 min)"
        ],
        yeast: "Omega British Ale I (OYL-006)"
    },
    {
        id: 9,
        name: "Overlord 3.1 5g",
        style: "American IPA",
        category: "ale",
        description: "Single-hop Citra IPA with intense tropical and citrus character. The 5-gallon batch version.",
        og: 1.066,
        fg: 1.015,
        abv: 6.69,
        ibu: 65.6,
        grains: [
            "12 lb Pale Ale Malt 2-Row",
            "1 lb Caramel Malt 20L",
            "1 lb Carapils",
            "0.5 lb Rye, Flaked"
        ],
        hops: [
            "0.5 oz Citra (60 min)",
            "1 oz Citra (45 min)",
            "0.5 oz Citra (10 min)",
            "3 oz Citra (Whirlpool)",
            "3 oz Citra (Dry Hop)"
        ],
        yeast: "Omega West Coast IV (OYL-050)"
    },
    {
        id: 10,
        name: "Overlord v3.1",
        style: "American IPA",
        category: "ale",
        description: "Single-hop Citra IPA with intense tropical and citrus character. Full batch version with massive hop presence.",
        og: 1.060,
        fg: 1.014,
        abv: 6.04,
        ibu: 61.4,
        grains: [
            "22 lb Pale Ale Malt 2-Row",
            "2 lb Caramel Malt 20L",
            "2 lb Carapils",
            "1 lb Rye, Flaked"
        ],
        hops: [
            "2 oz Citra (45 min)",
            "1 oz Citra (15 min)",
            "1 oz Citra (10 min)",
            "6 oz Citra (Whirlpool)",
            "6 oz Citra (Dry Hop)"
        ],
        yeast: "Omega West Coast IV (OYL-050)"
    },
    {
        id: 11,
        name: "Second City Session IPA",
        style: "Session IPA",
        category: "ale",
        description: "Lighter bodied IPA with big hop flavor. Citra, Amarillo, Simcoe, and Chinook for a complex hop profile.",
        og: 1.041,
        fg: 1.008,
        abv: 4.33,
        ibu: 49.6,
        grains: [
            "7 lb Pale Ale Malt 2-Row",
            "1 lb Caramel Malt 10L",
            "0.75 lb Carapils",
            "0.5 lb Caramel Malt 20L",
            "0.5 lb Munich"
        ],
        hops: [
            "1 oz Citra (60 min)",
            "1 oz Amarillo (Whirlpool)",
            "1 oz Simcoe (Whirlpool)",
            "2 oz Chinook (Dry Hop)",
            "1 oz Simcoe (Dry Hop)"
        ],
        yeast: "Omega West Coast III (OYL-043)"
    },
    {
        id: 12,
        name: "Spicy Sprinkles",
        style: "Specialty Ale",
        category: "ale",
        description: "Complex malt-forward ale with caramel rye and Special B adding rich, spicy character. Pacific Jade brings herbal notes.",
        og: 1.069,
        fg: 1.018,
        abv: 6.69,
        ibu: 38.5,
        grains: [
            "12 lb Pilsner Malt 2-Row",
            "3 lb Caramel Rye",
            "2 lb Carared",
            "1 lb Carapils",
            "1 lb Special B"
        ],
        hops: [
            "0.5 oz Pacific Jade (60 min)",
            "2 oz Cascade (10 min)",
            "2.5 oz Pacific Jade (Whirlpool)",
            "2 oz Cascade (Dry Hop)",
            "1 oz Pacific Jade (Dry Hop)"
        ],
        yeast: "Omega Star Party (OYL-404)"
    },
    {
        id: 13,
        name: "The Devil's Narwhal",
        style: "Hazy IPA (NEIPA)",
        category: "ale",
        description: "Hazy, juicy IPA with massive hop additions. Oats and wheat provide silky mouthfeel while Centennial, Cascade, and Motueka bring fruit-forward character.",
        og: 1.063,
        fg: 1.017,
        abv: 6.04,
        ibu: 61.1,
        grains: [
            "22 lb Pale Ale Malt 2-Row",
            "3 lb Oats, Flaked",
            "3 lb Wheat White Malt",
            "2 lb Carapils",
            "1 lb Rye Malt"
        ],
        hops: [
            "1 oz Columbus (60 min)",
            "3 oz Centennial (10 min)",
            "1 oz Columbus (10 min)",
            "4 oz Cascade (Whirlpool)",
            "4 oz Centennial (Whirlpool)",
            "3 oz Centennial (Dry Hop)",
            "2 oz Motueka (Dry Hop)",
            "2 oz Saaz (Dry Hop)",
            "1 oz Nelson Sauvin (Dry Hop)"
        ],
        yeast: "Omega British Ale V (OYL-011)"
    },
    {
        id: 14,
        name: "Twin Pines Piney IPA",
        style: "American IPA",
        category: "ale",
        description: "Bold, piney West Coast IPA with Chinook providing resinous character and Nelson Sauvin adding white wine notes.",
        og: 1.056,
        fg: 1.013,
        abv: 5.64,
        ibu: 113,
        grains: [
            "12 lb Pale Ale Malt 2-Row",
            "1 lb Vienna Malt"
        ],
        hops: [
            "2 oz Chinook (60 min)",
            "0.5 oz Chinook (20 min)",
            "0.5 oz Nelson Sauvin (20 min)",
            "0.5 oz Chinook (5 min)",
            "0.5 oz Nelson Sauvin (5 min)",
            "2 oz Nelson Sauvin (Dry Hop)"
        ],
        yeast: "Omega West Coast Ale I (OYL-004)"
    },
    {
        id: 15,
        name: "Wry Smile Rye IPA",
        style: "Rye IPA",
        category: "ale",
        description: "Spicy rye IPA with earthy Mount Hood and bold Columbus hops. Crystal malt adds caramel backbone.",
        og: 1.063,
        fg: 1.015,
        abv: 6.3,
        ibu: 77.2,
        grains: [
            "11 lb Pale Malt 2-Row",
            "3 lb Rye Malt",
            "1 lb Crystal 60L",
            "0.5 lb Carapils",
            "0.5 lb Wheat White"
        ],
        hops: [
            "1 oz Mount Hood (60 min)",
            "1 oz Columbus (60 min)",
            "1 oz Mount Hood (30 min)",
            "1 oz Mount Hood (Whirlpool)",
            "1 oz Columbus (Dry Hop)"
        ],
        yeast: "Wyeast Denny's Favorite (1450)"
    },
    {
        id: 16,
        name: "Beginning Bourbon",
        style: "Bourbon Mash",
        category: "spirit",
        description: "Traditional bourbon mash bill with corn, malted barley, rye, and wheat. Fermented with HotHead for distillation.",
        og: 1.058,
        fg: 1.009,
        abv: 6.43,
        ibu: 0,
        grains: [
            "6.5 lb Corn Yellow, Flaked",
            "3 lb Organic 2-Row Pale Malt",
            "1.5 lb Rye Malt",
            "1 lb Wheat Malt"
        ],
        hops: [],
        yeast: "Omega HotHead Ale (OYL-057)"
    },
    {
        id: 17,
        name: "Rum Wash",
        style: "Rum Wash",
        category: "spirit",
        description: "Simple rum wash with blackstrap molasses and cane sugar. High gravity fermentation for distillation.",
        og: 1.087,
        fg: 0.981,
        abv: 13.91,
        ibu: 0,
        grains: [
            "8 lb Blackstrap Molasses",
            "6 lb Cane Sugar"
        ],
        hops: [],
        yeast: "Red Star Ale"
    },
    {
        id: 18,
        name: "Wheat Vodka",
        style: "Vodka Wash",
        category: "spirit",
        description: "Clean wheat wash for vodka distillation. Simple grain bill lets the neutral spirit shine.",
        og: 1.066,
        fg: 1.016,
        abv: 6.56,
        ibu: 0,
        grains: [
            "13.2 lb Wheat White Malt"
        ],
        hops: [],
        yeast: "White Labs Pinnacle Distillers (WLDPINNACLE S)"
    },
    {
        id: 19,
        name: "Wizard Fight",
        style: "Experimental",
        category: "ale",
        description: "Experimental base beer with organic pale malt and oats. A blank canvas for additions or further development.",
        og: 1.056,
        fg: 1.013,
        abv: 5.64,
        ibu: 0,
        grains: [
            "10 lb Organic 2-Row Pale Malt",
            "1 lb Carapils Malt",
            "1 lb Munich Malt",
            "1 lb Oats, Flaked"
        ],
        hops: [],
        yeast: "Not specified"
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
