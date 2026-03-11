// Função responsável por mostrar uma seção específica do site
// Recebe como parâmetro o ID da seção que deve ser exibida
function mostrarSecao(id) {

  // Seleciona todas as seções dentro da tag <main>
  const secoes = document.querySelectorAll('main section');

  // Percorre todas as seções encontradas
  secoes.forEach(secao => {
    // Remove a classe 'active' de todas
    // Isso garante que apenas uma seção fique visível por vez
    secao.classList.remove('active');
  });

  // Busca no DOM a seção cujo ID foi passado como argumento
  const secaoSelecionada = document.getElementById(id);

  // Verifica se a seção realmente existe
  if (secaoSelecionada) {

    // Adiciona a classe 'active' à seção selecionada
    // Faz com que ela seja exibida (via CSS)
    secaoSelecionada.classList.add('active');

    // Faz a rolagem suave até a seção exibida
    // Melhora a experiência do usuário
    secaoSelecionada.scrollIntoView({ behavior: 'smooth' });
  }
}


// Exibe um alerta ao carregar o site
// Informa ao usuário que o site passa por atualizações esporádicas
alert("Este site está recorrente à sofrer atualizações raramente. " + "Por favor, verifique regularmente para obter as informações mais recentes.");


function carregouPagina() {
  console.log("Página carregada com sucesso!");
}