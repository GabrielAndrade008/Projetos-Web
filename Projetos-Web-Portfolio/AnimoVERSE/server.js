// server.js
import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Servir os arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// === Conexão com o banco SQLite ===
const dbPath = path.join(__dirname, "animoverse.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(" Erro ao abrir o banco:", err.message);
  } else {
    console.log(" Banco de dados conectado:", dbPath);
  }
});

// === Criação da tabela de usuários (se não existir) ===
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
  )
`, (err) => {
  if (err) console.error("Erro ao criar tabela:", err.message);
  else console.log(" Tabela 'usuarios' verificada/criada.");
});

// === Rota principal ===
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// === Rota de cadastro ===
app.post("/cadastro", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos!" });
  }

  const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
  db.run(sql, [nome, email, senha], function (err) {
    if (err) {
      console.error(" Erro ao cadastrar:", err.message);
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ erro: "Este email já está cadastrado." });
      }
      return res.status(500).json({ erro: "Erro interno ao cadastrar usuário." });
    }

    console.log(` Usuário cadastrado (ID: ${this.lastID})`);
    return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
  });
});

// === Rota de login ===
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Informe email e senha!" });
  }

  const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
  db.get(sql, [email, senha], (err, usuario) => {
    if (err) {
      console.error(" Erro no login:", err.message);
      return res.status(500).json({ erro: "Erro interno no servidor." });
    }

    if (!usuario) {
      return res.status(401).json({ erro: "Email ou senha incorretos!" });
    }

    console.log(` Login bem-sucedido: ${usuario.email}`);

    res.json({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  });
});

// === Inicializa o servidor ===
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Servidor rodando em http://localhost:${PORT}`);
});