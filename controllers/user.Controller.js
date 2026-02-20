const { users } = require("../data/db");

const getAllUsers = (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users));
};

const getUserById = (req, res, id) => {
  const selectedUser = users.find((f) => f.id === parseInt(id));
  if (!selectedUser) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "utilisateur inexistant " }));
    return;
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(selectedUser));
};

const createUser = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const data = JSON.parse(body);
    if (!data.nom) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "veuiller entrer un nom " }));
      return;
    }
    const newId =
      users.length === 0 ? 1 : Math.max(...users.map((u) => u.id)) + 1;

    const newUser = {
      nom: data.nom,
      id: newId,
    };
    users.push(newUser);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newUser));
  });
};

const modifyUser = (req, res, id) => {
  let selectedIndex = users.findIndex((i) => i.id === parseInt(id));
  if (selectedIndex === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end({ error: "utilisateur nest pas trouve" });
    return;
  }
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const data = JSON.parse(body);
    users[selectedIndex].nom = data.nom || users[selectedIndex].nom;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users[selectedIndex]));
  });
};

const deleteUser = (req, res, id) => {
  const selectedIndex = users.findIndex((i) => i.id === parseInt(id));

  if (selectedIndex === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "id utilisateur pas trouvee" }));
    return;
  }
  const deletedUser = users[selectedIndex];
  users.splice(selectedIndex, 1);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(deletedUser));
};

modeule.export = {
  getAllUsers,
  getUserById,
  createUser,
  modifyUser,
  deleteUser,
};
