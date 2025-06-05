import { useEffect, useState } from "react";

export const TodoListFetch = () => {
  const host = 'https://playground.4geeks.com/todo';
  const user = 'valentina';

  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState('');
  const [editCompleted, setEditCompleted] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editTodo, setEditTodo] = useState({});
  const [todos, setTodos] = useState([]);

  const handleNewTaskd = event => setNewTask(event.target.value);
  const handleEditTask = event => setEditTask(event.target.value);
  const handleEditCompleted = event => setEditCompleted(event.target.checked);

  const addUser = async () => {
    const url = `${host}/users/${user}`;
    const options = { method: 'POST' };
    await fetch(url, options);
  }

  const addTodo = async (dataTosend) => {
    const url = `${host}/todos/${user}`;
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(dataTosend)
    }
    try {
      const response = await fetch(url, options);
      if (!response.ok && response.status === 404) {
        await addUser();
        await addTodo(dataTosend);
        return;
      }
      getTodos();
    } catch {
      console.log('error')
    }
  }

  const modifyTodo = async (id, dataTosend) => {
    const url = `${host}/todos/${id}`;
    const options = {
      method: 'PUT',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(dataTosend)
    };
    try {
      await fetch(url, options);
      getTodos();
    } catch {
      console.log('error');
    }
  }

  const deleteTodo = async (id) => {
    const url = `${host}/todos/${id}`;
    const options = { method: 'DELETE' };
    try {
      await fetch(url, options);
      getTodos();
    } catch {
      console.log('error')
    }
  }

  const handleSubmitAdd = (event) => {
    event.preventDefault();
    if (!newTask.trim()) return;
    const dataTosend = {
      label: newTask,
      is_done: false
    }
    addTodo(dataTosend);
    setNewTask('');
  }

  const handleSubmitEdit = (event) => {
    event.preventDefault();
    if (!editTask.trim()) return;
    const dataTosend = {
      label: editTask,
      is_done: editCompleted
    }
    modifyTodo(editTodo.id, dataTosend);
    setIsEdit(false);
    setEditTodo({});
    setEditTask('');
    setEditCompleted(false);
  }

  const handleCancel = () => {
    setIsEdit(false);
    setEditTodo({});
    setEditTask('');
    setEditCompleted(false);
  }

  const handleEdit = (tarea) => {
    setIsEdit(true);
    setEditTodo(tarea);
    setEditTask(tarea.label);
    setEditCompleted(tarea.is_done);
  }

  const handleDelete = (tarea) => {
    deleteTodo(tarea.id);
  }

  const getTodos = async () => {
    const url = `${host}/users/${user}`;
    const options = { method: 'GET' };
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 404) {
          await addUser();
          await getTodos();
        }
        return;
      }
      const data = await response.json();
      setTodos(data.todos);
    } catch {
      console.log('error')
    }
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-success">Todo List with Fetch</h1>

      {isEdit ?
        <form onSubmit={handleSubmitEdit}>
          
          
          <div className="text-start mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Edit Task</label>
            <input type="text" className="form-control" id="exampleInputPassword1"
              value={editTask} onChange={handleEditTask} />
          </div>
          <div className="text-start mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1"
              checked={editCompleted} onChange={handleEditCompleted} />
            <label className="form-check-label" htmlFor="exampleCheck1">Completed</label>
          </div>
          <button type="submit" className="btn btn-primary me-2">Submit</button>
          <button type="reset" onClick={handleCancel} className="btn btn-secondary">Cancel</button>
        </form>
        :
        <form onSubmit={handleSubmitAdd}>
          {/* Form Agregar Tarea */}
          <div className="text-start mb-3">
            <label htmlFor="exampleTask" className="form-label">Add Task</label>
            <input type="text" className="form-control" id="exampleTask"
              value={newTask} onChange={handleNewTaskd} />
          </div>
          <button type="submit" className="btn btn-success">Add</button>
        </form>
      }

      <h2 className="text-primary mt-5">List</h2>

      
      <ul className="text-start list-group">
        {todos.map((item) =>
          <li key={item.id}
            className="list-group-item hidden-icon d-flex justify-content-between">
            <div>
              {item.is_done ?
                <i className="far fa-thumbs-up text-success me-2"></i>
                :
                <i className="fas fa-times-circle text-danger me-2"></i>
              }
              {item.label}
            </div>
            <div>
              <span onClick={() => handleEdit(item)}>
                <i className="fas fa-edit text-primary me-2"></i>
              </span>
              <span onClick={() => handleDelete(item)}>
                <i className="fas fa-trash text-danger"></i>
              </span>
            </div>
          </li>
        )}
        <li className="list-group-item text-end">
          {todos.length === 0 ? 'No tasks, please add a new task'
            : todos.length + ' tasks'}
        </li>
      </ul>
    </div>
  )
}