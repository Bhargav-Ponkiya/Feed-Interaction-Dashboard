import { useEffect, useState } from "react";
import { fetchUserAnalytics, updateUserCredits } from "../../utils/api";
import { toast } from "react-hot-toast";
import { FaEdit, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import Modal from "./UserDetailsModal";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUserId, setEditUserId] = useState(null);
  const [creditUpdate, setCreditUpdate] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchUserAnalytics();
        setUsers(res.data.users);
      } catch {
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleCreditChange = (userId, credits) => {
    setCreditUpdate((prev) => ({ ...prev, [userId]: credits }));
  };

  const handleCreditSubmit = async (userId) => {
    try {
      await updateUserCredits({ userId, credits: creditUpdate[userId] });
      toast.success("Credits updated");
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, credits: creditUpdate[userId] }
            : user
        )
      );
      setEditUserId(null);
    } catch {
      toast.error("Failed to update credits");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4 bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        User Management
      </h2>
      <table className="min-w-full bg-white dark:bg-gray-700 rounded shadow border border-gray-200 dark:border-gray-600">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="p-3 text-left text-gray-600 dark:text-gray-300">
              Name
            </th>
            <th className="p-3 text-left text-gray-600 dark:text-gray-300">
              Credits
            </th>
            <th className="p-3 text-left text-gray-600 dark:text-gray-300">
              Saved
            </th>
            <th className="p-3 text-left text-gray-600 dark:text-gray-300">
              Reported
            </th>
            <th className="p-3 text-left text-gray-600 dark:text-gray-300">
              Logs
            </th>
            <th className="p-3 text-left text-gray-600 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-t hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <td className="p-3 font-medium text-gray-800 dark:text-gray-200">
                {user.name}
              </td>
              <td className="p-3 text-gray-800 dark:text-gray-200">
                {editUserId === user._id ? (
                  <input
                    type="number"
                    value={creditUpdate[user._id] ?? user.credits}
                    onChange={(e) =>
                      handleCreditChange(user._id, e.target.value)
                    }
                    className="border px-2 py-1 rounded w-24 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  user.credits
                )}
              </td>
              <td className="p-3 text-gray-800 dark:text-gray-200">
                {user.savedCount}
              </td>
              <td className="p-3 text-gray-800 dark:text-gray-200">
                {user.reportCount}
              </td>
              <td className="p-3 text-gray-800 dark:text-gray-200">
                {user.activityLogs.length}
              </td>
              <td className="p-3 w-52">
                <div className="flex flex-wrap gap-2 items-center">
                  {editUserId === user._id ? (
                    <>
                      <button
                        onClick={() => handleCreditSubmit(user._id)}
                        className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
                        title="Save"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => setEditUserId(null)}
                        className="bg-gray-400 text-white px-3 py-1 text-sm rounded hover:bg-gray-500"
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditUserId(user._id)}
                      className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (editUserId !== user._id) setSelectedUser(user);
                    }}
                    disabled={editUserId === user._id}
                    className={`px-3 py-1 text-sm rounded ${
                      editUserId === user._id
                        ? "bg-indigo-600 text-white opacity-50 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                    title="View Logs Activity"
                  >
                    <FaEye />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for viewing logs */}
      {selectedUser && (
        <Modal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default UserTable;
