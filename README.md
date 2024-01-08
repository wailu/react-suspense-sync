# React Suspense Sync

Fetch data on server and sync it to the client using Suspense.

```
npm install react-suspense-sync
```

## Background

For a deep dive into the topic, you can refer to this [discussion](https://github.com/reactwg/react-18/discussions/37). The following is only a brief introduction.

Server-side rendering (SSR) allows you to generate HTML from React components on the server, to be sent to the client. In React, SSR always happens in several steps:

1. On the server, fetch data for the entire app.
2. On the server, render the entire app to HTML and send it in the response.
3. On the client, load the JavaScript code for the entire app.
4. On the client, hydrate the server-rendered HTML for the entire app.

In the past however, this is done in a waterfall approach; each step had to finish before the next step is initiated. This is not efficient when some parts of your app are slower than others (which is most often the case).

In React 18, `<Suspense>` enables developers to break down their apps into smaller independent units, in which these units will go through each steps independently from each other. The result is that parts of your app that are ready earlier can be made available to your users sooner.

What this means essentially is that we can start fetching data on the server, but do not need to wait for the fetching of data to complete before starting to stream to the client. On the client, React will render the fallback in place of the component while the data is not yet available.

However, one caveat is that the data fetching solution needs to be integrated with Suspense for this to work correctly. Currently, outside of the big frameworks like [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense) and [Remix](https://remix.run/docs/en/main/guides/streaming), this suspense streaming feature has no widespread or mainstream support yet.

## Usage

React Suspense Sync provides a simple solution for your SSR react app to **fetch data on server and sync it to the client later on**, enabling you to start streaming HTML earlier to the client.

### 1. Use `createSuspenseSyncHook` to create the hook to be used in your component

```
import { createSuspenseSyncHook } from "react-suspense-sync";

const fetchCatData = () => {
  // do data fetching here, and return a promise that resolves to your data
  return promise;
}

export const useSuspenseSyncCat = createSuspenseSyncHook(fetchCatData);
```

### 2. Use the created hook in your component

```
import { useSuspenseSyncCat } from "./hooks";

const Cat = () => {
  const data = useSuspenseSyncCat();

  useEffect(() => {
    console.log("Cat mounted~");
  }, []);

  return (
    <div style={{ border: "1px solid black", margin: "4px 0", padding: 4 }}>
      <div>This is the cat component</div>
      <p>{data}</p>
    </div>
  );
};

export default Cat;
```

### 3. Use your component within `<SuspenseSync>`

```
import { SuspenseSync } from "react-suspense-sync";
// ...

const App = () => {
  return (
    <html>
      <head>
        ...
      </head>
      <body>
        {/* wrap with SuspenseSync */}
        <SuspenseSync>
          <Suspense fallback="loading cat...">
            <Cat />
          </Suspense>
        </SuspenseSync>
      </body>
    </html>
  );
};

export default App;
```

### 4. Use in SSR

> Note: `renderToString` does not support streaming or waiting for data; you'll need to use an appropriate [streaming method](https://react.dev/reference/react-dom/server/renderToString#migrating-from-rendertostring-to-a-streaming-method-on-the-server) on the server

On the server (learn more from the [official react docs](https://react.dev/reference/react-dom/server/renderToPipeableStream#rendering-a-react-tree-as-html-to-a-nodejs-stream)):

```
app.get("/", (_req, res) => {
  const { pipe } = renderToPipeableStream(
    React.createElement(App.default),
    {
      // add the script that hydrates the server-generated HTML
      bootstrapScripts: ["public/bundle.js"],
    },
  );

  pipe(res);
});
```

Your hydration script should approximately look like:

```
import React from "react";
import { hydrateRoot } from "react-dom/client";

import App from "./App";

hydrateRoot(document, <App />);
```

## Running the example app

1. Clone this repository

```
git clone git@github.com:wailu/react-suspense-sync.git
```

2. Install dependencies

```
cd react-suspense-sync && npm i
cd example && npm i
```

3. Start the app

```
npm run start
```

This will automatically build the app and start the server.

4. Go to http://localhost:3000/

https://github.com/wailu/react-syspense-sync/assets/42461097/820ecbb6-7165-49c8-a073-c4570efa9c8e

5. (bonus) Try with es-build code-splitting

Change the `"build"` field in `package.json`:

```
{
  // ...
  scripts: {
    // ...
    "build": "npm run build-for-server && npm run build-for-client-with-splitting",
    // ...
  }
}
```

And switch to use `bootstrapModules` instead:

```
app.get("/", (_req, res) => {
  const { pipe } = renderToPipeableStream(React.createElement(App.default), {
    bootstrapModules: ["public/index.js"],
  });

  pipe(res);
});
```

## TODO

1. Implement error handling when promise rejects using error boundaries.
2. Short writeup on how it works
