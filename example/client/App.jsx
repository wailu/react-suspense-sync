import React, { Suspense } from "react";
import Dino from "./components/Dino";
import { SuspenseSync } from "../../index";

const App = () => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My app</title>
      </head>
      <body>
        <SuspenseSync>
          <Suspense fallback="loading dino...">
            <Dino />
          </Suspense>
        </SuspenseSync>
      </body>
    </html>
  );
};

export default App;
