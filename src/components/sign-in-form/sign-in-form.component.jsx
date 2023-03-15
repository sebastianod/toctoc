import "./sign-in-form.styles.scss";
import TextInput from "../text-input/text-input.component";
import Button from "../button/button.component";
import { useState } from "react";
import { signInWithGooglePopup, signInAuthEmailPassword, checkUserExists } from "../../utils/firebase/firebase-utils";

const SignInForm = () => {
  const defaultForm = {
    email: "",
    password: "",
  };

  const [form, setForm] = useState(defaultForm);
  const { email, password } = form; //destructuring form values

  const resetFormFields = () => {
    setForm(defaultForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signInAuthEmailPassword(email, password);
      resetFormFields();
    } catch (error) {
      console.log("Sign in failed: ", error);
    }
  };

  const signInWithGoogle = async () => {
    const result = await signInWithGooglePopup();
    const user = result.user;
    //Check if the user exists in the database
    const exists = await checkUserExists(user);
    if (!exists) {
      alert("You have not signed up yet, sign up!")
    } return;
  }

  return (
    <div className="sign-in-container">
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={handleSubmit}>
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
        <div className="buttons-container">
          <Button type="submit">Sign In</Button>
          <Button buttonType="google" type="button" onClick={signInWithGoogle}>
            Sign In With Google
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
