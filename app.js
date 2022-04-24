const cards = document.getElementById("div-cards");
const templateCard = document.getElementById("template-card").content;
const input = document.querySelector(".input");
const main = document.querySelector("main");

//Funciones
const loadingData = (estado) => {
  const loading = document.getElementById("loading");
  return estado
    ? loading.classList.remove("d-none")
    : loading.classList.add("d-none");
};

const fetchData = async (input) => {
  try {
    loadingData(true);
    const resp = await fetch(
      `http://www.omdbapi.com/?i=tt3896198&apikey=18f72845&s=${input}`
    );
    const data = await resp.json();
    limpiarCard();
    pintarData(data.Search);
  } catch (error) {
    pintarAlerta("No se encontraron resultados,intenta de nuevo");
  } finally {
    loadingData(false);
  }
};

const pintarData = (data) => {
  const fragment = document.createDocumentFragment();
  data.forEach((item) => {
    //evita el reflow
    const clone = templateCard.cloneNode(true);
    item.Poster === "N/A"
      ? (clone.querySelector("img").src = "./no-img.png")
      : (clone.querySelector("img").src = item.Poster);

    clone.querySelector(".card-title").textContent = item.Title;
    clone.querySelector("p").textContent = item.Type;
    clone.querySelector(".year").textContent = item.Year;

    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const limpiarCard = () => {
  while (cards.firstElementChild) {
    cards.removeChild(cards.firstElementChild);
  }
};

const pintarAlerta = (message) => {
  const alerta = document.createElement("DIV");
  alerta.classList.add("text-danger", "text-center");
  alerta.textContent = message;
  main.appendChild(alerta);
  setTimeout(() => {
    main.removeChild(alerta);
  }, 2500);
};
//evento
input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    if (input.value.trim().length > 0) {
      limpiarCard();
      fetchData(input.value);
      input.value = "";
    } else {
      pintarAlerta("Campo requerido");
    }
  }
});
