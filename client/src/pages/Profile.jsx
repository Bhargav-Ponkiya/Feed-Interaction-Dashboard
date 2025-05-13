import { useState, useEffect } from "react";
import { updateProfile, getCurrentUser } from "../utils/api";
import toast from "react-hot-toast";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    bio: "",
    socialLinks: "",
  });
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await getCurrentUser();
      const user = response.data.user;

      const formattedUser = {
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        socialLinks: user.socialLinks || "",
      };

      setUserData(formattedUser);
      setInitialData(formattedUser); // Save original data
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  // Compare current and initial userData
  const isDataChanged = () => {
    if (!initialData) return false;
    return (
      userData.name !== initialData.name ||
      userData.email !== initialData.email ||
      userData.bio !== initialData.bio ||
      userData.socialLinks !== initialData.socialLinks
    );
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(userData);
      toast.success("Profile updated successfully!");
      setInitialData(userData); // Update initial data to disable button
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-xl text-gray-700 dark:text-gray-300">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        Edit Your Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 dark:text-gray-300"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 dark:text-gray-300"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <textarea
            rows={4}
            value={userData.bio}
            onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 dark:text-gray-300"
            placeholder="Tell us about yourself"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Social Links
          </label>
          <input
            type="text"
            value={userData.socialLinks}
            onChange={(e) =>
              setUserData({ ...userData, socialLinks: e.target.value })
            }
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 dark:text-gray-300"
            placeholder="e.g., https://linkedin.com/in/username"
          />
        </div>

        <button
          type="submit"
          disabled={!isDataChanged()}
          className={`w-full font-semibold py-3 rounded-lg transition duration-200 ${
            isDataChanged()
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
