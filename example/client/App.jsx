import React, { Suspense } from "react";
import { PropTypes } from "prop-types";
import Cat from "./components/Cat";
import Duck from "./components/Duck";
import { SuspenseSync } from "../../index";

export const WINDOW_INITIAL_STATE_KEY = "__APP_INITIAL_STATE__";

const App = ({ asyncData }) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My app</title>
      </head>
      <body>
        {/* pass asyncData to SuspenseSync */}
        <SuspenseSync asyncData={asyncData}>
          <div>Hello</div>
          <Suspense fallback="loading cat... (the promise takes 2s to resolve on the server)">
            <Cat />
          </Suspense>
          <Duck />
        </SuspenseSync>
      </body>
    </html>
  );
};

App.propTypes = {
  asyncData: PropTypes.object,
};

export default App;
