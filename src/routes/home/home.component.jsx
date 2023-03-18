import Courses from "../../components/courses/courses.component";
import "./home.styles.scss";

const Home = () => {
  return (
    <div>
      <h1>HOME PAGE</h1>
      {/* This should be on the Main component, here for testing only */}
      <Courses />
    </div>
  );
};

export default Home;
