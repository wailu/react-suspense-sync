import React, { createContext, useContext, Suspense } from "react";
import { PropTypes } from "prop-types";
import { wrapClientSideAsyncData, wrapServerSideAsyncData } from "./utils/wrap";
import {
  WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY,
  WINDOW_SUSPENSE_SYNC_DATA_KEY,
  WINDOW_SUSPENSE_SYNC_FUNC_KEY,
} from "./constants";

const SuspenseSyncContext = createContext({});

export const useSuspenseSync = (name) => {
  const asyncData = useContext(SuspenseSyncContext);
  const p = asyncData[name];

  if (!p) throw Error("No matching suspense resource!");
  if (!p.completed) throw p;

  return p.data;
};

export const SuspenseSync = ({ children, asyncData }) => {
  const wrappedAsyncData = (
    typeof window === "undefined"
      ? wrapServerSideAsyncData
      : wrapClientSideAsyncData
  )(asyncData);

  const __html = `
  window['${WINDOW_SUSPENSE_SYNC_DATA_KEY}'] = {};
  window['${WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY}'] = {};
  window['${WINDOW_SUSPENSE_SYNC_FUNC_KEY}'] = function (name, data) {
    window['${WINDOW_SUSPENSE_SYNC_DATA_KEY}'][name] = data;
    const cb = window['${WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY}'][name];
    if (cb) cb(data);
  }
  `.replace(/^\s+/gm, "");

  const init = <script dangerouslySetInnerHTML={{ __html }} />;

  return (
    <SuspenseSyncContext.Provider asyncData={wrappedAsyncData}>
      {children}
      {init}
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
  asyncData: PropTypes.object.isRequired,
};

const SuspenseSyncScript = ({ name }) => {
  const data = useSuspenseSync(name);
  const __html = `
  window['${WINDOW_SUSPENSE_SYNC_FUNC_KEY}'](${JSON.stringify(data)});
  `.replace(/^\s+/gm, "");

  return <script dangerouslySetInnerHTML={{ __html }} />;
};

SuspenseSyncScript.propTypes = {
  name: PropTypes.string.isRequired,
};
