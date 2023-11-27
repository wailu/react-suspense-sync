import {
  WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY,
  WINDOW_SUSPENSE_SYNC_DATA_KEY,
} from "../../constants";

export const wrap = (promise) => {
  const wrapped = {
    data: undefined,
    completed: false,
    then: promise.then.bind(promise),
  };
  wrapped.then((value) => {
    wrapped.data = value;
    wrapped.completed = true;
  });

  return wrapped;
};

export const wrapClientSideAsyncData = (asyncData) => {
  return Object.entries(asyncData).reduce((acc, [name]) => {
    acc[name] = wrap(
      new Promise((resolve) => {
        window[WINDOW_SUSPENSE_SYNC_CALLBACKS_KEY][name] = (data) =>
          resolve(data);
        if (window[WINDOW_SUSPENSE_SYNC_DATA_KEY][name]) {
          // data streamed in before hydration, so we resolve proactively here
          resolve(window[WINDOW_SUSPENSE_SYNC_DATA_KEY][name]);
        }
      }),
    );
    return acc;
  }, {});
};

export const wrapServerSideAsyncData = (asyncData) => {
  return Object.entries(asyncData).reduce((acc, [name, promise]) => {
    acc[name] = wrap(promise);
    return acc;
  }, {});
};
