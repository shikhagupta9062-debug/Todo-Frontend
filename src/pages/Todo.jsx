import {
  useContext,
  useState,
} from "react";

import { TodoContext } from "../context/TodoContext";
import { AuthContext } from "../context/AuthContext";

const Todo = () => {
  const {
    todos,
    loading,
    addTodo,
    toggleTodo,
    updateTodoTitle,
    deleteTodo,
  } = useContext(TodoContext);

  const { user, logout } =
    useContext(AuthContext);

  const [title, setTitle] = useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    try {
      setActionLoading(true);

      await addTodo(trimmedTitle);

      setTitle("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Todo add nahi hua"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Todo
  const handleToggle = async (
    id,
    completed
  ) => {
    try {
      await toggleTodo(
        id,
        completed
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Todo update nahi hua"
      );
    }
  };

  // Start edit
  const handleEditStart = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
  };

  // Save edit
  const handleEditSave = async (id) => {
    const trimmedTitle =
      editTitle.trim();

    if (!trimmedTitle) {
      alert(
        "Title khali nahi ho sakta"
      );
      return;
    }

    try {
      setActionLoading(true);

      await updateTodoTitle(
        id,
        trimmedTitle
      );

      setEditingId(null);
      setEditTitle("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Title update nahi hua"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel edit
  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle("");
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this todo?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTodo(id);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Todo delete nahi hua"
      );
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="app-header">
          <div>
            <p className="welcome-text">
              Welcome back
            </p>

            <h1>{user?.name}</h1>
          </div>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </header>

        {/* Add Todo */}
        <form
          className="todo-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            disabled={actionLoading}
          />

          <button
            type="submit"
            disabled={
              actionLoading ||
              !title.trim()
            }
          >
            Add
          </button>
        </form>

        {/* Todo list */}
        {loading ? (
          <div className="loading">
            Loading todos...
          </div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              ✓
            </div>

            <h3>No todos yet</h3>

            <p>
              Add your first task above.
            </p>
          </div>
        ) : (
          <div className="todo-list">
            {todos.map((todo) => (
              <div
                className={`todo-item ${
                  todo.completed
                    ? "todo-completed"
                    : ""
                }`}
                key={todo._id}
              >
                {editingId ===
                todo._id ? (
                  <div className="todo-edit-mode">
                    <input
                      type="text"
                      className="edit-input"
                      value={editTitle}
                      onChange={(e) =>
                        setEditTitle(
                          e.target.value
                        )
                      }
                      autoFocus
                    />

                    <div className="todo-actions">
                      <button
                        className="save-btn"
                        onClick={() =>
                          handleEditSave(
                            todo._id
                          )
                        }
                        disabled={
                          actionLoading
                        }
                      >
                        Save
                      </button>

                      <button
                        className="cancel-btn"
                        onClick={
                          handleEditCancel
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="todo-left">
                      <input
                        type="checkbox"
                        checked={
                          todo.completed
                        }
                        onChange={() =>
                          handleToggle(
                            todo._id,
                            todo.completed
                          )
                        }
                      />

                      <span
                        className={
                          todo.completed
                            ? "completed"
                            : ""
                        }
                      >
                        {todo.title}
                      </span>
                    </div>

                    <div className="todo-actions">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEditStart(
                            todo
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            todo._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="todo-footer">
          <span>
            {todos.filter(
              (todo) =>
                !todo.completed
            ).length}{" "}
            tasks remaining
          </span>

          <span>
            {todos.length} total
          </span>
        </div>
      </div>
    </div>
  );
};

export default Todo;
