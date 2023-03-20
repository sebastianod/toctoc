import { Fragment } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./teacher-dashboard.styles.scss";

const TeacherDashboard = () => {
  return (
    <Fragment>
      <div>
        <h1>Teacher Dashboard</h1>
      </div>
      <div className="nav-links-container">
        <nav className="nav-link">
          <NavLink to="courses">
            <h2>Courses</h2>
          </NavLink>
        </nav>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default TeacherDashboard;
