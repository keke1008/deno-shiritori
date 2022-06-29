import { App } from "aleph/react";
import { serve } from "aleph/server";
import { renderToReadableStream } from "react-dom/server";

// pre-import route modules for serverless env that doesn't support the dynamic imports,
// this module will be updated automaticlly in develoment mode.
import routesModules from "./routes.gen.ts";

serve({
  routes: "./routes/**/*.{tsx,ts}",
  routesModules,
  ssr: {
    // when set `dataDefer` to `true`, the router will loading data as defer
    // please check https://alephjs.org/docs/react/router/data-defer
    dataDefer: false,
    render: (ctx) => renderToReadableStream(<App ssrContext={ctx} />, ctx),
  },
});
