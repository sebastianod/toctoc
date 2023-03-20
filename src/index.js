import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./contexts/user/user.context";

import App from "./App";
import "./index.scss";
import { CourseProvider } from "./contexts/course/course.context";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement); // createRoot(container!)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <CourseProvider>
          <App />
        </CourseProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
