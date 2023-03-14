import { Route, Routes } from "react-router-dom";

import Authentication from "./routes/authentication/authentication.component";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Authentication />} />
    </Routes>
  );
}

export default App;
