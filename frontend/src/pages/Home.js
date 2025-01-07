import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Home = () => {
  const [summary, setSummary] = useState({
    rules: 0,
    metrics: 0,
    notifications: 0,
  });
  const [latestNotifications, setLatestNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [rulesRes, metricsRes, notificationsRes] = await Promise.all([
          fetch('http://localhost:4000/api/v1/rules/'),
          fetch('http://localhost:4000/api/v1/metrics/'),
          fetch('http://localhost:4000/api/v1/notifications/'),
        ]);

        const rulesData = await rulesRes.json();
        const metricsData = await metricsRes.json();
        const notificationsData = await notificationsRes.json();

        setSummary({
          rules: rulesData.rules.count || 0,
          metrics: metricsData.metrics.count || 0,
          notifications: notificationsData.notifications.count || 0,
        });

        setLatestNotifications(notificationsData.notifications.items.slice(0, 5));
      } catch (error) {
        console.error('Error fetching summary data:', error.message);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="d-flex">
      <div className="home container" style={{ marginLeft: '260px' }}> {/* Adjust for Sidebar */}
        <h1 className="my-4">Dashboard</h1>

        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card text-bg-primary mb-3">
              <div className="card-header">Rules</div>
              <div className="card-body">
                <h5 className="card-title">{summary.rules}</h5>
                <p className="card-text">Total active rules in the system.</p>
                <button
                  className="btn btn-light"
                  onClick={() => navigate('/rules')}
                >
                  View Rules
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-bg-success mb-3">
              <div className="card-header">Metrics</div>
              <div className="card-body">
                <h5 className="card-title">{summary.metrics}</h5>
                <p className="card-text">Total metrics being monitored.</p>
                <button
                  className="btn btn-light"
                  onClick={() => navigate('/metrics')}
                >
                  View Metrics
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-bg-warning mb-3">
              <div className="card-header">Notifications</div>
              <div className="card-body">
                <h5 className="card-title">{summary.notifications}</h5>
                <p className="card-text">Total notifications generated.</p>
                <button
                  className="btn btn-light"
                  onClick={() => navigate('/notifications')}
                >
                  View Notifications
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="latest-activity">
          <h2>Latest Notifications</h2>
          <ul className="list-group">
            {latestNotifications.length > 0 ? (
              latestNotifications.map((notification) => (
                <li
                  key={notification._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{notification.message}</span>
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() =>
                      navigate(`/rules/${notification.ruleId._id}?view_only=true`)
                    }
                  >
                    View Rule
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
  );
};

export default Home;
