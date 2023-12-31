const express = require("express");
const React = require("react");
const { renderToPipeableStream } = require("react-dom/server");
const App = require("./views/App");

const app = express();
const port = 3000;

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_req, res) => {
  const { pipe } = renderToPipeableStream(React.createElement(App.default), {
    // please switch to bootstrapModules if using "build-for-client-with-splitting" option
    // bootstrapModules: ["public/index.js"],
    bootstrapScripts: ["public/index.js"],
  });

  pipe(res);
});

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`),
);
