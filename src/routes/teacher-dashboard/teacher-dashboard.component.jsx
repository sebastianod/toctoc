import { Fragment } from "react";
import { Link, Outlet } from "react-router-dom";
import "./teacher-dashboard.styles.scss";

const TeacherDashboard = () => {
  return (
    <Fragment>
      <div>
        <h1>Teacher Dashboard</h1>
      </div>
      <div className="nav-links-container">
        <Link to="/dasht/courses">
          <h2>Courses</h2>
        </Link>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default TeacherDashboard;
