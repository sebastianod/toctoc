import { Route, Routes } from "react-router-dom";

import Authentication from "./routes/authentication/authentication.component";
import Home from "./routes/home/home.component";
import Navigation from "./routes/navigation/navigation.component";
import StudentDashboard from "./routes/student-dashboard/student-dashboard.component";
import TeacherDashboard from "./routes/teacher-dashboard/teacher-dashboard.component";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
      {/* the index attribute is used to specify the default child route that should be rendered when the
       parent route is matched.  */}
        <Route index element={<Home /> }/>
        <Route path="/auth" element={<Authentication />} />
        <Route path="/dasht" element={<TeacherDashboard />} />
        <Route path="/dashs" element={<StudentDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
