const Spinner: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center mt-4">
      <div className="spinner-border" style={{ color: "#57DC2F" }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
