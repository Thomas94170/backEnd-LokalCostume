const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mailchimpRoutes = require("../newsletter/mailchimp");
const port = 5400;

//connxion a la bdd!
connectDB();

const app = express();
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
  credentials: true,
  preflightContinue: false,
};

app.options("*", cors(corsOptions));

app.use(cors(corsOptions));
//middleware permettant de traiter les données de la request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/costume", require("./routes/costume.routes"));
app.use("/gallerie", require("./routes/gallerie.routes"));
app.use("/user", require("./routes/user.routes"));
app.use("/order", require("./routes/order.routes"));
app.use("/mail", require("../backend/mailer/mailer.js"));
app.use("/admin", require("./routes/admin.routes"));
app.use("/uploads", require("./routes/uploads.routes"));
app.use("/mailchimp", mailchimpRoutes);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    next(err);
  }
});

//lancer le serveur
app.listen(port, () => console.log("serveur démarré : port" + port));
