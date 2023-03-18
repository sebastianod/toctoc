import "./course.styles.scss";

const Course = ({ name, teacher }) => {
  return (
    <div className="course-container">
      <h2>{name}</h2>
      <span>{teacher}</span>
    </div>
  );
};

export default Course;
