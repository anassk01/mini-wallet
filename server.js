const http = require("http");
const router = require("./routes/index");

const server = http.createServer(router);

server.listen(3001, () => {
  console.log("serveur lance sur le port 3001");
});
