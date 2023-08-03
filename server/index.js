const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
var path = require("path");

const router = require("./routes/route");

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
/** api routes */
app.use('/api', router)

app.get("/", async (req, res) => {

    res.json("hello this is backend! home from backend server.");
  });
  
  
  app.listen(process.env.PORT,()=>{
    console.log('server started in port : ',process.env.PORT)
  })