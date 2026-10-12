import express from "express";
import fetch from "node-fetch";

const app = express();
const portti = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("etusivu");
});

app.get("/sukupolvi/:numero", async (req, res) => {
  const numero = req.params.numero;
  try {
    const vastaus = await fetch(
      `https://pokeapi.co/api/v2/generation/${numero}/`,
    );
    const tiedot = await vastaus.json();
    res.render("sukupolvi", {
      numero: numero,
      pokemonit: tiedot.pokemon_species,
    });
  } catch (virhe) {
    console.log(virhe);
    res.render("virhe", { viesti: "Sukupolvea ei löytynyt." });
  }
});

app.get("/pokemon/:nimi", async (req, res) => {
  const nimi = req.params.nimi;
  try {
    const vastaus = await fetch(`https://pokeapi.co/api/v2/pokemon/${nimi}/`);
    if (!vastaus.ok) {
      throw new Error("Pokemonia ei löytynyt");
    }
    const pokemon = await vastaus.json();
    res.render("pokemon", { pokemon: pokemon });
  } catch (virhe) {
    console.log(virhe);
    res.render("virhe", { viesti: "Pokemonia ei löytynyt." });
  }
});

app.listen(portti, () => {
  console.log(`Palvelin on siis käynnistyi porttiin ${portti}`);
});
