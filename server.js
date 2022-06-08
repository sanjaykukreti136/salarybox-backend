const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRouter = require("./Router/authRouter");
const dataRouter = require("./Router/dataRouter");
const app = express();
app.use(express.json());
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/data", dataRouter);
app.listen(process.env.PORT || 3000, function () {
  console.log("server started");
});
app.use(function (req, res) {
  res.status(404).json({
    message: "page Not found",
  });
});
