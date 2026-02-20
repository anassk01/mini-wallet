const http = require("http");
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  const message = { text: "Bonjour" };
  res.end(JSON.stringify(message));
});

server.listen(3001, () => {
  console.log("serveur lance");
});
