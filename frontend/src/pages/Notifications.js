import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/notifications/');
        if (response.ok) {
          const json = await response.json();
          setNotifications(json.notifications.items);
        } else {
          console.error('Failed to fetch notifications:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      }
    };
    fetchNotifications();
  }, []);

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedNotifications = [...notifications].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setNotifications(sortedNotifications);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  return (
    <div className="display-notifications container">
      <div className="d-flex justify-content-between align-items-center my-3">
        <h2>Notifications</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/notifications/create')}
        >
          <i className="bi bi-plus-circle mb-2"></i> {/* Add Notification Icon */}
          Add Notification
        </button>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th
              scope="col"
              onClick={() => sortData('index')}
              style={{ cursor: 'pointer' }}
            >
              # {getSortIndicator('index')}
            </th>
            <th
              scope="col"
              onClick={() => sortData('message')}
              style={{ cursor: 'pointer' }}
            >
              Message {getSortIndicator('message')}
            </th>
            <th
              scope="col"
              onClick={() => sortData('ruleId.ruleName')}
              style={{ cursor: 'pointer' }}
            >
              Associated Rule {getSortIndicator('ruleId.ruleName')}
            </th>
            <th
              scope="col"
              onClick={() => sortData('createdAt')}
              style={{ cursor: 'pointer' }}
            >
              Sent At {getSortIndicator('createdAt')}
            </th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification, index) => (
            <tr key={notification._id}>
              <th scope="row">{index + 1}</th>
              <td>{notification.message}</td>
              <td>
                {notification.ruleId ? (
                  <a
                    href={`/rules/${notification.ruleId._id}?view_only=true`}
                    className="text-primary text-decoration-none"
                  >
                    {notification.ruleId.ruleName}
                  </a>
                ) : (
                  'No Associated Rule'
                )}
              </td>
              <td>{formatDateTime(notification.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Notifications;
