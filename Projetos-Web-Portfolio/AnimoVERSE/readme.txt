AnimoVERSE — Instruções de instalação e uso (README.txt)

Pré-requisitos

* Node.js instalado (v14+ recomendado).
* Todos os arquivos do projeto presentes na sua máquina: `HTML`, `CSS`, `JS`, arquivo de banco de dados (animoverse.db), `node_modules (package.json, package-lock.json) ` e arquivos do backend (por exemplo `server.js`).

---

Como rodar o projeto localmente

1. Coloque a pasta do projeto em uma pasta de sua preferência e abra-a no VS Code.
2. Abra um terminal/prompt de comando no VS Code (ou use o terminal do sistema).
3. No terminal, navegue até a pasta raiz do projeto:

   ```
   cd /caminho/para/a/pasta-do-projeto
   ```
4. Inicie o servidor:

   ```
   node server.js 
   ```
5. Se o servidor iniciar com sucesso, ele estará escutando na porta **3000**.
   Abra no navegador o endereço:

   ```
   http://localhost:3000
   ```

---

Usando o site

1. No site, clique em **Entrar** (canto superior direito).
2. Para se cadastrar: preencha os campos do formulário de registro conforme solicitado (nome, e-mail, senha etc.) e envie.
3. Para acessar com uma conta existente: use o formulário de login com e-mail/usuário e senha.
4. Quando o cadastro ou login for realizado com sucesso, você poderá usar o site normalmente.

---

Observações e dicas rápidas

* Se faltar `node_modules`, execute `npm install` antes de `node server.js`.
* Caso o servidor não suba, verifique no terminal mensagens de erro (porta em uso, dependências faltando, erro no arquivo `server.js`).
* Se a porta 3000 já estiver ocupada, edite o arquivo `server.js` para alterar a porta ou finalize o processo que está usando a porta.
* Se o site utiliza um banco (SQLite, por exemplo), confirme se o arquivo de banco está no local esperado e com permissões de leitura/escrita.

---

Contato / Suporte

Se encontrar problemas que não consiga resolver, envie os logs de erro do terminal e a versão do Node.js instalada para que possamos ajudar.
