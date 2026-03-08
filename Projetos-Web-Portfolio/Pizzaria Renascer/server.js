// Importação das bibliotecas necessárias
const express = require("express"); // Framework para criação do servidor
const path = require("path"); // Biblioteca nativa do Node para manipular caminhos
const cors = require("cors"); // Permite requisições de diferentes origens (Cross-Origin)

// Inicializa o aplicativo Express
const app = express();

// ============================
// CONFIGURAÇÕES DO SERVIDOR
// ============================

// Permite que o servidor aceite requisições externas (útil para APIs futuramente)
app.use(cors());

// Permite que o backend leia dados em formato JSON
app.use(express.json());

// Define a pasta "public" como pasta de arquivos estáticos
// Ou seja: HTML, CSS, JS e imagens serão servidos automaticamente
app.use(express.static(path.join(__dirname, "public")));


// ============================
// ROTAS
// ============================

// Rota principal do site
// Quando alguém acessar http://localhost:3000
// o servidor enviará o arquivo index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ============================
// INICIAR SERVIDOR
// ============================

// Define a porta do servidor
const PORT = 3000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});