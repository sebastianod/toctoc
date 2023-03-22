export default function Test(props) {
  const { testName } = props;

  return (
    <div className="test-container">
      <h3>{testName}</h3>
    </div>
  );
}
