import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Rules = () => {
  const [rules, setRules] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/rules/');
        if (response.ok) {
          const json = await response.json(); // Parse JSON
          setRules(json.rules.items); // Access the `items` array
        } else {
          console.error('Failed to fetch rules:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching rules:', error.message);
      }
    };
    fetchRules();
  }, []);

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
      });

      if (response.ok) {
        setRules((prevRules) => prevRules.filter((rule) => rule._id !== id)); // Update state to remove the deleted rule
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
        <h2>Rules</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/rules/create')}
        >
          <i className="bi bi-plus-circle mb-2"></i> {/* Add Rule Icon */}
          Add Rule
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
              onClick={() => sortData('ruleName')}
              style={{ cursor: 'pointer' }}
            >
              Rule Name {getSortIndicator('ruleName')}
            </th>
            <th
              scope="col"
              onClick={() => sortData('metric.metricName')}
              style={{ cursor: 'pointer' }}
            >
              Associated Metric {getSortIndicator('metric.metricName')}
            </th>
            <th
              scope="col"
              onClick={() => sortData('threshold')}
              style={{ cursor: 'pointer' }}
            >
              Threshold {getSortIndicator('threshold')}
            </th>
            <th
              scope="col"
              onClick={() => sortData('condition')}
              style={{ cursor: 'pointer' }}
            >
              Condition {getSortIndicator('condition')}
            </th>
            <th
              scope="col"
              onClick={() => sortData('notificationChannel')}
              style={{ cursor: 'pointer' }}
            >
              Notification {getSortIndicator('notificationChannel')}
            </th>
            <th scope="col">Actions</th>
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
              <td>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => navigate(`/rules/${rule._id}`)}
                >
                  <i className="bi bi-eye"></i> {/* View Icon */}
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDelete(rule._id)}
                >
                  <i className="bi bi-trash"></i> {/* Delete Icon */}
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
