import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Rules = () => {
  const [rules, setRules] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/rules/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const json = await response.json();
          setRules(json.rules.items);
        } else {
          console.error('Failed to fetch rules:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching rules:', error.message);
      }
    };
    fetchRules();
  }, []);

  const handleArm = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/rules/${id}/arm`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRules((prev) =>
            prev.map((rule) => (rule._id === id ? { ...rule, isArmed: true } : rule))
        );
        console.log('Rule armed successfully');
      } else {
        console.error('Failed to arm rule:', response.statusText);
      }
    } catch (error) {
      console.error('Error arming rule:', error.message);
    }
  };

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedRules = [...rules].sort((a, b) => {
      const aValue = key.split('.').reduce((acc, part) => acc && acc[part], a);
      const bValue = key.split('.').reduce((acc, part) => acc && acc[part], b);

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setRules(sortedRules);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/rules/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setRules((prevRules) => prevRules.filter((rule) => rule._id !== id));
        console.log('Rule deleted successfully');
      } else {
        console.error('Failed to delete rule:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting rule:', error.message);
    }
  };

  return (
      <div className="display-rules container">
        <div className="d-flex justify-content-between align-items-center my-3">
          <button
              className="btn btn-primary"
              onClick={() => navigate('/rules/create')}
          >
            <i className="bi bi-plus-circle mb-2"></i> Add Rule
          </button>
        </div>
        <table className="table table-striped table-bordered">
          <thead>
          <tr>
            <th onClick={() => sortData('index')} style={{ cursor: 'pointer' }}>
              # {getSortIndicator('index')}
            </th>
            <th onClick={() => sortData('ruleName')} style={{ cursor: 'pointer' }}>
              Rule Name {getSortIndicator('ruleName')}
            </th>
            <th onClick={() => sortData('metric.metricName')} style={{ cursor: 'pointer' }}>
              Associated Metric {getSortIndicator('metric.metricName')}
            </th>
            <th onClick={() => sortData('threshold')} style={{ cursor: 'pointer' }}>
              Threshold {getSortIndicator('threshold')}
            </th>
            <th onClick={() => sortData('condition')} style={{ cursor: 'pointer' }}>
              Condition {getSortIndicator('condition')}
            </th>
            <th onClick={() => sortData('notificationChannel')} style={{ cursor: 'pointer' }}>
              Notification {getSortIndicator('notificationChannel')}
            </th>
            <th>Retrigger After</th>
            <th>Notification Count</th>
            <th>Arm</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {rules.map((rule, index) => (
              <tr key={rule._id}>
                <th scope="row">{index + 1}</th>
                <td>{rule.ruleName}</td>
                <td>
                  {rule.metric ? (
                      <a href={`/metrics/${rule.metric._id}`}>
                        {rule.metric.metricName}
                      </a>
                  ) : (
                      'No Metric'
                  )}
                </td>
                <td>{rule.threshold}</td>
                <td>{rule.condition}</td>
                <td>{rule.notificationChannel}</td>
                <td>{rule.retriggerAfter || '—'}</td>
                <td>
                  {rule.notifications ? (
                      <a href={`/notifications`}>
                        {rule.notifications.length}
                      </a>
                  ) : (
                      '0'
                  )}
                </td>
                <td>
                  {rule.isArmed ? (
                      <span className="text-success">Armed</span>
                  ) : (
                      <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleArm(rule._id)}
                      >
                        Re-arm
                      </button>
                  )}
                </td>
                <td>
                  <button
                      className="btn btn-light btn-sm"
                      onClick={() => navigate(`/rules/${rule._id}`)}
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDelete(rule._id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default Rules;
