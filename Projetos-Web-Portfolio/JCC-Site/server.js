// Importa o framework Express
// Ele facilita a criação de servidores e rotas HTTP
const express = require("express");

// Importa o módulo 'path'
// Usado para trabalhar com caminhos de arquivos de forma segura
const path = require("path");

// Importa o middleware CORS
// Permite que o frontend acesse o backend mesmo estando em domínios diferentes
const cors = require("cors");


// Cria a aplicação Express
const app = express();

// Habilita o uso do CORS para todas as requisições
app.use(cors());


// Middleware para permitir leitura de dados JSON no corpo das requisições
// Essencial para APIs REST
app.use(express.json());


// Middleware para servir arquivos estáticos
// Tudo que estiver na pasta "public" será acessível pelo navegador
app.use(express.static(path.join(__dirname, "public")));


// =========================
// INICIALIZAÇÃO DO SERVIDOR
// =========================

// Define a porta onde o servidor irá rodar
const PORT = 3000;

// Inicia o servidor e escuta requisições na porta definida
app.listen(PORT, () => {
  // Mensagem exibida no terminal quando o servidor estiver ativo
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
