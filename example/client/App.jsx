import React, { Suspense } from "react";
import PropTypes from "prop-types";
import Cat from "./components/Cat";
import InjectState from "./components/InjectState";
import { SuspenseSync } from "../../index";

export const WINDOW_INITIAL_STATE_KEY = "__APP_INITIAL_STATE__";

const App = ({ initialState }) => {
  const { asyncData } = initialState;

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My app</title>
      </head>
      <body>
        <SuspenseSync asyncData={asyncData}>
          <div>Hello</div>
          <Suspense fallback="loading cat...">
            <Cat />
          </Suspense>
        </SuspenseSync>
        <InjectState name={WINDOW_INITIAL_STATE_KEY} state={initialState} />
      </body>
    </html>
  );
};

App.propTypes = {
  initialState: PropTypes.shape({
    asyncData: PropTypes.object.isRequired,
  }),
};

export default App;
