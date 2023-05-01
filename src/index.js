import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./contexts/user/user.context";

import App from "./App";
import "./index.scss";
import { CourseProvider } from "./contexts/course/course.context";
import { TestProvider } from "./contexts/test-context/test.context";
import { AudioBlobProvider } from "./contexts/audioBlob/audioBlob.context";
import { TriesProvider } from "./contexts/tries/tries.context";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement); // createRoot(container!)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <CourseProvider>
          <TestProvider>
            <TriesProvider>
              <AudioBlobProvider>
                <App />
              </AudioBlobProvider>
            </TriesProvider>
          </TestProvider>
        </CourseProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
