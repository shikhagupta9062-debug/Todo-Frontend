import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  // GET Todos
  const fetchTodos = async () => {
    if (!isAuthenticated) {
      setTodos([]);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/todos");

      setTodos(response.data);
    } catch (error) {
      console.error(
        "Fetch todos error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // POST Todo
  const addTodo = async (title) => {
    const response = await api.post("/todos", {
      title: title.trim(),
    });

    setTodos((prev) => [
      response.data,
      ...prev,
    ]);

    return response.data;
  };

  // PUT Todo - Toggle completed
  const toggleTodo = async (
    id,
    completed
  ) => {
    const response = await api.put(
      `/todos/${id}`,
      {
        completed: !completed,
      }
    );

    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id
          ? response.data
          : todo
      )
    );

    return response.data;
  };

  // PUT Todo - Update title
  const updateTodoTitle = async (
    id,
    newTitle
  ) => {
    const response = await api.put(
      `/todos/${id}`,
      {
        title: newTitle.trim(),
      }
    );

    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id
          ? response.data
          : todo
      )
    );

    return response.data;
  };

  // DELETE Todo
  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`);

    setTodos((prev) =>
      prev.filter(
        (todo) => todo._id !== id
      )
    );
  };

  // Fetch todos after login
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    } else {
      setTodos([]);
    }
  }, [isAuthenticated]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        fetchTodos,
        addTodo,
        toggleTodo,
        updateTodoTitle,
        deleteTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
