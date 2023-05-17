import StudentCourses from "./components/student-courses/student-courses.component";
import { UserContext } from "../../contexts/user/user.context";
import { useContext } from "react";
import "./student-dashboard.styles.scss";

const StudentDashboard = () => {
  const { currentUser } = useContext(UserContext);
  const studentName = currentUser ? currentUser.displayName : "";

  return (
    <div className="student-dashboard-container">
      <div className="welcome-area">
        <h1>Student Dashboard</h1>
        <h3>Welcome {studentName}</h3>
      </div>
      <div className="student-courses-area">
        <StudentCourses />
      </div>
    </div>
  );
};

export default StudentDashboard;
