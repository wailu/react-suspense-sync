import React, { createContext, useContext, useState, Suspense } from "react";
import { PropTypes } from "prop-types";
import { wrap } from "./utils/wrap";
import {
  WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY,
  WINDOW_SUSPENSE_SYNC_DATA_KEY,
} from "./constants";

const SuspenseSyncContext = createContext([]);

const fetchs = [];

export function createSuspenseSyncHook(f) {
  const i = fetchs.length;
  // register fetch
  fetchs.push(f);

  return () => {
    const promises = useContext(SuspenseSyncContext);
    const p = promises[i];

    if (p.status === "pending") throw p;
    if (p.status === "completed") return p.data;
  };
}

function InitScript() {
  const __html = `
    window['${WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY}'] = [];
    window['${WINDOW_SUSPENSE_SYNC_DATA_KEY}'] = [];
  `.replace(/^\s+|\s+$/gm, "");

  return <script dangerouslySetInnerHTML={{ __html }}></script>;
}

function SuspenseSyncScript({ index }) {
  const promises = useContext(SuspenseSyncContext);
  const p = promises[index];

  if (p.status !== "completed") throw p;

  const data = JSON.stringify(p.data);
  // callback might not be in place yet if hydration has not occured
  // we save the data to window and we attempt to call the callback
  const __html = `
    window['${WINDOW_SUSPENSE_SYNC_DATA_KEY}'][${index}] = ${data};
    if (window['${WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY}'][${index}])
      window['${WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY}'][${index}](${data});
  `.replace(/^\s+|\s+$/gm, "");

  return <script dangerouslySetInnerHTML={{ __html }}></script>;
}

SuspenseSyncScript.propTypes = {
  index: PropTypes.number,
};

export function SuspenseSync({ children }) {
  // note: we expect the function passed to useState to only execute once
  // this makes it that we only call f once
  const [promises] = useState(() => fetchs.map((f) => wrap(f)));

  return (
    <SuspenseSyncContext.Provider value={promises}>
      {children}
      <InitScript />
      {[...promises.keys()].map((i) => (
        <Suspense key={i}>
          <SuspenseSyncScript index={i} />
        </Suspense>
      ))}
    </SuspenseSyncContext.Provider>
  );
}

SuspenseSync.propTypes = {
  children: PropTypes.node,
};
