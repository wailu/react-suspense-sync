import React, { Suspense } from "react";
import Cat from "../components/Cat";
import Duck from "../components/Duck";
import { SuspenseSync } from "../../../index";

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
          <Suspense fallback="loading cat...">
            <Cat />
          </Suspense>
          <Duck />
        </SuspenseSync>
      </body>
    </html>
  );
};

export default App;
