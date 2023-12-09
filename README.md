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

### 1. Wrap with `<SuspenseSync>`
```
import { SuspenseSync } from "react-suspense-sync";
// ...

const App = ({ asyncData }) => {
  return (
    <html>
      <head>
        ...
      </head>
      <body>
        {/* wrap with SuspenseSync; pass asyncData to SuspenseSync */}
        <SuspenseSync asyncData={asyncData}>
          <Suspense fallback="loading cat... (the promise takes 2s to resolve on the server)">
            <Cat />
          </Suspense>
        </SuspenseSync>
      </body>
    </html>
  );
};

export default App;
```

### 2. Use the `useSuspenseSync` hook in components dependent on the data
```
import { useSuspenseSync } from "react-suspense-sync";
// ...

const Cat = () => {
  const data = useSuspenseSync("mockFetchCatData");

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

### 3. Initiate data fetching on the server and pass promises to your App

> Note: `renderToString` does not support streaming or waiting for data; you'll need to use an appropriate [streaming method](https://react.dev/reference/react-dom/server/renderToString#migrating-from-rendertostring-to-a-streaming-method-on-the-server) on the server

On the server (learn more from the [official react docs](https://react.dev/reference/react-dom/server/renderToPipeableStream#rendering-a-react-tree-as-html-to-a-nodejs-stream)):
```
app.get("/", (_req, res) => {
  // choose your own data fetching strategy here
  // have it return a promise that resolves to the data
  // notice that we are not awaiting the promise
  const mockFetchCatData = new Promise((resolve) => {
    setTimeout(() => {
      resolve("The cat jumps over the lazy cow");
    }, 2000);
  });

  // pass promise(s) to App via the asyncData prop (only required on the server)
  const { pipe } = renderToPipeableStream(
    React.createElement(App.default, {
      asyncData: { mockFetchCatData },
    }),
    {
      // add the script that hydrates the server-generated HTML
      bootstrapScripts: ["public/bundle.js"],
    },
  );

  pipe(res);
});
```

And how your hydration script should approximately look like:

```
import React from "react";
import { hydrateRoot } from "react-dom/client";

import App from "./App";

// note that you do not need to pass asyncData here!
hydrateRoot(document, <App />);
```

## Running the example app
1. Clone this repository

```
git clone git@github.com:wailu/react-syspense-sync.git
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

## TODO

1. Implement error handling when promise rejects using error boundaries.
2. Short writeup on how it works
