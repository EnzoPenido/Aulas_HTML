const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number');
const pokemonImage = document.querySelector('.pokemon_image');

const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const buttonShiny = document.querySelector('.btn-shiny');

let searchPokemon = 1;
let isShiny = false;

const fetchPokemon = async (pokemon) => {
    try {
        const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        if (APIResponse.status === 200) {
            const data = await APIResponse.json();
            return data;
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar Pokémon:', error);
        return null;
    }
};

const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';

    const data = await fetchPokemon(pokemon);

    if (data) {
        pokemonImage.style.display = 'block';
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;

        // Tentativa 1: sprite animado da geração V
        let spriteUrl = isShiny
            ? data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_shiny
            : data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;

        // Tentativa 2: sprite padrão se o animado não existir
        if (!spriteUrl) {
            spriteUrl = isShiny
                ? data.sprites?.front_shiny
                : data.sprites?.front_default;
        }

        if (spriteUrl) {
            pokemonImage.src = spriteUrl;
        } else {
            pokemonImage.style.display = 'none';
        }

        input.value = '';
        searchPokemon = data.id;
    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Not found XD';
        pokemonNumber.innerHTML = '';
    }
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.trim().toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

buttonShiny.addEventListener('click', () => {
    buttonShiny.classList.toggle('ativo');
    isShiny = !isShiny;
    renderPokemon(searchPokemon);
});

renderPokemon(searchPokemon);