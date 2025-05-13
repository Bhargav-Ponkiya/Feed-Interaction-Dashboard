import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
  getUserDashboard,
  fetchFeed,
  savePost,
  sharePost,
  reportPost,
} from "../utils/api";
import UserInfo from "./../components/UserInfo";
import FeedPostItem from "./../components/FeedPostItem";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportReasons, setReportReasons] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, feedRes] = await Promise.all([
          getUserDashboard(),
          fetchFeed(),
        ]);
        setDashboardData(dashboardRes.data);
        setFeedPosts(feedRes.data.posts);
      } catch (error) {
        console.error("Error fetching dashboard data or feed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Separate function for refreshing dashboard after interactions
  const refreshDashboard = async () => {
    try {
      const dashboardRes = await getUserDashboard();
      setDashboardData(dashboardRes.data);
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    }
  };

  const handleSave = async (post) => {
    try {
      await savePost({
        postId: post.postId,
        source: post.platform,
        content: post.content,
        url: post.url,
      });
      toast.success("Post saved! Credits awarded.");
      await refreshDashboard(); // Refresh credits after saving
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed.");
    }
  };

  const handleShare = async (post) => {
    try {
      await sharePost({ postId: post.postId, platform: post.platform });
      await navigator.clipboard.writeText(post.url);
      toast.success("Link copied and post shared.");
      await refreshDashboard(); // Refresh credits after sharing
    } catch (err) {
      toast.error("Share failed.");
    }
  };

  const handleReport = async (post) => {
    const reason = reportReasons[post.postId];
    if (!reason) return toast.error("Please enter a reason.");

    try {
      await reportPost({ postId: post.postId, reason, source: post.platform });
      toast.success("Reported successfully.");
      await refreshDashboard(); // Refresh credits after reporting
      setReportReasons((prev) => ({ ...prev, [post.postId]: "" }));
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Report failed. Please try again.";
      toast.error(errMsg);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-lg text-gray-800 dark:text-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-900 dark:text-gray-100 dark:bg-gray-800">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">
        👋 Welcome to Your Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <UserInfo dashboardData={dashboardData} />
        </div>

        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">
              📰 Your Personalized Feed
            </h2>

            {feedPosts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No posts available at the moment.
              </p>
            ) : (
              <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                {feedPosts.map((post) => (
                  <FeedPostItem
                    key={post.postId}
                    post={post}
                    handleSave={handleSave}
                    handleShare={handleShare}
                    handleReport={handleReport}
                    reportReasons={reportReasons}
                    setReportReasons={setReportReasons}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
