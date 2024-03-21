export default function ErrorMessage({ message }) {
  return (
    <div className="errorContainer">
      <h3 style={{ color: "red" }}>{message}</h3>
    </div>
  );
}
