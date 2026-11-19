// The section where the pokemon cards will be displayed.
const pokemonSection = document.querySelector('.pokemon-section');
// Keep track of the current page the user is on. 
let currentPage = 1;
// The number of pokemon to display per page.
const pageSize = 20;
const prevButton = document.querySelector('#prev-button');
const nextButton = document.querySelector('#next-button');
let maxPageNum = 0;
let pageInput = document.querySelector('#page-input');
const searchSection = document.querySelector('#search-section');
const paginationSection = document.querySelector('.pagination-section');


/**
 * Go to the previous page
 */
prevButton.addEventListener('click', () => {
    currentPage--;
    pageInput.value = currentPage;
    getPokemon();
});

/**
 * Go to the next page
 */
nextButton.addEventListener('click', () => {
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
        showPokemonDetails(pokemon);
    });
}

function showPokemonDetails(pokemon) {
    searchSection.classList.add('hidden');
    pokemonSection.classList.add('hidden');
    paginationSection.classList.add('hidden');
}

getPokemon();