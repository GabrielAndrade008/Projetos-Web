const API_URL = "https://api.jikan.moe/v4";
const animeGrid = document.getElementById("anime-grid");
const loader = document.getElementById("loader");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const searchInput = document.getElementById("searchInput");
const filterList = document.getElementById("filter-list");
const scrollTrigger = document.getElementById("scroll-trigger");

// --- Variáveis de Estado ---
let currentFilter = "popular";
let currentQuery = "";
let currentPage = 1;
let isLoading = false;
let hasMorePages = true;

// --- Funções Principais ---

async function fetchAPI(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados da API:", error);
    return null;
  }
}

function displayAnimes(animes, append = false) {
  if (!append) {
    animeGrid.innerHTML = "";
  }

  const genresToExclude = [12, 9, 49];

  const filteredAnimes = animes.filter((anime) => {
    if (!anime.genres || anime.genres.length === 0) {
      return true;
    }

    const hasBannedGenre = anime.genres.some((genre) =>
      genresToExclude.includes(genre.mal_id)
    );

    return !hasBannedGenre;
  });

  if (!filteredAnimes || filteredAnimes.length === 0) {
    if (!append) {
      animeGrid.innerHTML = `<p class="info-message">Nenhum anime encontrado para sua busca.</p>`;
    }
    hasMorePages = false;
    return;
  }

  // Agora usamos a lista filtrada para exibir
  filteredAnimes.forEach((anime) => {
    // <-- Verificamos o 'filteredAnimes'
    const animeCard = document.createElement("div");
    animeCard.className = "anime-card";
    const imageUrl = anime.images?.webp?.large_image_url || "placeholder.jpg";

    // Adicione o atributo loading="lazy" aqui
    animeCard.innerHTML = `
            <img src="${imageUrl}" alt="${anime.title}" class="anime-card-image" loading="lazy">
            <div class="anime-card-title">
                <h3>${anime.title}</h3>
            </div>
        `;

    animeCard.addEventListener("click", () => showAnimeDetails(anime.mal_id));
    animeGrid.appendChild(animeCard);
  });
}

async function loadAnimes(append = false) {
  if (isLoading || (append && !hasMorePages)) return;

  isLoading = true;
  if (!append) {
    currentPage = 1;
    hasMorePages = true;
    animeGrid.innerHTML = ""; // Limpa o grid para nova busca/filtro
  } else {
    currentPage++;
  }

  loader.style.display = "flex";

  // --- LÓGICA DO ENDPOINT CORRIGIDA ---

  // Parâmetros base
  const excludeGenresParams = "genres_exclude=9,12,49"; // Ecchi, Hentai, Erotica
  const pageParams = `page=${currentPage}&limit=18`;

  let endpoint = "";
  let queryParams = [pageParams, excludeGenresParams]; // Monta um array de parâmetros

  if (currentQuery.length > 2) {
    // Modo de Busca
    endpoint = "/anime";
    // Adiciona os parâmetros de busca
    queryParams.push(
      `q=${encodeURIComponent(currentQuery)}`,
      "order_by=popularity",
      "sort=asc"
    );
  } else {
    // Modo de Filtro
    switch (currentFilter) {
      case "popular":
        endpoint = "/top/anime";
        break;
      case "airing":
        endpoint = "/seasons/now";
        break;
      case "upcoming":
        endpoint = "/seasons/upcoming";
        break;
      case "movie":
        endpoint = "/top/anime";
        queryParams.push("type=movie"); // Adiciona o tipo filme
        break;
      default:
        endpoint = "/top/anime";
    }
  }

  // Junta tudo de forma segura: /endpoint?param1=valor&param2=valor
  endpoint += `?${queryParams.join("&")}`;

  // --- FIM DA LÓGICA CORRIGIDA ---

  const data = await fetchAPI(endpoint);

  if (data && data.data) {
    displayAnimes(data.data, append);
    // Atualiza o estado da paginação
    hasMorePages = data.pagination?.has_next_page || false;
  } else {
    hasMorePages = false;
    if (!append) {
      animeGrid.innerHTML = `<p class="error-message">Não foi possível carregar os animes. Tente novamente mais tarde.</p>`;
    }
  }

  loader.style.display = "none";
  isLoading = false;
}

