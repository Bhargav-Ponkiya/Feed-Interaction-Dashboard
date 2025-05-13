import { useEffect, useState } from "react";
import { fetchSystemAnalytics, fetchTimeAnalytics } from "../utils/api";
import StatsCard from "../components/admin/StatsCard";
import UserTable from "../components/admin/UserTable";
import TimeRangeChart from "../components/admin/TimeRangeChart";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [systemStats, setSystemStats] = useState(null);
  const [timeAnalytics, setTimeAnalytics] = useState([]);
  const [timeRange, setTimeRange] = useState("weeks");
  const [activeTab, setActiveTab] = useState("analytics");
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    try {
      const systemRes = await fetchSystemAnalytics();
      const timeRes = await fetchTimeAnalytics(timeRange);

      const { savedData = [], reportData = [], userData = [] } = timeRes.data;

      const mergedMap = new Map();

      // Helper to get label like "Week 19", "Month 5", "Year 2025"
      const getLabel = (item) => {
        if (item._id.week) return `Week ${item._id.week}`;
        if (item._id.month) return `Month ${item._id.month}`;
        return `Year ${item._id.year}`;
      };

      // Combine all into a single map by label
      for (const entry of savedData) {
        const label = getLabel(entry);
        if (!mergedMap.has(label)) mergedMap.set(label, {});
        mergedMap.get(label).saves = entry.count;
      }

      for (const entry of reportData) {
        const label = getLabel(entry);
        if (!mergedMap.has(label)) mergedMap.set(label, {});
        mergedMap.get(label).reports = entry.count;
      }

      for (const entry of userData) {
        const label = getLabel(entry);
        if (!mergedMap.has(label)) mergedMap.set(label, {});
        mergedMap.get(label).users = entry.count;
      }

      // Convert map to array with default 0s
      const normalized = Array.from(mergedMap.entries()).map(
        ([label, { saves = 0, reports = 0, users = 0 }]) => ({
          label,
          saves,
          reports,
          users,
        })
      );

      setSystemStats(systemRes.data);
      setTimeAnalytics(normalized);
    } catch (err) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "analytics") {
      setLoading(true);
      fetchAnalyticsData();
    }
  }, [activeTab, timeRange]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg text-gray-800 dark:text-gray-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-900 dark:text-gray-100 dark:bg-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {["analytics", "users"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded font-medium transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            {tab === "analytics" ? "Analytics" : "Users & Credits"}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {systemStats && (
              <>
                <StatsCard title="Total Users" value={systemStats.totalUsers} />
                <StatsCard title="Saved Posts" value={systemStats.totalSaved} />
                <StatsCard
                  title="Reported Posts"
                  value={systemStats.totalReports}
                />
              </>
            )}
          </div>

          <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-xl font-semibold dark:text-white">
              Interaction Trend
            </h2>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded bg-white dark:bg-gray-800 shadow text-sm dark:text-white"
            >
              <option value="weeks">Last 6 Weeks</option>
              <option value="months">Last 6 Months</option>
              <option value="years">Last 6 Years</option>
            </select>
          </div>

          <TimeRangeChart data={timeAnalytics} range={timeRange} />
        </>
      )}

      {/* Users Tab */}
      {activeTab === "users" && <UserTable />}
    </div>
  );
};

export default AdminDashboard;
