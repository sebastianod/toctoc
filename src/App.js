import { Route, Routes } from "react-router-dom";
import CourseDetails from "./components/courses/course-details/course-details.component";
import Courses from "./components/courses/courses.component";
import Students from "./components/students/students.component";
import TestDetails from "./components/tests-component/test-details/test-details.component";
import Tests from "./components/tests-component/tests-component.component";

import Authentication from "./routes/authentication/authentication.component";
import Home from "./routes/home/home.component";
import Navigation from "./routes/navigation/navigation.component";
import StudentDashboard from "./routes/student-dashboard/student-dashboard.component";
import TeacherDashboard from "./routes/teacher-dashboard/teacher-dashboard.component";
import ExcelInput from "./components/csv-input/excel-input.component";
import StudentCourseDetails from "./routes/student-dashboard/components/student-courses/st-course-details/st-course-details.component";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        {/* the index attribute is used to specify the default child route that should be rendered when the
       parent route is matched.  */}
        <Route index element={<Home />} />
        <Route path="auth" element={<Authentication />} />
        <Route path="dasht" element={<TeacherDashboard />}>
          <Route path="create" element={<ExcelInput />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:courseId" element={<CourseDetails />}>
            <Route path="tests" element={<Tests />} />
            <Route path="tests/:testId" element={<TestDetails />} />
            <Route path="students" element={<Students />} />
            {/* <Route path="students/:studentId" element={<Student />}/> */}
          </Route>
        </Route>
        <Route path="dashs" element={<StudentDashboard />}>
          <Route path=":courseId" element={<StudentCourseDetails />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
