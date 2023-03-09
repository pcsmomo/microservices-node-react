const NewTicket = () => {
  return (
    <div>
      <h1>Create a Ticket</h1>
      <form>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input className="form-control" />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
export default NewTicket;
