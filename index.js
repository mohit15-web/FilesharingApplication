const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./utils/dbConnect");
const cors = require("cors");
const router = require("./routes/file");
const errorHandlingMiddleWere = require("./middlewares/error");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());

app.use(router);

dbConnect();
app.use(errorHandlingMiddleWere);
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
