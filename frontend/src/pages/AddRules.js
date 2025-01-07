import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const AddRules = ({
  ruleName = '',
  ruleDesc = '',
  metric = '',
  threshold = '',
  condition = '',
  notificationChannel = '',
}) => {
  const [ruleNameInput, setRuleName] = useState(ruleName);
  const [ruleDescInput, setRuleDesc] = useState(ruleDesc);
  const [associatedMetricInput, setMetric] = useState(metric);
  const [thresholdInput, setThreshold] = useState(threshold);
  const [conditionInput, setCondition] = useState(condition);
  const [notificationChannelInput, setChannel] = useState(notificationChannel);
  const [alertMessageInput, setAlertMessage] = useState('');
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams(); // For accessing query parameters
  const isViewOnly = searchParams.get('view_only') === 'true'; // Compare with 'true' as a string

  // Fetch available metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/metrics/');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data.metrics.items || []); // Correctly access metrics from response
        } else {
          console.error('Failed to fetch metrics:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error.message);
      }
    };

    fetchMetrics();
  }, []);

  // Fetch existing rule data if `id` is provided
  useEffect(() => {
    if (id) {
      const fetchRule = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/v1/rules/${id}`);
          if (response.ok) {
            const data = await response.json();
            setRuleName(data.ruleName || '');
            setRuleDesc(data.ruleDescription || '');
            setMetric(data.metric?._id || '');
            setThreshold(data.threshold || '');
            setCondition(data.condition || '');
            setChannel(data.notificationChannel || '');
            setAlertMessage(data.alertMessage || `Alert! ${data.ruleName} has been reached.`);
          } else {
            console.error('Failed to fetch rule:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching rule:', error.message);
        }
      };
      fetchRule();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ruleData = {
      ruleName: ruleNameInput,
      ruleDescription: ruleDescInput,
      metric: associatedMetricInput,
      threshold: thresholdInput,
      condition: conditionInput,
      notificationChannel: notificationChannelInput,
      alertMessage: alertMessageInput,
    };

    const url = id
      ? `http://localhost:4000/api/v1/rules/${id}`
      : 'http://localhost:4000/api/v1/rules';
    const method = id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ruleData),
      });

      if (response.ok) {
        setError(null);
        setRuleName('');
        setRuleDesc('');
        setMetric('');
        setThreshold('');
        setCondition('');
        setChannel('');
        setAlertMessage('');
        console.log(id ? 'Rule updated' : 'Rule added');
        navigate('/rules'); // Redirect to /rules after successful submission
      } else {
        const res = await response.json();
        setError(res.error || 'Failed to save the rule');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="rule-form container">
      <div className="row justify-content-left"> {/* Center the form */}
        <div className="col-md-6"> {/* Adjust the width */}
          <h2>{isViewOnly ? 'View Rule' : id ? 'Edit Rule' : 'Create Rule'}</h2>
          <br />
          <form onSubmit={!isViewOnly ? handleSubmit : (e) => e.preventDefault()}>
            <div className="mb-3">
              <label htmlFor="ruleName" className="form-label">Rule Name</label>
              <input
                type="text"
                className="form-control"
                id="ruleName"
                placeholder="Enter rule name"
                required
                value={ruleNameInput}
                onChange={(e) => setRuleName(e.target.value)}
                disabled={isViewOnly} // Disable in view-only mode
              />
            </div>
            <div className="mb-3">
              <label htmlFor="ruleDesc" className="form-label">Rule Description</label>
              <textarea
                className="form-control"
                id="ruleDesc"
                placeholder="Enter rule description"
                required
                value={ruleDescInput}
                onChange={(e) => setRuleDesc(e.target.value)}
                disabled={isViewOnly} // Disable in view-only mode
              ></textarea>
            </div>
                          <div className="mb-3">
                <label htmlFor="metric" className="form-label">Metric</label>
                {isViewOnly ? (
                  // If in view-only mode, render the metric name as a link
                  <p>
                    <a 
                      href={`/metrics/${associatedMetricInput}`} 
                      className="text-primary text-decoration-none"
                    >
                      {metrics.find((metric) => metric._id === associatedMetricInput)?.metricName || "Metric not found"}
                    </a>
                  </p>
                ) : (
                  // If not in view-only mode, render the dropdown
                  <select
                    className="form-control"
                    id="metric"
                    required
                    value={associatedMetricInput}
                    onChange={(e) => setMetric(e.target.value)}
                  >
                    <option value="">Select a metric</option>
                    {metrics.map((metric) => (
                      <option key={metric._id} value={metric._id}>
                        {metric.metricName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

            <div className="mb-3">
              <label htmlFor="threshold" className="form-label">Threshold</label>
              <input
                type="number"
                className="form-control"
                id="threshold"
                placeholder="Enter threshold"
                required
                value={thresholdInput}
                onChange={(e) => setThreshold(e.target.value)}
                disabled={isViewOnly} // Disable in view-only mode
              />
            </div>
            <div className="mb-3">
              <label htmlFor="condition" className="form-label">Condition</label>
              <select
                className="form-control"
                id="condition"
                required
                value={conditionInput}
                onChange={(e) => setCondition(e.target.value)}
                disabled={isViewOnly} // Disable in view-only mode
              >
                <option value="">Select condition</option>
                <option value="greater">Greater</option>
                <option value="less">Less</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="alertMessage" className="form-label">Alert Message</label>
              <textarea
                className="form-control"
                id="alertMessage"
                required
                value={alertMessageInput}
                onChange={(e) => setAlertMessage(e.target.value)}
                disabled={isViewOnly} // Disable in view-only mode
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="notificationChannel" className="form-label">Notification Channel</label>
              <select
                className="form-control"
                id="notificationChannel"
                required
                value={notificationChannelInput}
                onChange={(e) => setChannel(e.target.value)}
                disabled={isViewOnly} // Disable in view-only mode
              >
                <option value="">Select channel</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>
            {!isViewOnly && (
              <button type="submit" className="btn btn-primary mb-2">
                <i className={`bi ${id ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                {id ? 'Update' : 'Save'}
              </button>
            )}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRules;
