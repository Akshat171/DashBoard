import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";

//some installed from previous file
// const Jwt = require("jsonwebtoken");
// const jwtKey = "e-comm";

// data imports
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transaction.js";
import OverallStat from "./models/OverallStat.js";
import AffiliateStat from "./models/AffiliateStat.js";
import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from "./data/index.js";
/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

// Login & signup terms
app.post("/register", async (req, resp) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      resp.send({ result: "something went wrong, Please try again." });
    }
    resp.send({ result, auth: token });
  });
});

app.post("/login", async (req, resp) => {
  console.warn(req.body);
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          resp.send({ result: "something went wrong, Please try again." });
        }
        resp.send({ user, auth: token });
      });
    } else {
      resp.send({ result: "No user found" });
    }
  } else {
    resp.send({ result: "No User found" });
  }
});

/* MONGOOSE SETUP */
mongoose.set("strictQuery", false);
// const PORT = process.env.PORT || 9000;
// MONGO_URL =
//   "mongodb+srv://AkshatJangid:Akshatjangid@cluster0.zfrvqex.mongodb.net/?retryWrites=true&w=majority";
// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

//     /* ONLY ADD DATA ONE TIME */
//     // AffiliateStat.insertMany(dataAffiliateStat);
//     // OverallStat.insertMany(dataOverallStat);
//     User.insertMany(dataUser);
//     // Product.insertMany(dataProduct);
//     // ProductStat.insertMany(dataProductStat);
//     // Transaction.insertMany(dataTransaction);
//   })
//   .catch((error) => console.log(`${error} did not connect`));

const url =
  "mongodb+srv://AkshatJangid:Akshatjangid@cluster0.zfrvqex.mongodb.net/?retryWrites=true&w=majority";
async function connect() {
  try {
    await mongoose.connect(url);
    // Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // Transaction.insertMany(dataTransaction);
    // OverallStat.insertMany(dataOverallStat);
    // AffiliateStat.insertMany(dataAffiliateStat);
    // User.insertMany(dataUser);
    console.log("Connected to mongo db");
  } catch (error) {
    console.error(error);
  }
}

connect();

app.listen(5001, () => {
  console.log("Server started on port 5001");
});
