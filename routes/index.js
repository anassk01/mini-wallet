const userController = require("../controllers/user.Controller");
const walletController = require("../controllers/wallet.Controller");

module.exports = (req, res) => {
  const path = req.url;
  const method = req.method;

  if (path === "/users" && method === "GET") return userController.getAllUsers(req, res);
  if (path === "/users" && method === "POST") return userController.createUser(req, res);

  const userMatch = path.match(/^\/users\/(\d+)$/);
  if (userMatch) {
    const id = userMatch[1];
    if (method === "GET") return userController.getUserById(req, res, id);
    if (method === "PUT") return userController.modifyUser(req, res, id);
    if (method === "DELETE") return userController.deleteUser(req, res, id);
  }

  if (path === "/wallets" && method === "GET") return walletController.getAllWallets(req, res);
  if (path === "/wallets" && method === "POST") return walletController.createWallet(req, res);

  const walletMatch = path.match(/^\/wallets\/(\d+)$/);
  if (walletMatch) {
    const id = walletMatch[1];
    if (method === "GET") return walletController.getWalletById(req, res, id);
    if (method === "PUT") return walletController.modifyWallet(req, res, id);
    if (method === "DELETE") return walletController.deleteWallet(req, res, id);
  }

  const depositMatch = path.match(/^\/wallets\/(\d+)\/deposit$/);
  if (depositMatch && method === "POST") return walletController.deposit(req, res, depositMatch[1]);

  const withdrawMatch = path.match(/^\/wallets\/(\d+)\/withdraw$/);
  if (withdrawMatch && method === "POST") return walletController.withdraw(req, res, withdrawMatch[1]);

  const txMatch = path.match(/^\/wallets\/(\d+)\/transactions$/);
  if (txMatch && method === "GET") return walletController.getTransactions(req, res, txMatch[1]);

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "route non trouvee" }));
};
