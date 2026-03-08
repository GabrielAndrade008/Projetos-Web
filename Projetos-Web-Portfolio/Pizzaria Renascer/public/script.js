// Função para mostrar apenas a seção selecionada
function mostrarSecao(id) {
  const secoes = document.querySelectorAll("main section");

  secoes.forEach(secao => {
    secao.classList.remove("active");
  });

  const secaoSelecionada = document.getElementById(id);
  if (secaoSelecionada) {
    secaoSelecionada.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Ativar navegação do menu
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", function (e) {
    const id = this.getAttribute("href").replace("#", "");
    if (document.getElementById(id)) {
      e.preventDefault();
      mostrarSecao(id);
    }
  });
});

// Define a seção inicial ao carregar a página
window.addEventListener("load", () => {
  mostrarSecao("home");
});
