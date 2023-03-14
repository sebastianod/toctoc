import "./sign-up-form.styles.scss";
import TextInput from "../text-input/text-input.component";
import Button from "../button/button.component";
import { useState } from "react";

const SignupForm = () => {
  const defaultForm = {
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  }

  const [ form , setForm ] = useState(defaultForm);
  const { displayName, email, password, confirmPassword } = form; //destructuring form

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({...form, [name]:value });
  }

  const handleSubmit = () => {

  }

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
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  )
}

export default SignupForm;