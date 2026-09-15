import { useState, useEffect } from "react";

// 本機開發：設定 VITE_API_URL=http://localhost:8000
// K8s 環境：不設定，改用相對路徑 /api，讓 Ingress 路由
const API = import.meta.env.VITE_API_URL || "/api";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API}/todos`);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Failed to create todo");
      setTitle("");
      setDescription("");
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (todo) => {
    try {
      const res = await fetch(`${API}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete todo");
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📝 Todo App</h1>

      <form onSubmit={handleCreate} style={styles.form}>
        <input
          type="text"
          placeholder="什麼事情要做？"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="備註（選填）"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...styles.input, marginTop: 8 }}
        />
        <button type="submit" style={styles.btn}>新增</button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {loading ? (
        <p style={styles.hint}>載入中...</p>
      ) : todos.length === 0 ? (
        <p style={styles.hint}>還沒有任何 Todo，新增一個吧！</p>
      ) : (
        <ul style={styles.list}>
          {todos.map((todo) => (
            <li key={todo.id} style={styles.item}>
              <div style={styles.itemLeft}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                  style={styles.checkbox}
                />
                <div>
                  <p style={{
                    ...styles.itemTitle,
                    textDecoration: todo.completed ? "line-through" : "none",
                    color: todo.completed ? "#999" : "#1a1a1a",
                  }}>
                    {todo.title}
                  </p>
                  {todo.description && (
                    <p style={styles.itemDesc}>{todo.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(todo.id)}
                style={styles.deleteBtn}
              >
                刪除
              </button>
            </li>
          ))}
        </ul>
      )}

      <p style={styles.footer}>
        {todos.filter((t) => !t.completed).length} 件待完成・
        {todos.filter((t) => t.completed).length} 件已完成
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 560,
    margin: "48px auto",
    padding: "0 16px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 24,
    color: "#1a1a1a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    marginBottom: 24,
    background: "#f8f8f8",
    padding: 16,
    borderRadius: 10,
    border: "1px solid #e5e5e5",
  },
  input: {
    padding: "10px 12px",
    fontSize: 14,
    border: "1px solid #ddd",
    borderRadius: 6,
    outline: "none",
  },
  btn: {
    marginTop: 10,
    padding: "10px 0",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 14,
    cursor: "pointer",
    fontWeight: 500,
  },
  error: { color: "#e53e3e", fontSize: 13, marginBottom: 12 },
  hint: { color: "#999", fontSize: 14, textAlign: "center", marginTop: 32 },
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid #f0f0f0",
    gap: 12,
  },
  itemLeft: { display: "flex", alignItems: "flex-start", gap: 12 },
  checkbox: { marginTop: 2, width: 16, height: 16, cursor: "pointer" },
  itemTitle: { margin: 0, fontSize: 15, fontWeight: 500 },
  itemDesc: { margin: "2px 0 0", fontSize: 13, color: "#888" },
  deleteBtn: {
    padding: "4px 10px",
    fontSize: 12,
    background: "transparent",
    border: "1px solid #ddd",
    borderRadius: 4,
    cursor: "pointer",
    color: "#999",
    whiteSpace: "nowrap",
  },
  footer: {
    marginTop: 20,
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },
};
