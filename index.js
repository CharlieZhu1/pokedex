// The section where the pokemon cards will be displayed.
const pokemonSection = document.querySelector('.pokemon-section');
// Keep track of the current page the user is on. 
let currentPage = 1;
// The number of pokemon to display per page.
const pageSize = 12;
const prevButton = document.querySelector('#prev-button');
const nextButton = document.querySelector('#next-button');
let maxPageNum = 0;
let pageInput = document.querySelector('#page-input');
const searchSection = document.querySelector('.search-section');
const paginationSection = document.querySelector('.pagination-section');
const pokemonInfoSection = document.querySelector('.pokemon-info');
const headerTitle = document.querySelector('.header-title');
const searchButton = document.querySelector('#search-button');
const searchInput = document.querySelector('#search');
const searchError = document.querySelector('.search-error');


/**
 * Go to the previous page
 */
prevButton.addEventListener('click', () => {
    if (currentPage === 1) {
        return;
    }
    currentPage--;
    pageInput.value = currentPage;
    getPokemon();
});

/**
 * Go to the next page
 */
nextButton.addEventListener('click', () => {
    if (currentPage === maxPageNum) {
        return;
    }
    currentPage++;
    pageInput.value = currentPage;
    getPokemon();
});

/**
 * Handle the page input change
 */
pageInput.addEventListener('change', () => {
    const page = pageInput.value;
    if (page < 1) {
        currentPage = 1;
    }
    else if (page > maxPageNum) {
        currentPage = maxPageNum;
    }
    else {
        currentPage = page;
    }
    pageInput.value = currentPage;
    getPokemon();
});

/**
 * Go back to the homepage when the header title is clicked. 
 */
headerTitle.addEventListener('click', () => {
    backToHomepage();
});

searchButton.addEventListener('click', () => {
    searchPokemon(searchInput);
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchPokemon(searchInput);
    }
});

/**
 * Get all the pokemon
 */
async function getPokemon() {
    const offset = (currentPage - 1) * pageSize;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`);
    // Clear the old page before displaying the new page.
    pokemonSection.innerHTML = '';
    const data = await res.json();
    const pokemon = data.results; 

    // Create a pokemon card for each pokemon
    for (const p of pokemon) {
        await createPokemonCard(p);
    }

    // Calculate the maximum page number
    const maxPokemon = data.count;
    maxPageNum = Math.ceil(maxPokemon / pageSize);
}

/**
 * Create a pokemon card for each pokemon
 * @param {} pokemon 
 */
async function createPokemonCard(pokemon) {
    const res = await fetch(pokemon.url);
    const pokemonInfo = await res.json();

    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.innerHTML = `
        <img class="pokemon-image" src="${pokemonInfo.sprites.other.dream_world.front_default}" alt="${pokemonInfo.name}" />
        <h3 class="pokemon-name">${pokemonInfo.name}</h3>
        <p class="pokemon-number">#${pokemonInfo.id}</p>
    `;

    pokemonSection.appendChild(card);

    // Add a click event listener to the pokemon card
    // When the pokemon card is clicked, show the pokemon details
    card.addEventListener('click', () => {
        showPokemonDetails(pokemonInfo);
    });
}

/**
 * Show the pokemon details page when pokemon card is clicked or a 
 * pokemon is searched for.
 * @param {*} pokemonInfo 
 */
async function showPokemonDetails(pokemonInfo) {
    searchSection.classList.add('hidden');
    pokemonSection.classList.add('hidden');
    paginationSection.classList.add('hidden');

    const types = pokemonInfo.types.map((type) => {
        const name = type.type.name;
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        return capitalizedName; 
    });
    const abilities = pokemonInfo.abilities.map((ability) => {
        const name = ability.ability.name;
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        return capitalizedName; 
    });
    const moves = pokemonInfo.moves.map((move) => { return move.move.name; });
    const height = pokemonInfo.height / 10;
    const weight = pokemonInfo.weight / 10;
    const stats = pokemonInfo.stats.map((stat) => { return { name: stat.stat.name, value: stat.base_stat }; });
    const baseExperience = pokemonInfo.base_experience;

    const speciesRes = await fetch(pokemonInfo.species.url);
    const speciesData = await speciesRes.json();
    const flavorTextObj = speciesData.flavor_text_entries.find((text) => {
        if (text.language.name === 'en') {
            return text.flavor_text;
        }
    });
    const flavorText = flavorTextObj.flavor_text.replace(/\s/g, ' ');

    console.log(pokemonInfo);
    console.log(types);
    console.log(abilities);
    console.log(moves);
    console.log(height);
    console.log(weight);
    console.log(stats);
    console.log(baseExperience);
    console.log(flavorText);

    pokemonInfoSection.innerHTML = `
        <div class="button-container">
            <button id="back-button">Back</button>
        </div>
        <img class="pokemon-info-image" src="${pokemonInfo.sprites.other.dream_world.front_default}" alt="${pokemonInfo.name}" />
        <h2 class="pokemon-info-name">${pokemonInfo.name}</h2>
        <h2 class="pokemon-info-number">#${pokemonInfo.id}</h2>
        <div class="pokemon-info-flavor-text-container">
            <p class="pokemon-info-flavor-text">"${flavorText}"</p>
        </div>
        <div class="pokemon-info-card">
            <p>Height: ${height} m</p>
            <p>Weight: ${weight} kg</p>
            <p>Types: ${types.join(', ')}</p>
            <p>Abilities: ${abilities.join(', ')}</p>
            <p>Base Experience: ${baseExperience}</p>
            <p>HP: ${stats.find((stat) => stat.name === 'hp').value}</p>
            <p>Attack: ${stats.find((stat) => stat.name === 'attack').value}</p>
            <p>Defense: ${stats.find((stat) => stat.name === 'defense').value}</p>
            <p>Special Attack: ${stats.find((stat) => stat.name === 'special-attack').value}</p>
            <p>Special Defense: ${stats.find((stat) => stat.name === 'special-defense').value}</p>
            <p>Speed: ${stats.find((stat) => stat.name === 'speed').value}</p>
        </div>
    `

    // Show the page after the data is ready. 
    pokemonInfoSection.classList.remove('hidden');
    window.scrollTo(0, 0);

    // Go back to homepage when the back button is clicked. 
    const backButton = document.querySelector('#back-button');
    backButton.addEventListener('click', () => {
        backToHomepage();
    });
}

async function searchPokemon(searchInput) {
    const searchValue = searchInput.value.trim().toLowerCase();

    // Throw an error for empty search value. 
    if (!searchValue) {
        console.error('No search value provided');
        searchError.classList.remove('hidden');
        return;
    }

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`);
    if (!res.ok) {
        console.error('Error searching for pokemon:', searchValue);
        searchError.classList.remove('hidden');
        return;
    }

    // Show the pokemon details page. 
    const pokemonInfo = await res.json();
    showPokemonDetails(pokemonInfo);
}

function backToHomepage() {
    pokemonInfoSection.classList.add('hidden');
    searchSection.classList.remove('hidden');
    pokemonSection.classList.remove('hidden');
    paginationSection.classList.remove('hidden');
    searchError.classList.add('hidden');
}

getPokemon();