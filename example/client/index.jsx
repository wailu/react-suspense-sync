import React, { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import App, { WINDOW_INITIAL_STATE_KEY } from "./App";

hydrateRoot(
  document,
  <StrictMode>
    <App initialState={window[WINDOW_INITIAL_STATE_KEY]} />
  </StrictMode>,
);
