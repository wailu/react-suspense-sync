# React Suspense Sync

Fetch data on server and sync it to the client using Suspense.

## Background

For a deep dive into the topic, you can refer to this [discussion](https://github.com/reactwg/react-18/discussions/37). The following is a brief introduction to the technology/technique.

Server-side rendering (SSR) allows you to generate HTML from React components on the server, to be sent to the client. In React, SSR always happens in several steps:

1. On the server, fetch data for the entire app.
2. On the server, render the entire app to HTML and send it in the response.
3. On the client, load the JavaScript code for the entire app.
4. On the client, hydrate the server-rendered HTML for the entire app.

In the past however, this is done in a waterfall approach; each step had to finish before the next step is initiated. This is not efficient when some parts of your app are slower than others.

In React 18, `<Suspense>` enables developers to break down their apps into smaller independent units, in which these units will go through each steps independently from each other. The result is that parts of your app that are ready earlier can be made available to your users sooner.

What this means essentially is that we can start the fetch on the server but do not need to wait for our data to be ready before starting to stream to the client. On the client, React will render the fallback in place of the component while the data is not ready yet.

However, one caveat is that the data fetching solution needs to be integrated with Suspense for this to work correctly. Currently, outside of React Server Components (in the future) or the big frameworks like Next.js or Remix, integrating with this new Suspense mechanism on the server and client has no widespread support yet.

## Introduction

React Suspense Sync provides a simple solution for your SSR react app to **fetch data on server and sync it to the client later on**, enabling you to start streaming HTML earlier to the client.

```
import { SuspenseSync } from "react-suspense-sync";
...

const App = ({ asyncData }) => {
  return (
    <html>
      <head>
        ...
      </head>
      <body>
        {/* pass promises as asyncData to SuspenseSync */}
        <SuspenseSync asyncData={asyncData}>
          <Suspense fallback="loading cat... (the promise takes 2s to resolve on the server)">
            <Cat />
          </Suspense>
        </SuspenseSync>
      </body>
    </html>
  );
};

// In the component that's dependent on that server data
// Do remember to wrap it in Suspense when using it!
import { useSuspenseSync } from "react-suspense-sync";
...

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

```

On the server (learn more from the [official react docs](https://react.dev/reference/react-dom/server/renderToPipeableStream#rendering-a-react-tree-as-html-to-a-nodejs-stream)):
```
app.get("/", (_req, res) => {
  // choose your own data fetching strategy here
  // have it return a promise that resolves to the data
  const mockFetchCatData = new Promise((resolve) => {
    setTimeout(() => {
      resolve("The cat jumps over the lazy cow");
    }, 2000);
  });

  // note: using React 18's renderToPipeableStream!!
  // pass promise to App
  const { pipe } = renderToPipeableStream(
    React.createElement(App.default, {
      initialState: { asyncData: { mockFetchCatData } },
    }),
    {
      // add script to hydrate the server-generated HTML
      // see: https://react.dev/reference/react-dom/server/renderToPipeableStream#rendertopipeablestream
      bootstrapScripts: ["public/bundle.js"],
    },
  );

  pipe(res);
});
```

## TODO

1. Implement error handling when promise rejects using error boundaries.
2. Short writeup on how it works
