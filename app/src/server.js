const app = require("./app");

const port = Number.parseInt(process.env.PORT || "3001", 10);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

