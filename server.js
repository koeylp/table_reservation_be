const app = require("./app");
require("dotenv").config();
const PORT = process.env.PORT || 7070;
app.listen(PORT, function () {
  console.log("Server is running on port " + PORT);
});
