import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const username = localStorage.getItem("username") || "User";

  // GET TASKS
  const getTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  // ADD / UPDATE
  const addOrUpdateTask = async () => {
    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    try {
      if (editId) {
        await API.put(`/tasks/${editId}`, {
          title,
          description,
        });
        alert("Task Updated Successfully");
        setEditId(null);
      } else {
        await API.post("/tasks", {
          title,
          description,
        });
        alert("Task Added Successfully");
      }

      setTitle("");
      setDescription("");
      getTasks();
    } catch (err) {
      alert("Something went wrong");
      console.log(err);
    }
  };

  // EDIT
  const editTask = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };

  // DELETE
  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    getTasks();
  };

  // COMPLETE
  const toggleComplete = async (task) => {
    await API.put(`/tasks/${task._id}`, {
      title: task.title,
      description: task.description,
      completed: !task.completed,
    });

    getTasks();
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  // STATS
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <>
      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes glow {
            0% { box-shadow: 0 0 10px rgba(94,139,80,0.2); }
            50% { box-shadow: 0 0 25px rgba(94,139,80,0.5); }
            100% { box-shadow: 0 0 10px rgba(94,139,80,0.2); }
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.box}>

          {/* HEADER */}
          <div style={styles.header}>
            <h2 style={{ color: "#2d4f2b" }}>
              Welcome, {username}
            </h2>

            <button onClick={logout} style={styles.logout}>
              Logout
            </button>
          </div>

          <h1 style={styles.title}>Task Dashboard</h1>

          {/* STATS */}
          <div style={styles.stats}>
            <div style={styles.card}>Total<br />{totalTasks}</div>
            <div style={styles.card}>Completed<br />{completedTasks}</div>
            <div style={styles.card}>Pending<br />{pendingTasks}</div>
          </div>

          {/* INPUTS */}
          <input
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
          />

          {/* SEARCH */}
          <input
            placeholder="Search Task"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <button onClick={addOrUpdateTask} style={styles.addBtn}>
            {editId ? "Update Task" : "Add Task"}
          </button>

          <hr />

          {/* TASK LIST */}
          {tasks
            .filter((t) =>
              t.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((task) => (
              <div key={task._id} style={styles.taskCard}>

                <h3
                  style={{
                    color: "#2d4f2b",
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </h3>

                <p>{task.description}</p>

                <button onClick={() => editTask(task)} style={styles.editBtn}>
                  Edit
                </button>

                <button onClick={() => deleteTask(task._id)} style={styles.deleteBtn}>
                  Delete
                </button>

                <button
                  onClick={() => toggleComplete(task)}
                  style={{
                    ...styles.completeBtn,
                    background: task.completed ? "grey" : "#28a745",
                  }}
                >
                  {task.completed ? "Completed" : "Complete"}
                </button>

              </div>
            ))}

        </div>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #ffffff 0%, #dff5df 100%)",
    padding: "20px",
    fontFamily: "Arial",
  },

  box: {
    width: "1000px",
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    border: "2px solid #5e8b50",
    animation: "fadeIn 0.8s ease-in-out, glow 3s infinite",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logout: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "20px 15px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  title: {
    textAlign: "center",
    color: "#4f4c2b",
  },

  stats: {
    display: "flex",
    gap: "10px",
    marginBottom: "35px",
  },

  card: {
    flex: 1,
    background: "#f5fff3",
    border: "2px solid #5e8b50",
    padding: "30px",
    textAlign: "center",
    borderRadius: "80px",
    color: "#2d4f2b",
    fontWeight: "bold",
     animation: "fadeIn 0.8s ease-in-out, glow 3s infinite",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "25px",
    border: "2px solid #5e8b50",
    borderRadius: "12px",
    outline: "none",
    background: "#f5fff3",
  },

  addBtn: {
    width: "100%",
    padding: "12px",
    background: "#4e824b",
    color: "white",
    border: "none",
    borderRadius: "800px",
    cursor: "pointer",
  },

  taskCard: {
    background: "#fff",
    border: "3px solid #5e8b50",
    padding: "18px",
    marginBottom: "40px",
    borderRadius: "15px",
     animation: "fadeIn 0.8s ease-in-out, glow 3s infinite",
  },

  editBtn: {
    background: "#d4db21",
    border: "none",
    padding: "10px",
    marginRight: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "10px",
    marginRight: "10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  completeBtn: {
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};