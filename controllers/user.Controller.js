const { users, wallets, transactions } = require("../data/db");
const fs = require("fs");

const save = () => {
  fs.writeFileSync("./data/data.json", JSON.stringify({ users, wallets, transactions }, null, 2));
};

const getAllUsers = (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users));
};

const getUserById = (req, res, id) => {
  const user = users.find((u) => u.id === parseInt(id));
  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "utilisateur inexistant" }));
    return;
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));
};

const createUser = (req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const data = JSON.parse(body);
    if (!data.name) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "nom requis" }));
      return;
    }
    const newId = users.length === 0 ? 1 : Math.max(...users.map((u) => u.id)) + 1;
    const newUser = { id: newId, name: data.name };
    users.push(newUser);
    save();
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newUser));
  });
};

const modifyUser = (req, res, id) => {
  const index = users.findIndex((u) => u.id === parseInt(id));
  if (index === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "utilisateur inexistant" }));
    return;
  }
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const data = JSON.parse(body);
    users[index].name = data.name || users[index].name;
    save();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users[index]));
  });
};

const deleteUser = (req, res, id) => {
  const index = users.findIndex((u) => u.id === parseInt(id));
  if (index === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "utilisateur inexistant" }));
    return;
  }
  const deleted = users.splice(index, 1)[0];
  save();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(deleted));
};

module.exports = { getAllUsers, getUserById, createUser, modifyUser, deleteUser };
