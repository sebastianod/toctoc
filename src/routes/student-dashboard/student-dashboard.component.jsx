import { useContext } from "react";
import StudentCourses from "./student-courses/student-courses.component";
import "./student-dashboard.styles.scss";
import { UserContext } from "../../contexts/user/user.context";

const StudentDashboard = () => {
  const {currentUser} = useContext(UserContext);
  console.log(currentUser.uid);

  return (
    <div>
      <h1>Student Dashboard</h1>
      <StudentCourses />
    </div>
  );
};

export default StudentDashboard;
