import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, RootRoute, Router } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { getRouter } from "./router";

const router = getRouter();

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <router.RootRoute.Provider>
      <router.RouteComponent />
    </router.RootRoute.Provider>
  </React.StrictMode>
);
