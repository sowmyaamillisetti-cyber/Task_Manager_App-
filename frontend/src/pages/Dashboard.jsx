import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  const animationStyle = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
      }
      50% {
        box-shadow: 0 0 25px rgba(94,139,80,0.5);
      }
      100% {
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
      }
    }
  `;

  const getTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addOrUpdateTask = async () => {
    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

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
  };

  const editTask = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    alert("Task Deleted Successfully");
    getTasks();
  };

  return (
    <>
      <style>{animationStyle}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #ffffff 0%, #dff5df 100%)",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "850px",
            background: "white",
            padding: "35px",
            borderRadius: "20px",
            animation: "fadeIn 0.8s ease-in-out, pulse 3s infinite",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              color: "#2d4f2b",
              fontSize: "40px",
              marginBottom: "25px",
              fontWeight: "bold",
            }}
          >
            Task Dashboard
          </h1>

          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              boxSizing: "border-box",
              border: "2px solid #5e8b50",
              borderRadius: "10px",
              backgroundColor: "#f5fff3",
              fontSize: "16px",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "20px",
              boxSizing: "border-box",
              border: "2px solid #5e8b50",
              borderRadius: "10px",
              backgroundColor: "#f5fff3",
              fontSize: "16px",
              outline: "none",
            }}
          />

          <button
            onClick={addOrUpdateTask}
            style={{
              width: "100%",
              padding: "14px",
              background: editId
                ? "linear-gradient(135deg,#ff9800,#ff5722)"
                : "linear-gradient(135deg,#5e8b50,#3f6b35)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {editId ? "Update Task" : "Add Task"}
          </button>

          <hr style={{ margin: "25px 0" }} />

          {tasks.map((task) => (
            <div
              key={task._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: "#f5fff3",
                animation: "fadeIn 0.5s ease-in-out",
              }}
            >
              <h3
                style={{
                  color: "#2d4f2b",
                  marginBottom: "8px",
                }}
              >
                {task.title}
              </h3>

              <p
                style={{
                  color: "#555",
                  marginBottom: "15px",
                }}
              >
                {task.description}
              </p>

              <button
                onClick={() => editTask(task)}
                style={{
                  backgroundColor: "#087919",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}