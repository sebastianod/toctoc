import "./student-courses.styles.scss";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../contexts/user/user.context";
import { subscribeStudentToEnrollments } from "../../../../utils/firebase/firebase-utils";
import StudentCourse from "./student-course/student-course.component";
import { Outlet } from "react-router-dom";

export default function StudentCourses() {
  const { currentUser } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const studentId = currentUser.uid;

  useEffect(() => {
    const unsubscribe = subscribeStudentToEnrollments(studentId, setCourses);
    return () => unsubscribe();
  }, [studentId]);

  function showCourses() {
    return courses.map((course, index) => {
      const { courseId, name } = course;
      return (
        <StudentCourse
          key={index}
          studentId={studentId}
          courseId={courseId}
          name={name}
        />
      );
    });
  }

  return (
    <div className="courses-and-details-container">
      <div className="student-courses-container">
        <h2 className="student-courses-header">My Courses</h2>
        {showCourses()}
      </div>
      <div className="st-course-details-container">
        <Outlet />
      </div>
    </div>
  );
}
