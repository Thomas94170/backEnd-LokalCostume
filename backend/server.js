const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const cors = require("cors");
const port = 5400;

//connxion a la bdd!
connectDB();

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
//middleware permettant de traiter les données de la request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/costume", require("./routes/costume.routes"));
app.use("/gallerie", require("./routes/gallerie.routes"));
app.use("/user", require("./routes/user.routes"));
app.use("/order", require("./routes/order.routes"));

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    next(err);
  }
});

//lancer le serveur
app.listen(port, () => console.log("serveur démarré : port" + port));
