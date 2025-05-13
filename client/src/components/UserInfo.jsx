const UserInfo = ({ dashboardData }) => {
  return (
    <>
      {/* Credits */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          🎯 Your Credits
        </h2>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
          {dashboardData.credits}
        </p>
      </div>

      {/* Saved Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          💾 Saved Posts
        </h2>
        <ul className="space-y-4 max-h-64 overflow-auto">
          {dashboardData.savedPosts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No saved posts yet.
            </p>
          ) : (
            dashboardData.savedPosts.map((post) => (
              <li
                key={post._id}
                className="border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {post.content}
                </a>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Activity Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          📜 Activity Logs
        </h2>
        <ul className="space-y-2 max-h-64 overflow-auto">
          {dashboardData.activityLogs.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No recent activities.
            </p>
          ) : (
            dashboardData.activityLogs.slice(0, 5).map((log, index) => (
              <li
                key={index}
                className="text-gray-700 dark:text-gray-300 text-sm"
              >
                • {log.details}
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default UserInfo;
