import { Fragment, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/user/user.context";
import "./teacher-dashboard.styles.scss";

const TeacherDashboard = () => {
  const { currentUser } = useContext(UserContext);
  const displayName = currentUser?.displayName;

  return (
    <Fragment>
      <div className="titles">
        <h1 className="title-dash">Teacher Dashboard</h1>
        <h3 className="display-name">Welcome {displayName}</h3>
      </div>
      <div className="dashboard-container">
        <div className="sidebar-container">
          <div className="navlink-container">
            <NavLink to="/dasht/courses">
              <h2>Courses</h2>
            </NavLink>
          </div>
          <div className="navlink-container">
            <NavLink to="/dasht/create">
              <h2>Create Students</h2>
            </NavLink>
          </div>
        </div>
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

export default TeacherDashboard;