// (Sua função showAnimeDetails original - cole ela aqui)
async function showAnimeDetails(id) {
  modal.classList.remove("hidden");
  modalContent.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;

  try {
    // Usei /full para pegar todos os dados
    const response = await fetch(`${API_URL}/anime/${id}/full`);
    if (!response.ok) throw new Error("Falha ao buscar detalhes");

    const { data: anime } = await response.json(); // Mockup de serviços de streaming
    const streamingServices = getStreamingServices(anime.title);

    // DENTRO DE showAnimeDetails no script.js

    modalContent.innerHTML = `
        <button onclick="closeModal()" class="modal-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div class="modal-body">
            <div class="modal-image-container">
                <img src="${anime.images.webp.large_image_url}" alt="${
      anime.title
    }" class="modal-image">
            </div>
            <div class="modal-details">
                <h2 class="modal-title">${anime.title_japanese} (${
      anime.title
    })</h2>
                <div class="modal-meta">
                    <span>⭐ ${anime.score || "N/A"}</span>
                    <span>${anime.type || "N/A"}</span>
                    <span>${anime.year || "N/A"}</span>
                    <span>${anime.status || "N/A"}</span>
                </div>
                <div class="genre-tags">
                    ${anime.genres
                      .map(
                        (genre) =>
                          `<span class="genre-tag">${genre.name}</span>`
                      )
                      .join("")}
                </div>
                <h3 class="modal-subtitle">Sinopse</h3>
                <p class="modal-synopsis">${
                  anime.synopsis
                    ? anime.synopsis.substring(0, 400) + "..."
                    : "Sinopse não disponível."
                }</p>
                
                <h3 class="modal-subtitle">Onde Assistir</h3>
                <div class="streaming-list">
                    ${
                      streamingServices
                        .map(
                          (service) => `
                        <a href="${service.url}" target="_blank" class="streaming-link">
                            <img src="${service.logo}" alt="${service.name}" class="streaming-logo">
                            <span>${service.name}</span>
                        </a>
                    `
                        )
                        .join("") ||
                      "<p>Não encontramos disponibilidade em serviços de streaming.</p>"
                    }
                </div>
            </div>
        </div>
    `;
  } catch (error) {
    console.error("Erro ao buscar detalhes do anime:", error);
    modalContent.innerHTML = `<div class="p-8 text-center text-red-400">Não foi possível carregar os detalhes. <button onclick="closeModal()" class="text-indigo-400 underline">Fechar</button></div>`;
  }
}

// --- Funções Auxiliares ---

function closeModal() {
  modal.classList.add("hidden");
  modalContent.innerHTML = "";
}

// (Sua função getStreamingServices original - cole ela aqui)
function getStreamingServices(animeTitle) {
  const services = [
    {
      name: "Netflix",
      logo: "https://img.icons8.com/color/48/000000/netflix.png",
      url: `https://www.netflix.com/search?q=${encodeURIComponent(animeTitle)}`,
    },
    {
      name: "Crunchyroll",
      logo: "https://img.icons8.com/color/48/000000/crunchyroll.png",
      url: `https://www.crunchyroll.com/search?q=${encodeURIComponent(
        animeTitle
      )}`,
    },
    {
      name: "Prime Video",
      logo: "https://img.icons8.com/color/48/000000/amazon-prime-video.png",
      url: `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(
        animeTitle
      )}&ie=UTF8`,
    },
  ];
  // Simula uma busca "aleatória" de quais serviços têm o anime
  const shuffled = services.sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 2) + 1; // Mostra 1 ou 2 serviços
  return shuffled.slice(0, count);
}

// --- Event Handlers ---

async function handleFilterClick(filterType) {
  if (
    currentFilter === filterType &&
    currentQuery === "" &&
    animeGrid.children.length > 0
  )
    return;

  currentFilter = filterType;
  currentQuery = "";
  searchInput.value = "";

  document.querySelectorAll("#filter-list button").forEach((btn) => {
    btn.classList.remove("filter-active");
    if (btn.dataset.filter === filterType) {
      btn.classList.add("filter-active");
    }
  });

  await loadAnimes(false); // Carga nova
}

// --- Event Listeners ---

let debounceTimer;
searchInput.addEventListener("input", (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const query = e.target.value.trim();

    if (query.length > 2) {
      currentQuery = query;
      currentFilter = ""; // Estamos em modo de busca
      document
        .querySelectorAll("#filter-list button")
        .forEach((btn) => btn.classList.remove("filter-active"));
      await loadAnimes(false); // Carga nova
    } else if (query.length === 0 && currentQuery !== "") {
      // Se limpou a busca, volta pro filtro padrão
      currentQuery = "";
      await handleFilterClick(currentFilter || "popular");
    }
  }, 500);
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

filterList.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (button && button.dataset.filter) {
    const filterType = button.dataset.filter;
    handleFilterClick(filterType);
  }
});

// --- Intersection Observer ---

function createObserver() {
  // Garante que os elementos existem antes de criar o observer
  if (!scrollTrigger) {
    console.error("Elemento 'scroll-trigger' não encontrado!");
    return;
  }

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5, // Aciona quando 50% do gatilho estiver visível
  };

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && !isLoading && hasMorePages) {
      loadAnimes(true); // Carrega mais (true = append)
    }
  }, options);

  observer.observe(scrollTrigger);
}

// --- Carga Inicial e Lógica de Login ---

// Usamos UM 'DOMContentLoaded' para organizar tudo
document.addEventListener("DOMContentLoaded", () => {
  // 1. Lógica de Login
  const userSection = document.getElementById("user-section");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Redireciona para login se não estiver logado E não estiver na página de auth
  if (!usuario && !window.location.pathname.endsWith("auth.html")) {
    // window.location.href = "auth.html"; // Descomente se quiser forçar o login
    // return; // Para a execução se for redirecionar
  }

  if (usuario) {
    // Usuário logado
    userSection.innerHTML = `
            <div class="user-info">
                <span>Olá, ${usuario.nome}</span>
                <button id="logout-btn" class="btn btn-primary">Sair</button>
            </div>
        `;
    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("usuario");
      location.reload();
    });
  } else {
    // Usuário deslogado (o HTML padrão já mostra Cadastrar/Login)
  }

  // 2. Lógica da Aplicação (só roda se tiver o grid na página)
  if (animeGrid) {
    handleFilterClick(currentFilter); // Carga inicial
    createObserver(); // Inicia o observador de scroll
  }
});
