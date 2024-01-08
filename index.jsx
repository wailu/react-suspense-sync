import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  Suspense,
} from "react";
import { PropTypes } from "prop-types";
import { wrap, setUpForReceive } from "./utils/wrap";
import {
  WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY,
  WINDOW_SUSPENSE_SYNC_DATA_KEY,
} from "./constants";

const SuspenseSyncContext = createContext([]);

const fetches = [];

export function createSuspenseSyncHook(fetch) {
  // register fetch
  // when registered on server side fetch will be made on server side
  // note that on server side only the initial render matters
  // that means that if the initial render did not import the component due to code spliting,
  // the fetch call will not be made on server side
  const i = fetches.length;
  fetches.push(fetch);

  if (typeof window !== "undefined") {
    let p = undefined;

    return () => {
      // client side hook
      // promises[i] might be undefined if the initial render did not import the component using the hook
      // in this case, this means that the fetch call needs to be made on the client side
      const promises = useContext(SuspenseSyncContext);
      p = p ?? promises[i];

      if (!p) p = wrap(fetch());
      if (p.status === "pending") throw p;
      if (p.status === "completed") return p.data;
    };
  }

  return () => {
    // server side hook
    // promises[i] is guaranteed here to exist
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
  // on server side all api calls are fired
  // on client side the mechanism is set up to receive data when api calls resolve
  const promises = useMemo(
    () =>
      fetches.map((f) => {
        if (typeof window === "undefined") return wrap(f());
        else return setUpForReceive();
      }),
    [],
  );

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
