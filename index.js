const express = require("express");

const app = express();  
const users = require("./MOCK_DATA.json");
const status = require("express-status-monitor");

const { escape } = require("querystring");
const path = require("path");


const userRouter = require("./Routes/user");


const {logReqRes } = require("./middlewares/index");


const { connectMongoDb } = require("./connection");


//  Connection 

connectMongoDb("mongodb://localhost:27017/shubhamPractice")
  .then(() =>console.log("Mongo Connectend"));



app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  return res.render("homepage");
});





// ---------------- Middleware --------------
app.use(express.urlencoded({ extended: false }));
app.use(status());
app.use(logReqRes("log.txt"));

// ------------- Routes ---------------------

const sendMail = require("./sendMail");
app.get("/mail", sendMail);


app.use("/user", userRouter);


app.listen(8080, () => {
  console.log("Server started");
});
