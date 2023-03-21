import { Fragment } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./teacher-dashboard.styles.scss";

const TeacherDashboard = () => {
  return (
    <Fragment>
      <div>
        <h1>Teacher Dashboard</h1>
      </div>
      <div className="dashboard-container">
        <div className="sidebar-container">
          <NavLink to="/dasht/courses">
            <h2>Courses</h2>
          </NavLink>
        </div>
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

export default TeacherDashboard;