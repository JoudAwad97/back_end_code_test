const app = require("./app");

// remove the CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, language, timezone"
  );
  next();
});

// define FILE SCOPE VARIABLES
const port = process.env.PORT || 3000;

// start the application on the spicificed PORT
app.listen(port);
