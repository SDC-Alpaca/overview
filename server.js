const express = require("express");
const postgres = require("postgres");
const db = require('./database')
const router = require('./routes.js');
const app = express();
const port = 3000;

app.use(express.json());
app.use("/products", router)

app.get('/', (req, res) => {
  res.send("HELLO!")
})

app.listen(port, () => {
  console.log('Server is running at http://localhost:' + port);
});