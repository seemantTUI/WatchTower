import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

const AddMetric = ({ metricName = '', value = '' }) => {
  const [metricNameInput, setMetricName] = useState(metricName);
  const [valueInput, setValue] = useState(value);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the id from the URL params

  useEffect(() => {
    if (id) {
      // Fetch the existing metric data
      const fetchMetric = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/v1/metrics/${id}`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
          });
          if (response.ok) {
            const data = await response.json();
            setMetricName(data.metricName || '');
            setValue(data.value || '');
          } else {
            console.error('Failed to fetch metric:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching metric:', error.message);
        }
      };
      fetchMetric();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const metricData = {
      metricName: metricNameInput,
      value: valueInput,
    };
    const url = id
      ? `http://localhost:4000/api/v1/metrics/${id}` // If updating, use PUT request
      : 'http://localhost:4000/api/v1/metrics'; // If creating new, use POST request
    const method = id ? 'PUT' : 'POST'; // Determine whether to update or create

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(metricData),
      });

      if (response.ok) {
        setError(null);
        setMetricName('');
        setValue('');
        console.log(id ? 'Metric updated' : 'Metric added');
        navigate('/metrics'); // Redirect to /metrics after successful submission
      } else {
        const res = await response.json();
        setError(res.error || 'Failed to save the metric');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
      <div className="metric-form container">
      <div className="row justify-content-left">
      <div className="col-md-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="metricName" className="form-label">Metric Name</label>
          <input
            type="text"
            className="form-control"
            id="metricName"
            placeholder="Enter metric name"
            required
            value={metricNameInput}
            onChange={(e) => setMetricName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="value" className="form-label">Value</label>
          <input
            type="number"
            className="form-control"
            id="value"
            placeholder="Enter metric value"
            required
            value={valueInput}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mb-2">
          <i className={`bi ${id ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i> {/* Save or Update Icon */}
          {id ? 'Update' : 'Save'}
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
      </div>
      </div>
    </div>
  );
};

export default AddMetric;
