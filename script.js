const url = "https://pokeapi.co/api/v2/";
let targeta = document.getElementById('pokemons');
let types = document.getElementById('types');
let pokemonTypes = document.getElementById('pokemonTypes');
let pokemonResult = document.getElementById('pokemonResult');

let search = document.getElementById('search');

let typesHTML = "";
let pokemonsHTML = ""; 

let generation = "pokemon?limit=151";

let generaciones = document.getElementsByClassName("generation-button");

let isLoading = false;

for (let i = 0; i < generaciones.length; i++) {
    generaciones[i].addEventListener('click', function () {

        if(isLoading) return;

        switch (this.value) {
            case '1':
                generation = "pokemon?limit=151";
                break;
            case '2':
                generation = "pokemon?offset=151&limit=100";
                break;
            case '3':
                generation = "pokemon?offset=251&limit=135";
                break;
            case '4':
                generation = "pokemon?offset=386&limit=107";
                break;
            case '5':
                generation = "pokemon?offset=493&limit=156";
                break;
            case '6':
                generation = "pokemon?offset=649&limit=72";
                break;
            case '7':
                generation = "pokemon?offset=721&limit=88";
                break;
            case '8':
                generation = "pokemon?offset=809&limit=96";
                break;
            case '9':
                generation = "pokemon?offset=905&limit=105";
                break;
        }
        targeta.innerHTML = `<p>Cargando Pokémon...</p>`;
        traerPokemon();
    });
}

async function traerTipos() {
    try {
        const res = await fetch(url + 'type');
        const data = await res.json();

        types.innerHTML = "";

        const typePromises = data.results.map(async (type) => {
            try {
                const typeUrl = type.url;
                const resType = await fetch(typeUrl);
                const dataType = await resType.json();

                let typePicture = null;

                if (dataType.sprites?.["generation-iii"]?.colosseum?.name_icon) {
                    typePicture = dataType.sprites["generation-iii"].colosseum.name_icon;
                } else if (dataType.sprites?.["generation-vi"]?.["omega-ruby-alpha-sapphire"]?.name_icon) {
                    typePicture = dataType.sprites["generation-vi"]["omega-ruby-alpha-sapphire"].name_icon;
                } else if (dataType.sprites?.["generation-ix"]?.["scarlet-violet"]?.name_icon) {
                    typePicture = dataType.sprites["generation-ix"]["scarlet-violet"].name_icon;
                }

                return `
                    <div class="type-div">
                        <h2>${type.name}</h2>
                        <button class="typeButton">
                            <img class="pokemonType" src="${typePicture}" value="${type.url}"/>
                        </button>
                    </div>
                `;
            } catch (error) {
                return `<div class="type-div error"><h2>${type.name}</h2><p>Error al cargar el icono</p></div>`;
            }
        });

        const typeHTMLArray = await Promise.all(typePromises);
        types.innerHTML = typeHTMLArray.join("");
    } catch (error) {
        return `<div class="type-div"><h2>Error ${error}</h2><p>Error al cargar el icono</p></div>`;
    }
}

document.addEventListener('click', async function (evento) {
    if (evento.target.classList.contains('pokemonType')) {
        let typeUrl = evento.target.getAttribute('value');
        if (isLoading) return;
        isLoading = true;
        pokemonTypes.innerHTML = ""; 

        try {
            const res = await fetch(typeUrl);
            const data = await res.json();

            const pokemonPromises = data.pokemon.map(async (pokemon) => {
                try {
                    const pokeRes = await fetch(pokemon.pokemon.url);
                    const pokeData = await pokeRes.json();

                    let pokemonName = pokemon.pokemon.name;
                    const pokemonImg = pokeData.sprites.front_default;

                    let conflictPokemons = ["nidoran-m", "eevee-starter","mr-mime", "nidoran-f", "ho-oh", "mime-jr", "jangmo-o", "hakamo-o", "kommo-o", "tapu-koko", "tapu-lele", "tapu-bulu", "tapu-fini", "type-null", "mr-rime", "great-tusk", "scream-tail", "brute-bonnet", "flutter-mane", "slither-wing", "sandy-shocks", "iron-moth", "iron-treads", "iron-bundle", "iron-hands", "iron-jugulis", "iron-thorns", "iron-valiant", "iron-leaves", "wo-chien", "chien-pao", "ting-lu", "chi-yu", "roaring-moon", "walking-wake"];

                    if (!conflictPokemons.includes(pokemonName)) {
                        pokemonName = pokemonName.split("-")[0];
                    }

                    const speciesRes = await fetch(url + `pokemon-species/${pokemonName}`);
                    const speciesData = await speciesRes.json();

                    const pokemonDescription = speciesData.flavor_text_entries.find(
                        (entry) => entry.language.name === "es"
                    )?.flavor_text || speciesData.flavor_text_entries.find(
                        (entry) => entry.language.name === "en"
                    )?.flavor_text;

                    return `
                        <div class="pokemonCard">
                            <img class="pokemonImage" src="${pokemonImg}" alt="${pokemonName}"/>
                            <h2>${pokemonName}</h2>
                            <p>${pokemonDescription}</p>
                        </div>
                    `;
                } catch (error) {
                    return `<div class="pokemonCard error"><h2>${pokemon.pokemon.name}</h2><p>Error al cargar datos.</p></div>`;
                }
            });

            const pokemonCards = await Promise.all(pokemonPromises);
            pokemonTypes.innerHTML = pokemonCards.join("");
        } catch (error) {
            return `<div class="pokemonCard error"><h2>Error ${error}</h2><p>Error al cargar datos.</p></div>`;
        } finally {
            isLoading = false;
        }
    }
});




