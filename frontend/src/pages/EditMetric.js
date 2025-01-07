import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import AddMetric from './AddMetrics';

const EditMetric = () => {
  const [metric, setMetric] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchMetric = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/metrics/${id}`);
        const json = await response.json();

        if (response.ok) {
          console.log(json);
          setMetric(json); // Set the fetched metric
        } else {
          console.error('Failed to fetch metric:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching metric:', error.message);
      }
    };

    fetchMetric();
  }, [id]);

  return (
    <div className="metric-details">
      {metric && (
        <AddMetric metricName={metric.metricName} value={metric.value} />
      )}
    </div>
  );
};

export default EditMetric;
