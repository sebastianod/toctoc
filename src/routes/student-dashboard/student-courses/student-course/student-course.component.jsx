import "./student-course.styles.scss";

export default function StudentCourse(props) {
  const { courseId, name, studentId } = props;
  console.log(courseId, name, studentId);
  return (
    <div>
      <h3>{name}</h3>
    </div>
  );
}
