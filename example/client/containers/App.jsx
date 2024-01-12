import React, { useState, lazy, Suspense } from "react";
import Cat from "../components/Cat";
import Duck from "../components/Duck";
import { SuspenseSync } from "../../../index";

const Dino = lazy(() => import("../components/Dino"));

const App = () => {
  const [flag, setFlag] = useState(true);

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
          <button onClick={() => setFlag((flag) => !flag)}>click me!</button>
          {flag ? (
            <Suspense>
              <Dino />
            </Suspense>
          ) : null}
        </SuspenseSync>
      </body>
    </html>
  );
};

export default App;
