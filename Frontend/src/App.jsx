import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]); // Set initial state to an array
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const apiUrl = "http://localhost:8000";

  //Edit&update
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleSubmit = () => {
    if (title.trim() !== '' && description.trim() !== '') { // Ensure both title and description are non-empty
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
          } else {
            setError("Unable to create Todo Item");
          }
        })
        .catch(() => setError("Failed to communicate with server")); // Handle any fetch errors
    } else {
      setError("Please enter both title and description"); // Show error if either input is empty
    }
  };
  useEffect(() => {
    getItems()

  }, [])
  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res)
      })
  }

  return (
    <>
      <div className="container bg-primary p-3 text-light ">
        <h1>This is ToDo App</h1>
      </div>
      <div className="container">
        <h3 className='p-3'>Add Item</h3>
        {message && <p className='text-success'>{message}</p>}
        <div className="form-group d-flex gap-2">
          <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className='form-control' type="text" />
          <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className='form-control' type="text" />
          <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className='text-danger'>{error}</p>}
        <div className="conatiner row mt-3">
          <h3>Tasks</h3>
          <ul className="list-group">
            {
              todos.map((item) => <li className="list-group-item  bg-info d-flex justify-content-between align-item-center my-2">
                <div className="d-flex flex-column">
                  {
                    editId !== -1 ? <>
                      <span className='fw-bold'>{item.title}</span>
                      <span>{item.description}</span>
                    </> : <>
                    
                      <div>
                        <div className="form-group d-flex gap-2">
                          <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className='form-control' type="text" />
                          <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className='form-control' type="text" />

                        </div>

                      </div>
                    </>
                  }
                </div>
                <div className='d-flex gap-2'>
                
                    
                    <button className='btn bg-warning' onClick={() => setEditId(item._id)}>Edit</button>
                    <button className='btn bg-danger'>Delete</button>:
              
                </div>
              </li>
              )
            }

          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
