import "./sign-up-form.styles.scss";
import TextInput from "../text-input/text-input.component";
import Button from "../button/button.component";
import { useState } from "react";
import {
  createAuthUserEmailPassword,
  createUserDocumentFromAuth,
  signInWithGooglePopup,
} from "../../utils/firebase/firebase-utils";
import { useContext } from "react";
import { UserContext } from "../../contexts/user/user.context";

const SignUpForm = () => {
  const defaultForm = {
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [form, setForm] = useState(defaultForm);
  const { displayName, email, password, confirmPassword } = form; //destructuring form
  const { setCurrentUser } = useContext(UserContext);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm(defaultForm);
  };

  //we call on google's servers, so async it is
  const handleSubmit = async (event) => {
    event.preventDefault();

    //password and confirm password match check.
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    //Try to create the user from the authentication

    try {
      //Try to create the Auth user. Returns the user object.
      const { user } = await createAuthUserEmailPassword(email, password);
      setCurrentUser(user);
      //Create the user in Firestore DB, we can make the user doc
      //be as we want, so we give it a displayName, or any additional
      //info
      await createUserDocumentFromAuth(user, { displayName });
      resetForm(); //set the form inputs to empty strings once done
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use, can not create user");
      } else {
        console.log("user creation encountered an error: ", error);
      }
    }
  };

  const signUpWithGoogle = async () => {
    //If signing-up with Google, require display name
    if (displayName.length === 0) {
      alert("Set a display name first, then click Sign Up With google");
      return;
    }

    const result = await signInWithGooglePopup();
    const user = result.user;
    setCurrentUser(user);
    console.log("user id: ", user.uid, " user email: ", user.email);

    try {
      //Create the user in Firestore DB, we can make the user doc
      //be as we want, so we give it a displayName, or any additional
      //info
      await createUserDocumentFromAuth(user, { displayName });
      resetForm(); //set the form inputs to empty strings once done
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use, can not create user");
      } else {
        console.log("user creation encountered an error: ", error);
      }
    }
  };

  return (
    <div className="sign-up-container">
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Display Name"
          type="text"
          required
          onChange={handleChange}
          value={displayName}
          name="displayName"
        />
        <TextInput
          label="Email"
          type="email"
          required
          onChange={handleChange}
          value={email}
          name="email"
        />
        <TextInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          value={password}
          name="password"
        />
        <TextInput
          label="Confirm Password"
          type="password"
          required
          onChange={handleChange}
          value={confirmPassword}
          name="confirmPassword"
        />
        <div className="buttons-container">
          <Button type="submit">Sign Up</Button>
          <Button buttonType="google" type="button" onClick={signUpWithGoogle}>
            Sign Up With Google
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
