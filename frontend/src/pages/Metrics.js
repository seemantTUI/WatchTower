import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Metrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/metrics/',{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
        if (response.ok) {
          const json = await response.json(); // Parse JSON
          setMetrics(json.metrics.items); // Access the `items` array
        } else {
          console.error('Failed to fetch metrics:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error.message);
      }
    };
    fetchMetrics();
  }, []);

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedMetrics = [...metrics].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setMetrics(sortedMetrics);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/metrics/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (response.ok) {
        setMetrics((prevMetrics) =>
          prevMetrics.filter((metric) => metric._id !== id)
        ); // Update state to remove the deleted metric
        console.log('Metric deleted successfully');
      } else {
        console.error('Failed to delete metric:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting metric:', error.message);
    }
  };

  return (
    <div className="display-metrics container">
      <div className="d-flex justify-content-between align-items-center my-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate('/metrics/create')}
        >
          <i className="bi bi-plus-circle mb-2"></i> {/* Add Metric Icon */}
          Add Metric
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
              onClick={() => sortData('metricName')}
              style={{ cursor: 'pointer' }}
            >
              Metric Name {getSortIndicator('metricName')}
            </th>
            <th
              scope="col"
              onClick={() => sortData('value')}
              style={{ cursor: 'pointer' }}
            >
              Value {getSortIndicator('value')}
            </th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, index) => (
            <tr key={metric._id}>
              <th scope="row">{index + 1}</th>
              <td>{metric.metricName}</td>
              <td>{metric.value}</td>
              <td>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => navigate(`/metrics/${metric._id}`)}
                >
                  <i className="bi bi-eye"></i> {/* View Icon */}
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDelete(metric._id)}
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

export default Metrics;
