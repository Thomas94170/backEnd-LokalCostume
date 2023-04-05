const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const cors = require("cors");
const port = 5500;

//connxion a la bdd
connectDB();

const app = express();
app.use(cors());
//middleware permettant de traiter les données de la request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/costume", require("./routes/costume.routes"));

//lancer le serveur
app.listen(port, () => console.log("serveur démarré : port" + port));
