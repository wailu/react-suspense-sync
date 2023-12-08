import React, { createContext, useContext, Suspense } from "react";
import { PropTypes } from "prop-types";
import { wrapClientSideAsyncData, wrapServerSideAsyncData } from "./utils/wrap";
import {
  WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY,
  WINDOW_SUSPENSE_SYNC_DATA_KEY,
  WINDOW_SUSPENSE_SYNC_FOR_CLIENT_WRAP_KEY,
} from "./constants";

const SuspenseSyncContext = createContext({});

export const useSuspenseSync = (name) => {
  const asyncData = useContext(SuspenseSyncContext);
  const p = asyncData[name];

  if (!p) throw Error("No matching suspense resource!");
  if (!p.completed) throw p;

  return p.data;
};

const InitScriptOne = () => {
  const __html = `
  window['${WINDOW_SUSPENSE_SYNC_DATA_KEY}'] = {};
  window['${WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY}'] = {};
  `.replace(/^\s+/gm, "");

  return <script dangerouslySetInnerHTML={{ __html }} />;
};

const InitScriptTwo = ({ asyncData }) => {
  // on the client side, asyncData is not passed as prop
  // server instead sends a script that initialises it
  if (typeof window !== "undefined") {
    return (
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: "" }}
      />
    );
  }

  const __html = `
    window['${WINDOW_SUSPENSE_SYNC_FOR_CLIENT_WRAP_KEY}'] = ${JSON.stringify(
      asyncData,
    )};
  `.replace(/^\s+/gm, "");

  return <script dangerouslySetInnerHTML={{ __html }} />;
};

InitScriptTwo.propTypes = {
  asyncData: PropTypes.object,
};

export const SuspenseSync = ({ children, asyncData }) => {
  const wrappedAsyncData =
    typeof window === "undefined"
      ? wrapServerSideAsyncData(asyncData)
      : wrapClientSideAsyncData(
          window[WINDOW_SUSPENSE_SYNC_FOR_CLIENT_WRAP_KEY],
        );

  return (
    <SuspenseSyncContext.Provider value={wrappedAsyncData}>
      {children}
      <InitScriptOne />
      <InitScriptTwo asyncData={asyncData} />
      {Object.keys(wrappedAsyncData).map((name) => (
        <Suspense key={name}>
          <SuspenseSyncScript name={name} />
        </Suspense>
      ))}
    </SuspenseSyncContext.Provider>
  );
};

SuspenseSync.propTypes = {
  children: PropTypes.node,
  asyncData: PropTypes.object,
};

const SuspenseSyncScript = ({ name }) => {
  const data = useSuspenseSync(name);
  const __html = `
  (() => {
    window['${WINDOW_SUSPENSE_SYNC_DATA_KEY}'][name] = ${JSON.stringify(data)};
    const cb = window['${WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY}'][name];
    if (cb) cb(data);
  })();
  `.replace(/^\s+/gm, "");

  return <script dangerouslySetInnerHTML={{ __html }} />;
};

SuspenseSyncScript.propTypes = {
  name: PropTypes.string.isRequired,
};
