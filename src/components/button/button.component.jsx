import "./button.styles.scss";
//When called, the Button component can have children, the text of the button.
//Props may contain: type, buttonType (to set the className, for different designs)
//etc...

const buttonTypeClasses = {
  google: "google-sign-in",
  inverted: "inverted",
};

//entering {...otherProps} means we must use the jsx button tags when
//we call the Button component. Otherwise it will fail.
const Button = ({ children, buttonType, ...otherProps }) => {
  return (
    <button
      className={`button-container ${buttonTypeClasses[buttonType]}`}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
