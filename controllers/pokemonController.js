const fetch = require('node-fetch');
const messages = require('../model/messages.json');

const getPokemonPage = async url =>
  await fetch(url).then(res => res.json());

module.exports.getPokemonPage = async (req, res) => {
  let url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=10";

  if (req && req.body && req.body.url) {
    url = req.body.url;
  }

  const pokemonData = await getPokemonPage(url);

  for (let i = 0; i < pokemonData.results.length; i++) {
    let additionalData = await fetch(pokemonData.results[i].url).then(res => res.json());
    pokemonData.results[i].src = additionalData.sprites.other["official-artwork"].front_default;
  }

  return res.render('pages/pokemon', {
    title: 'Pokemon!',
    path: '/pokemon',
    messages: messages,
    pokemonData: pokemonData
  });
}
