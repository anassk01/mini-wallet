const { wallets, users, transactions } = require("../data/db");
const fs = require("fs");

const save = () => {
  fs.writeFileSync("./data/data.json", JSON.stringify({ users, wallets, transactions }, null, 2));
};

const getAllWallets = (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(wallets));
};

const getWalletById = (req, res, id) => {
  const wallet = wallets.find((w) => w.id === parseInt(id));
  if (!wallet) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "portefeuille introuvable" }));
    return;
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(wallet));
};

const createWallet = (req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const data = JSON.parse(body);
    const user = users.find((u) => u.id === parseInt(data.user_id));
    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "utilisateur inexistant" }));
      return;
    }
    const newId = wallets.length === 0 ? 1 : Math.max(...wallets.map((w) => w.id)) + 1;
    const newWallet = { id: newId, user_id: parseInt(data.user_id), name: data.name, sold: 0 };
    wallets.push(newWallet);
    save();
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newWallet));
  });
};

const modifyWallet = (req, res, id) => {
  const index = wallets.findIndex((w) => w.id === parseInt(id));
  if (index === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "portefeuille introuvable" }));
    return;
  }
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const data = JSON.parse(body);
    wallets[index].name = data.name || wallets[index].name;
    save();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(wallets[index]));
  });
};

const deleteWallet = (req, res, id) => {
  const index = wallets.findIndex((w) => w.id === parseInt(id));
  if (index === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "portefeuille introuvable" }));
    return;
  }
  const deleted = wallets.splice(index, 1)[0];
  save();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(deleted));
};

const deposit = (req, res, id) => {
  const wallet = wallets.find((w) => w.id === parseInt(id));
  if (!wallet) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "portefeuille introuvable" }));
    return;
  }
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const data = JSON.parse(body);
    const amount = parseFloat(data.amount);
    if (!amount || amount <= 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "montant invalide" }));
      return;
    }
    wallet.sold += amount;
    transactions.push({ wallet_id: wallet.id, type: "depot", amount, date: new Date().toISOString() });
    save();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(wallet));
  });
};

const withdraw = (req, res, id) => {
  const wallet = wallets.find((w) => w.id === parseInt(id));
  if (!wallet) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "portefeuille introuvable" }));
    return;
  }
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const data = JSON.parse(body);
    const amount = parseFloat(data.amount);
    if (!amount || amount <= 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "montant invalide" }));
      return;
    }
    if (wallet.sold < amount) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "solde insuffisant" }));
      return;
    }
    wallet.sold -= amount;
    transactions.push({ wallet_id: wallet.id, type: "retrait", amount, date: new Date().toISOString() });
    save();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(wallet));
  });
};

const getTransactions = (req, res, id) => {
  const wallet = wallets.find((w) => w.id === parseInt(id));
  if (!wallet) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "portefeuille introuvable" }));
    return;
  }
  const result = transactions.filter((t) => t.wallet_id === parseInt(id));
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(result));
};

module.exports = { getAllWallets, getWalletById, createWallet, modifyWallet, deleteWallet, deposit, withdraw, getTransactions };
