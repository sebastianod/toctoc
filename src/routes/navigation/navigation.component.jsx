import { Fragment, useContext, useEffect } from "react"; //for user context
import { Outlet, NavLink, Link } from "react-router-dom"; //routing
import { UserContext } from "../../contexts/user/user.context";
import { onAuthStateChangedListener, signOutUser } from "../../utils/firebase/firebase-utils";
import AudioWavesLogo from "../../assets/audio-waves.png";

import "./navigation.styles.scss";

const Navigation = () => {
  const { currentUser } = useContext(UserContext); //to sign in or out

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user)=>{
      if (!user && window.location.pathname !== '/') {
        window.location.replace('/');
      }
    })
    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [currentUser]);

  function uiLogic() {
    if (currentUser) { // if user is signed in
      if (currentUser.teacher) { //if user is a teacher
        return (
          <Fragment>
            <NavLink className="nav-link" to="/dasht">
              TEACHER DASHBOARD
            </NavLink>
            <span className="nav-link" onClick={signOutUser}>
              SIGN OUT
            </span>
          </Fragment>
        );
      } else {
        return (
          <Fragment>
            <NavLink className="nav-link" to="/dashs">
              MY DASHBOARD
            </NavLink>
            <span className="nav-link" onClick={signOutUser}>
              SIGN OUT
            </span>
          </Fragment>
        );
      }
    } else { //if user is not signed in
      return (
        <NavLink className="nav-link" to="/auth">
          SIGN IN
        </NavLink>
      );
    }
  }

  return (
    <>
      <div className="navbar-container">
        <div className="navigation">
          <Link className="logo-container" to="/">
            <img className="logo" src={AudioWavesLogo} alt="TocToc" />
          </Link>
          <div className="nav-links-container">
            {uiLogic()}
          </div>
        </div>
      </div>
       {/* <Outlet> component is used to render child routes within a parent route.
         It acts as a placeholder where the child routes will be rendered. */}
      <Outlet />
    </>
  );
};

export default Navigation;