async function traerPokemon() {
    isLoading = true;
    try {
        const res = await fetch(url + generation);
        const data = await res.json();

        targeta.innerHTML = "";

        const pokemonPromise = data.results.map(async (pokemon) => {
            const resPoke = await fetch(pokemon.url);
            const pokemonData = await resPoke.json();

            let pokemonName = pokemonData.name;
            const pokemonImg = pokemonData.sprites.front_default;

            let conflictPokemons = ["nidoran-m", "eevee-starter","mr-mime", "nidoran-f", "ho-oh", "mime-jr", "jangmo-o", "hakamo-o", "kommo-o", "tapu-koko", "tapu-lele", "tapu-bulu", "tapu-fini", "type-null", "mr-rime", "great-tusk", "scream-tail", "brute-bonnet", "flutter-mane", "slither-wing", "sandy-shocks", "iron-moth", "iron-treads", "iron-bundle", "iron-hands", "iron-jugulis", "iron-thorns", "iron-valiant", "iron-leaves", "wo-chien", "chien-pao", "ting-lu", "chi-yu", "roaring-moon", "walking-wake"];

            if (!conflictPokemons.includes(pokemonName)) {
                pokemonName = pokemonName.split("-")[0];
            }

            try {
                const speciesData = await fetch(url + `pokemon-species/${pokemonName}`);
                const speciesJson = await speciesData.json();

                const pokemonDescription = speciesJson.flavor_text_entries.find(
                    (entry) => entry.language.name === "es"
                )?.flavor_text || speciesJson.flavor_text_entries.find(
                    (entry) => entry.language.name === "en"
                )?.flavor_text;

                return `
                    <div class="pokemonCard">
                        <img class="pokemonImage" src="${pokemonImg}" alt="${pokemonName}"/>
                        <h2>${pokemonName}</h2>
                        <p>${pokemonDescription}</p>
                    </div>
                `;
            } catch (error) {
                return `
                    <div class="pokemonCard error">
                        <img class="pokemonImage" src="${pokemonImg}" alt="${pokemonName}"/>
                        <h2>${pokemonName}</h2>
                        <p>Error al conseguir la descripción</p>
                    </div>
                `;
            }
        });

        const pokemonCards = await Promise.all(pokemonPromise);
        targeta.innerHTML = pokemonCards.join("");
    } catch (error) {
        return `
                    <div class="pokemonCard error">
                        <h2>Error ${error}</h2>
                    </div>
                `;
    } finally {
        isLoading = false;
    }
}

document.addEventListener('click', async function (evento) {
    if (evento.target.classList.contains('search')) {
        pokemonResult.innerHTML = "";
        let searchText = document.getElementById('search-text').value.toLowerCase();

            const res = await fetch(url + "pokemon/" + searchText);
            const data = await res.json();

            let legacyCries = data.cries.legacy;
            let latestCries = data.cries.latest;
            
            let typePicture = null;

            let statsOut = "";
            let abilitiesOut = "";

            try{
                const typeUrl = data.types[0].type.url;
                const resType = await fetch(typeUrl);
                const dataType = await resType.json();

                if (dataType.sprites?.["generation-iii"]?.colosseum?.name_icon) {
                    typePicture = dataType.sprites["generation-iii"].colosseum.name_icon;
                } else if (dataType.sprites?.["generation-vi"]?.["omega-ruby-alpha-sapphire"]?.name_icon) {
                    typePicture = dataType.sprites["generation-vi"]["omega-ruby-alpha-sapphire"].name_icon;
                } else if (dataType.sprites?.["generation-ix"]?.["scarlet-violet"]?.name_icon) {
                    typePicture = dataType.sprites["generation-ix"]["scarlet-violet"].name_icon;
                }

            } catch(error){   
                pokemonResult.innerHTML += `
                <table class="pokeTable">
                    <thead>
                        <tr>
                            <th colspan="2"><img class="pokemonImg" src="${data.sprites.front_default}" alt="Una imagen del pokemon ${data.name}"/></th>
                            <th colspan="3"><h2>${data.name}</h2></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><img class="pokemonType" src="${typePicture}"/></td>
                            <td><h2>Audio antiguo</h2><audio class="pokeAudio" src="${legacyCries}" autoplay controls="on"></audio></td>
                            <td><h2>Audio actual</h2><audio class="pokeAudio" src="${latestCries}" controls="on"></audio></td>
                        </tr>
                    </tbody>
                </table>
                `
            }

            for(let i=0; i<data.stats.length; i++){

                statsOut += `
                <p>
                    ${data.stats[i].base_stat}
                    ${data.stats[i].stat.name}
                </p>
                `;
            }

            for(let i=0; i<data.abilities.length; i++){
                abilitiesOut += `
                <p>${data.abilities[i].ability.name}</p>
                `;
            }

            pokemonResult.innerHTML += `
            <table class="pokeTable">
                <thead>
                    <tr>
                        <th colspan="2"><img class="pokemonImg" src="${data.sprites.front_default}" alt="Una imagen del pokemon ${data.name}"/></th>
                        <th colspan="3"><h2>${data.name}</h2></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><img class="pokemonType" src="${typePicture}"/></td>
                        <td>${statsOut}</td>
                        <td>${abilitiesOut}</td>
                        <td><h2>Audio antiguo</h2><audio class="pokeAudio" src="${legacyCries}" autoplay controls="on"></audio></td>
                        <td><h2>Audio actual</h2><audio class="pokeAudio" src="${latestCries}" controls="on"></audio></td>
                    </tr>
                </tbody>
            </table>
            `;


       
    }
});

traerPokemon();
traerTipos();