import { useState } from "react";
import { registerUser } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast"; // Import toast

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await registerUser(form);
      login(data.user); // update auth context
      toast.success("Registration successful!"); // Show success toast
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Registration failed!";
      toast.error(errorMsg); // Show error toast with the appropriate message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-700 p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          Register
        </h2>
        <input
          name="name"
          type="text"
          placeholder="Name"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 focus:outline-none">
          Register
        </button>
        <p className="text-center mt-3 text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 dark:text-blue-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
