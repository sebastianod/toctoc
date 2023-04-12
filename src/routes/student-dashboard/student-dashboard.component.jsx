import StudentCourses from "./student-courses/student-courses.component";
import "./student-dashboard.styles.scss";

const StudentDashboard = () => {
  return (
    <div>
      <h1>Student Dashboard</h1>
      <StudentCourses />
    </div>
  );
};

export default StudentDashboard;
