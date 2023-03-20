import { Route, Routes } from "react-router-dom";
import Course from "./components/courses/course/course.component";
import Courses from "./components/courses/courses.component";
import Students from "./components/students/students.component";
import Tests from "./components/tests-component/tests-component.component";

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
        <Route index element={<Home />} />
        <Route path="auth" element={<Authentication />} />
        <Route path="dasht" element={<TeacherDashboard />}>
          <Route path="courses" element={<Courses />}>
            <Route path=":courseId" element={<Course />} />
            <Route path=":courseId/tests" element={<Tests />} />
            <Route path=":courseId/students" element={<Students />} />
          </Route>
        </Route>
        <Route path="dashs" element={<StudentDashboard />}>
          <Route path="courses" element={<Courses />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
