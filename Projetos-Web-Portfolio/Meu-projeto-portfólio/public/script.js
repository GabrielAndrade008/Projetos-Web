function mostrarPagina(id) {
      // Oculta todas as seções e divs, exceto a barra de navegação (#links)
      document.querySelectorAll('main > section:not(#links), main > div').forEach(el => el.classList.add('hidden'));
      // Exibe a seção ou container selecionado
      const alvo = document.getElementById(id);
      if (alvo) {
        alvo.classList.remove('hidden');
        // Rola suavemente para o topo da página
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    function alternarTema() {
      document.body.classList.toggle('dark-mode');
    }