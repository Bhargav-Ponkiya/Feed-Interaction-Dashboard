const FeedPostItem = ({
  post,
  handleSave,
  handleShare,
  handleReport,
  reportReasons,
  setReportReasons,
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-300">
      <div className="mb-2 flex justify-between text-sm text-gray-400 dark:text-gray-300">
        <span className="font-medium">Source: {post.platform}</span>
      </div>

      <div className="mb-3">
        <p className="text-gray-800 dark:text-gray-100 text-base font-medium mb-1">
          {post.content}
        </p>
        <a
          href={post.url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          View Original ↗
        </a>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
        <button
          onClick={() => handleSave(post)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          💾 Save
        </button>

        <button
          onClick={() => handleShare(post)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          📤 Share
        </button>

        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <input
            type="text"
            placeholder="Reason for reporting..."
            value={reportReasons[post.postId] || ""}
            onChange={(e) =>
              setReportReasons((prev) => ({
                ...prev,
                [post.postId]: e.target.value,
              }))
            }
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-500 w-full"
          />
          <button
            onClick={() => handleReport(post)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            🚫 Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedPostItem;
