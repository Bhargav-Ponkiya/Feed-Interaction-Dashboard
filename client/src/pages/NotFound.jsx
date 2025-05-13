import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h1 className="text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
          404
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
          Oops! The page you are looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-300"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
