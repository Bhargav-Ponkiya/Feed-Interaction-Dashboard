const Modal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 pt-10">
      <div className="bg-white dark:bg-gray-800 max-w-3xl w-full mx-4 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {user.name}'s Activity Logs
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 text-xl font-bold"
          >
            &times;
          </button>
        </div>
        <div className="p-4 space-y-4">
          {user.activityLogs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No activity logs found.
            </p>
          ) : (
            <ul className="space-y-3">
              {user.activityLogs.map((log) => (
                <li
                  key={log._id}
                  className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold capitalize">
                      {log.action} on {log.platform}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Post ID:</strong> {log.postId}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Details:</strong> {log.details}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
