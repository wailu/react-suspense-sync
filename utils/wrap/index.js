import {
  WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY,
  WINDOW_SUSPENSE_SYNC_DATA_KEY,
} from "../../constants";

export function wrap(promise) {
  const wrapped = {
    data: undefined,
    error: undefined,
    status: "pending",
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
  };
  wrapped.then((value) => {
    wrapped.data = value;
    wrapped.status = "completed";
  });
  // TODO: handle catch properly
  wrapped.catch((e) => {
    wrapped.error = e;
    wrapped.status = "error";
  });

  return wrapped;
}

export function setUpForReceive() {
  // the below code runs on CLIENT
  // sets up a callback in window
  // also check to see if data has been delivered before hydration
  return wrap(
    new Promise((resolve) => {
      const index = window[WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY].length;
      window[WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY][index] = resolve;
      if (window[WINDOW_SUSPENSE_SYNC_DATA_KEY][index])
        resolve(window[WINDOW_SUSPENSE_SYNC_DATA_KEY][index]);
    }),
  );
}
