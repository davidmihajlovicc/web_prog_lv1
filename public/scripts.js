let sviFilmovi = [];
let kosarica = [];


fetch("movies.csv")
.then(res => res.text())
.then(csv => {

    const rezultat = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true
    });

    sviFilmovi = rezultat.data.map(film => ({
        title: film.Naslov,
        year: Number(film.Godina),
        genre: film.Zanr,
        duration: Number(film.Trajanje_min),
        country: film.Zemlja_porijekla?.split("/").map(c => c.trim()) || [],
        rating: Number(film.Ocjena)
    }));

    prikazi(sviFilmovi);
});



function prikazi(filmovi) {
    const tbody = document.querySelector("#filmovi-tablica tbody");
    tbody.innerHTML = "";

    filmovi.forEach((film) => {
        const tr = document.createElement("tr");

        const btn = document.createElement("button");
        btn.textContent = "Dodaj";
        btn.id = "dodaj"

        btn.addEventListener("click", () => {
            dodajUKosaricu(film);
        });

        tr.innerHTML = `
            <td>${film.title}</td>
            <td>${film.year}</td>
            <td>${film.genre}</td>
            <td>${film.duration}</td>
            <td>${film.country.join(", ")}</td>
            <td>${film.rating}</td>
            <td></td>
        `;

        tr.querySelector("td:last-child").appendChild(btn);

        tbody.appendChild(tr);
    });
}

function applyFilters() {

    let genre = document.getElementById("filter-genre").value.toLowerCase();
    let from = Number(document.getElementById("year-from").value);
    let to = Number(document.getElementById("year-to").value);
    let country = document.getElementById("filter-country").value.toLowerCase();
    let rating = Number(document.getElementById("filter-rating").value);
    let sort = document.getElementById("sort").value;

    let filtrirani = sviFilmovi.filter(f => {
        return (!genre || f.genre.toLowerCase().includes(genre)) &&
               (!from || f.year >= from) &&
               (!to || f.year <= to) &&
               (!country || f.country.some(c => c.toLowerCase().includes(country))) &&
               (f.rating >= rating);
    });

    if (sort === "year") filtrirani.sort((a, b) => a.year - b.year);
    if (sort === "votes") filtrirani.sort((a, b) => a.duration - b.duration);

    prikazi(filtrirani);
}


document.getElementById("btn-filter").addEventListener("click", applyFilters);

document.getElementById("sort").addEventListener("change", applyFilters);



document.getElementById("filter-rating").addEventListener("input", (e) => {
    document.getElementById("rating-value").textContent = e.target.value;
});



function dodajUKosaricu(film) {

    if (kosarica.some(f => f.title === film.title)) {
        alert("Film je već u košarici!");
        return;
    }

    kosarica.push(film);
    osvjeziKosaricu();
}



function osvjeziKosaricu() {
    const ul = document.getElementById("lista-kosarice");
    ul.innerHTML = "";

    kosarica.forEach((film, i) => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${film.title} (${film.year}) - ${film.genre}
            <button id="ukloni" onclick="ukloni(${i})">X</button>
        `;

        ul.appendChild(li);
    });

    
    const counter = document.getElementById("kosarica-count");
    if (counter) counter.textContent = kosarica.length;
}



function ukloni(i) {
    kosarica.splice(i, 1);
    osvjeziKosaricu();
}



document.getElementById("potvrdi").addEventListener("click", () => {

    if (kosarica.length === 0) {
        alert("Košarica je prazna!");
        return;
    }

    alert(`Uspješno ste dodali ${kosarica.length} filmova u košaricu!`);

    kosarica = [];
    osvjeziKosaricu();
});