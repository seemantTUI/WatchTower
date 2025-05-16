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
  const [retriggerDays, setRetriggerDays] = useState(0);
  const [retriggerHours, setRetriggerHours] = useState(0);
  const [retriggerMinutes, setRetriggerMinutes] = useState(30);
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isViewOnly = searchParams.get('view_only') === 'true';

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/metrics/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
          const data = await response.json();
          setMetrics(data.metrics.items || []);
        } else {
          console.error('Failed to fetch metrics:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error.message);
      }
    };
    fetchMetrics();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchRule = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/v1/rules/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          if (response.ok) {
            const data = await response.json();
            setRuleName(data.ruleName || '');
            setRuleDesc(data.ruleDescription || '');
            setMetric(data.metric?._id || '');
            setThreshold(data.threshold || '');
            setCondition(data.condition || '');
            setChannel(data.notificationChannel || '');
            setAlertMessage(data.alertMessage || `Alert! ${data.ruleName} has been reached.`);

            // Parse retriggerAfter
            const match = (data.retriggerAfter || '').match(/(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?/);
            if (match) {
              setRetriggerDays(Number(match[1] || 0));
              setRetriggerHours(Number(match[2] || 0));
              setRetriggerMinutes(Number(match[3] || 0));
            }
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

  const buildRetriggerAfter = () => {
    const days = Number(retriggerDays);
    const hours = Number(retriggerHours);
    const minutes = Number(retriggerMinutes);

    if (days === 0 && hours === 0 && minutes === 0) {
      return '30m'; // ⏱️ Default to 30 minutes if nothing set
    }

    let result = '';
    if (days > 0) result += `${days}d`;
    if (hours > 0) result += `${hours}h`;
    if (minutes > 0) result += `${minutes}m`;
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const retriggerAfter = buildRetriggerAfter();

    const ruleData = {
      ruleName: ruleNameInput,
      ruleDescription: ruleDescInput,
      metric: associatedMetricInput,
      threshold: thresholdInput,
      condition: conditionInput,
      notificationChannel: notificationChannelInput,
      alertMessage: alertMessageInput,
      retriggerAfter,
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
          Authorization: `Bearer ${localStorage.getItem('token')}`
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
        setRetriggerDays(0);
        setRetriggerHours(0);
        setRetriggerMinutes(0);
        console.log(id ? 'Rule updated' : 'Rule added');
        navigate('/rules');
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
        <div className="row justify-content-left">
          <div className="col-md-6">
            <br />
            <form onSubmit={!isViewOnly ? handleSubmit : (e) => e.preventDefault()}>
              <div className="mb-3">
                <label htmlFor="ruleName" className="form-label">Rule Name</label>
                <input type="text" className="form-control" id="ruleName" required value={ruleNameInput}
                       onChange={(e) => setRuleName(e.target.value)} disabled={isViewOnly}/>
              </div>

              <div className="mb-3">
                <label htmlFor="ruleDesc" className="form-label">Rule Description</label>
                <textarea className="form-control" id="ruleDesc" required value={ruleDescInput}
                          onChange={(e) => setRuleDesc(e.target.value)} disabled={isViewOnly}></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="metric" className="form-label">Metric</label>
                {isViewOnly ? (
                    <p>
                      <a href={`/metrics/${associatedMetricInput}`} className="text-primary text-decoration-none">
                        {metrics.find((metric) => metric._id === associatedMetricInput)?.metricName || "Metric not found"}
                      </a>
                    </p>
                ) : (
                    <select className="form-control" id="metric" required value={associatedMetricInput}
                            onChange={(e) => setMetric(e.target.value)}>
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
                <input type="number" className="form-control" id="threshold" required value={thresholdInput}
                       onChange={(e) => setThreshold(e.target.value)} disabled={isViewOnly}/>
              </div>

              <div className="mb-3">
                <label htmlFor="condition" className="form-label">Condition</label>
                <select className="form-control" id="condition" required value={conditionInput}
                        onChange={(e) => setCondition(e.target.value)} disabled={isViewOnly}>
                  <option value="">Select condition</option>
                  <option value="greater">Greater</option>
                  <option value="less">Less</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="alertMessage" className="form-label">Alert Message</label>
                <textarea className="form-control" id="alertMessage" required value={alertMessageInput}
                          onChange={(e) => setAlertMessage(e.target.value)} disabled={isViewOnly}></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="notificationChannel" className="form-label">Notification Channel</label>
                <select className="form-control" id="notificationChannel" required value={notificationChannelInput}
                        onChange={(e) => setChannel(e.target.value)} disabled={isViewOnly}>
                  <option value="">Select channel</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="webhook">Webhook</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Retrigger After</label>
                <div className="d-flex gap-2 align-items-center">
                  <input type="number" min="0" className="form-control" value={retriggerDays}
                         onChange={(e) => setRetriggerDays(e.target.value)} disabled={isViewOnly}/>
                  <span>Days</span>
                  <input type="number" min="0" className="form-control" value={retriggerHours}
                         onChange={(e) => setRetriggerHours(e.target.value)} disabled={isViewOnly}/>
                  <span>Hours</span>
                  <input type="number" min="0" className="form-control" value={retriggerMinutes}
                         onChange={(e) => setRetriggerMinutes(e.target.value)} disabled={isViewOnly}/>
                  <span>Minutes</span>
                </div>
              </div>


              <div className="d-flex gap-2">
                {!isViewOnly && (
                    <button type="submit" className="btn btn-primary mb-2">
                      <i className={`bi ${id ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                      {id ? 'Update' : 'Save'}
                    </button>
                )}
                <button
                    type="button"
                    className="btn btn-secondary mb-2"
                    onClick={() => navigate('/home')}
                >
                  Cancel
                </button>
              </div>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
          </div>
        </div>
      </div>
  );
};

export default AddRules;
