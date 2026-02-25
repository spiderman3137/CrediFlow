import { TrendingUp, TrendingDown, PieChart, BarChart3, FileText } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const statsData = [
  { name: 'Approval Ratio', value: '78.5%', icon: TrendingUp, color: '#28C76F', change: '+3.2%' },
  { name: 'Default Rate', value: '2.4%', icon: TrendingDown, color: '#FF4D4F', change: '-0.5%' },
  { name: 'Avg Loan Size', value: '$12,450', icon: BarChart3, color: '#5B2DFF', change: '+$320' },
  { name: 'Revenue Growth', value: '22.1%', icon: TrendingUp, color: '#FFA940', change: '+4.8%' },
];

const approvalData = [
  { name: 'Approved', value: 1234, color: '#28C76F' },
  { name: 'Rejected', value: 342, color: '#FF4D4F' },
  { name: 'Pending', value: 156, color: '#FFA940' },
];

const revenueData = [
  { month: 'Jan', revenue: 850000, target: 800000 },
  { month: 'Feb', revenue: 920000, target: 850000 },
  { month: 'Mar', revenue: 1050000, target: 900000 },
  { month: 'Apr', revenue: 980000, target: 950000 },
  { month: 'May', revenue: 1150000, target: 1000000 },
  { month: 'Jun', revenue: 1200000, target: 1050000 },
];

const defaultsByCategory = [
  { category: 'Personal', defaults: 23, color: '#5B2DFF' },
  { category: 'Business', defaults: 18, color: '#8C6CFF' },
  { category: 'Education', defaults: 12, color: '#FFA940' },
  { category: 'Medical', defaults: 8, color: '#28C76F' },
  { category: 'Other', defaults: 6, color: '#FF4D4F' },
];

export function AnalystDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyst Dashboard</h1>
        <p className="text-gray-600">Platform analytics and performance metrics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card-sharp p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 flex items-center justify-center"
                  style={{ backgroundColor: stat.color + '20' }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <span
                  className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Analysis */}
        <div className="card-sharp p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Approval Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={approvalData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {approvalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {approvalData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="w-4 h-4 mx-auto mb-1" style={{ backgroundColor: item.color }}></div>
                <p className="text-xs text-gray-600">{item.name}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Default by Category */}
        <div className="card-sharp p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Defaults by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={defaultsByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="category" stroke="#6B6B6B" />
              <YAxis stroke="#6B6B6B" />
              <Tooltip />
              <Bar dataKey="defaults" fill="#FF4D4F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="card-sharp p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Revenue vs Target</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#5B2DFF]"></div>
              <span className="text-sm text-gray-600">Actual Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#FFA940]"></div>
              <span className="text-sm text-gray-600">Target</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="month" stroke="#6B6B6B" />
            <YAxis stroke="#6B6B6B" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#5B2DFF"
              strokeWidth={3}
              name="Actual Revenue"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#FFA940"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-sharp p-6 bg-green-50 border-2 border-green-200">
          <div className="w-12 h-12 bg-green-100 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Strong Growth</h3>
          <p className="text-sm text-gray-700 mb-2">
            Revenue exceeded target by 14.3% this quarter
          </p>
          <button className="text-sm text-green-700 font-semibold hover:text-green-800">
            View Details →
          </button>
        </div>

        <div className="card-sharp p-6 bg-orange-50 border-2 border-orange-200">
          <div className="w-12 h-12 bg-orange-100 flex items-center justify-center mb-4">
            <PieChart className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Approval Rate Stable</h3>
          <p className="text-sm text-gray-700 mb-2">
            Maintaining healthy 78.5% approval ratio
          </p>
          <button className="text-sm text-orange-700 font-semibold hover:text-orange-800">
            View Details →
          </button>
        </div>

        <div className="card-sharp p-6 bg-blue-50 border-2 border-blue-200">
          <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Low Default Rate</h3>
          <p className="text-sm text-gray-700 mb-2">
            Default rate decreased to 2.4% from 2.9%
          </p>
          <button className="text-sm text-blue-700 font-semibold hover:text-blue-800">
            View Details →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-sharp p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Export Reports</h3>
        <div className="flex flex-wrap gap-4">
          <button className="btn-primary">
            <FileText className="w-4 h-4 mr-2 inline" />
            Generate Monthly Report
          </button>
          <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50">
            Export to PDF
          </button>
          <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50">
            Export to CSV
          </button>
          <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50">
            Schedule Report
          </button>
        </div>
      </div>
    </div>
  );
}
