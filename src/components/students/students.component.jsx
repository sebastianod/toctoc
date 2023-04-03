import { useContext, useEffect, useState } from "react";
import { CourseContext } from "../../contexts/course/course.context";
import { subscribeToStudents } from "../../utils/firebase/firebase-utils";
import CreateArea from "../create-area/create-area.component";
import Student from "./student-component/student.component";
import "./students.styles.scss";
import ExcelInput from "../csv-input/excel-input.component";

const Students = () => {
  const [students, setStudents] = useState([]);
  const { currentCourse } = useContext(CourseContext); //to get the current courseId, for the path to the students of this course
  const courseId = currentCourse.courseId;

  //listening for changes to the students collection
  useEffect(() => {
    const unsubscribe = subscribeToStudents(courseId, setStudents);
    return () => unsubscribe();
  }, [courseId]);

  //showing the students
  const showStudents = students.map((student, index) => {
    const { email, studentId, displayName } = student;
    return (
      <Student
        key={index}
        studentName={displayName}
        studentEmail={email}
        studentId={studentId}
        courseId={courseId}
      />
    );
  });

  return (
    <div className="students-container">
      <div className="student-creation-area">
        <CreateArea type="Student" courseId={courseId} />
        <span className="or"> Or </span>
        <ExcelInput courseId={courseId} type="enrollment"/>
      </div>
      <div className="student-list-container">{showStudents}</div>
    </div>
  );
};

export default Students;
