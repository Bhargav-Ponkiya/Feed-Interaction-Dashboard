const StatsCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">
      {title}
    </h3>
    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
      {value}
    </p>
  </div>
);

export default StatsCard;
