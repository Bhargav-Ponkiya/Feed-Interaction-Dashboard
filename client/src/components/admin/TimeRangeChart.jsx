import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const TimeRangeChart = ({ data }) => {
  return (
    <div className="w-full h-[350px] bg-white dark:bg-gray-800 rounded shadow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="label" stroke="#a0a0a0" />
          <YAxis stroke="#a0a0a0" />
          <Tooltip
            formatter={(value, name) => {
              switch (name) {
                case "saves":
                  return [value, "Saved Posts"];
                case "reports":
                  return [value, "Reported Posts"];
                case "users":
                  return [value, "New Users"];
                default:
                  return [value, name];
              }
            }}
          />
          <Legend />
          <Bar dataKey="saves" fill="#3B82F6" name="Saved Posts" />
          <Bar dataKey="reports" fill="#EF4444" name="Reported Posts" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeRangeChart;
