import React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.scss";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // createRoot(container!)

root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);