const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-semibold text-red-500 dark:text-red-400">
          Access Denied
        </h2>
        <p className="mt-4 text-gray-800 dark:text-gray-300">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
