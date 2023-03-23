import { useContext } from "react";
import { TestContext } from "../../../contexts/test-context/test.context";
import "./test-details.styles.scss";

export default function TestDetails() {
  const { currentTest } = useContext(TestContext);
  const { name } = currentTest;

  return (
    <div className="test-details-container">
      <h3>{name} </h3>
      <h3> Answers: </h3>
    </div>
  );
}
