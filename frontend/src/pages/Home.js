import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
    BarElement,
    LineElement,
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    PointElement
);

const Home = () => {
  const [summary, setSummary] = useState({ rules: 0, notifications: 0 });
  const [latestNotifications, setLatestNotifications] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [reportType, setReportType] = useState('weekly');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [rulesRes, notificationsRes] = await Promise.all([
          fetch('http://localhost:4000/api/v1/rules/'),
          fetch('http://localhost:4000/api/v1/notifications/'),
        ]);

        const rulesData = await rulesRes.json();
        const notificationsData = await notificationsRes.json();

        setSummary({
          rules: rulesData.rules.count || 0,
          notifications: notificationsData.notifications.count || 0,
        });

        setLatestNotifications(notificationsData.notifications.items.slice(0, 5));
      } catch (error) {
        console.error('Error fetching summary data:', error.message);
      }
    };

    fetchSummary();
  }, []);

  const chartData = {
    labels: ['Rules', 'Notifications'],
    datasets: [
      {
        label: `System Overview (${reportType})`,
        data: [summary.rules, summary.notifications],
        backgroundColor: ['#0d6efd', '#ffc107'],
        borderColor: ['#0d6efd', '#ffc107'],
        borderWidth: 1,
      },
    ],
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} />;
      case 'line':
        return <Line data={chartData} />;
      case 'pie':
        return <Pie data={chartData} />;
      default:
        return null;
    }
  };

  return (
      <div className="container-fluid">
        <h2 className="my-4">Dashboard</h2>

        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card bg-white text-dark shadow-sm">
              <div className="card-header fw-semibold">Rules</div>
              <div className="card-body">
                <h5 className="card-title">{summary.rules}</h5>
                <p className="card-text">Total rules defined in the system.</p>
                <button className="btn btn-outline-dark" onClick={() => navigate('/rules')}>
                  View Rules
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card bg-white text-dark shadow-sm">
              <div className="card-header fw-semibold">Notifications</div>
              <div className="card-body">
                <h5 className="card-title">{summary.notifications}</h5>
                <p className="card-text">Total system notifications triggered.</p>
                <button className="btn btn-outline-dark" onClick={() => navigate('/notifications')}>
                  View Notifications
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart & Notifications */}
        <div className="row">
          {/* Chart Section */}
          <div className="col-md-8">
            <div className="card mb-4 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">System Data Chart</h5>
                <div className="d-flex gap-2">
                  <select
                      className="form-select"
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                  >
                    <option value="bar">Bar</option>
                    <option value="line">Line</option>
                    <option value="pie">Pie</option>
                  </select>
                  <select
                      className="form-select"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div className="card-body">{renderChart()}</div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="col-md-4">
            <div className="card bg-body-secondary shadow-sm">
              <div className="card-header fw-semibold">
                Latest Notifications
              </div>
              <ul className="list-group list-group-flush">
                {latestNotifications.length > 0 ? (
                    latestNotifications.map((notification) => (
                        <li
                            key={notification._id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>{notification.message}</span>
                          <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                  navigate(`/rules/${notification.ruleId._id}?view_only=true`)
                              }
                          >
                            View
                          </button>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No recent notifications</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Home;
