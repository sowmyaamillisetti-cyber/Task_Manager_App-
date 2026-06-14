import React from "react";
import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

    @keyframes glow {
      0% {
        box-shadow: 0 0 10px rgba(94,139,80,0.3);
      }
      50% {
        box-shadow: 0 0 30px rgba(94,139,80,0.6);
      }
      100% {
        box-shadow: 0 0 10px rgba(94,139,80,0.3);
      }
    }
  `;

  const login = async () => {
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    alert(res.data.message);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    }
  };

  return (
    <>
      <style>{animationStyle}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #ffffff 0%, #dff5df 100%)",
        }}
      >
        <div
          style={{
            background: "white",
            width: "450px",
            padding: "40px",
            borderRadius: "20px",
            animation: "fadeIn 0.8s ease-in-out, glow 3s infinite",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "#2d4f2b",
              fontSize: "42px",
              marginBottom: "30px",
            }}
          >
            Login
          </h1>

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "18px",
              border: "2px solid #5e8b50",
              borderRadius: "10px",
              backgroundColor: "#f5fff3",
              fontSize: "16px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "20px",
              border: "2px solid #5e8b50",
              borderRadius: "10px",
              backgroundColor: "#f5fff3",
              fontSize: "16px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />

          <button
            onClick={login}
            style={{
              width: "100%",
              padding: "15px",
              background:
                "linear-gradient(135deg,#5e8b50,#3f6b35)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Login
          </button>

          <p
            style={{
              marginTop: "20px",
              fontSize: "16px",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#2d4f2b",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}