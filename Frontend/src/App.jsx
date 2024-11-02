import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  // Edit & update states
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const apiUrl = "http://localhost:8000";

  // Fetch all items on initial render
  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      })
      .catch(() => setError("Failed to load items"));
  };

  const handleSubmit = () => {
    if (title.trim() !== '' && description.trim() !== '') {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setMessage("Item added successfully");
            setTitle("");
            setDescription("");
          } else {
            setError("Unable to create Todo Item");
          }
          setTimeout(() => setMessage(""), 3000); // Clear message after timeout
        })
        .catch(() => setError("Failed to communicate with server"));
    } else {
      setError("Please enter both title and description");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleEditCancel = () => {
    setEditId(-1);
    setEditTitle("");
    setEditDescription("");
  };

  const handleUpdate = () => {
    if (editTitle.trim() !== '' && editDescription.trim() !== '') {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: editTitle, description: editDescription })
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) => {
              if (item._id === editId) {
                item.title = editTitle;
                item.description = editDescription;
              }
              return item;
            });
            setTodos(updatedTodos);
            setMessage("Item updated successfully");
            setEditTitle("");
            setEditDescription("");
            setEditId(-1);
          } else {
            setError("Unable to update Todo Item");
          }
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => setError("Failed to communicate with server"));
    } else {
      setError("Please enter both title and description");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE"
      })
        .then(() => {
          const updatedTodos = todos.filter((item) => item._id !== id);
          setTodos(updatedTodos);
          setMessage("Item deleted successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => setError("Failed to delete item"));
    }
  };

  return (
    <>
      <div className="container bg-primary p-3 text-light ">
        <h1>This is ToDo App</h1>
      </div>
      <div className="container">
        <h3 className="p-3">Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" type="text" />
          <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" type="text" />
          <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <div className="container row mt-3">
          <div className="col-md-6">
            <h3>Tasks</h3>
            <ul className="list-group">
              {todos.map((item) => (
                <li key={item._id} className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                  <div className="d-flex flex-column me-2">
                    {editId === -1 || editId !== item._id ? (
                      <>
                        <span className="fw-bold">{item.title}</span>
                        <span>{item.description}</span>
                      </>
                    ) : (
                      <div className="form-group d-flex gap-2">
                        <input placeholder="Title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className="form-control" type="text" />
                        <input placeholder="Description" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} className="form-control" type="text" />
                      </div>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    {editId === -1 || editId !== item._id ? (
                      <button className="btn bg-warning" onClick={() => handleEdit(item)}>Edit</button>
                    ) : (
                      <button onClick={handleUpdate} className="btn bg-warning">Update</button>
                    )}
                    {editId === -1 ? (
                      <button onClick={() => handleDelete(item._id)} className="btn bg-danger">Delete</button>
                    ) : (
                      <button className="btn bg-danger" onClick={handleEditCancel}>Cancel</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
