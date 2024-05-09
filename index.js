const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const contacts = require("./routes/contact.js");
const users = require("./routes/users.js");
const { sendEmail } = require("./utils/sendEmail");
const { verifyEmail } = require("./utils/verifyEmail");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.json({ limit: "35mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "35mb",
    parameterLimit: 50000,
  })
);
app.use(cors())

app.use("/api/contact", contacts);
app.use("/api/user", users);
app.use("/api/send-email", sendEmail);
app.use("/api/verify-email", verifyEmail);

db.sequelize
  .sync()
  .then((e) => console.log("Database connected"))
  .catch((error) => console.log("Database connection failed: ", error));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
