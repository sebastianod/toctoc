import { Fragment, useContext } from "react"; //for user context
import { Outlet, Link } from "react-router-dom"; //routing
import { UserContext } from "../../contexts/user/user.context";
import { signOutUser } from "../../utils/firebase/firebase-utils";
import AudioWavesLogo from "../../assets/audio-waves.png";

import "./navigation.styles.scss";

const Navigation = () => {
  const { currentUser } = useContext(UserContext); //to sign in or out

  return (
    <Fragment>
      <div className="navigation">
        <Link className="logo-container" to="/">
          <img className="logo" src={AudioWavesLogo} alt="TocToc" />
        </Link>
        <div className="nav-links-container">
          <Link className="nav-link" to="/">
            HOME
          </Link>
          {/* Show sign out if user is signed in, sign out if signed in */}
          {currentUser ? (
            <Fragment>
              <Link className="nav-link" to="/dasht">
                TEACHER DASHBOARD
              </Link>
              <Link className="nav-link" to="/dashs">
                STUDENT DASHBOARD
              </Link>
              <span className="nav-link" onClick={signOutUser}>
                SIGN OUT
              </span>
            </Fragment>
          ) : (
            <Link className="nav-link" to="/auth">
              SIGN IN
            </Link>
          )}
        </div>
      </div>
      <Outlet />
      {/* <Outlet> component is used to render child routes within a parent route.
         It acts as a placeholder where the child routes will be rendered. */}
    </Fragment>
  );
};

export default Navigation;
