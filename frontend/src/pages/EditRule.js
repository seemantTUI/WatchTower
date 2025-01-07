import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import AddRules from './AddRules';

const EditRules = () => {
    const [rule, setRule] = useState(null)
            const { id } = useParams()
                useEffect(() => {
                    const fetchRule = async () => {
                    const response = await fetch('http://localhost:4000/api/v1/rules/'+id)
                    const json = await response.json()
                
                    if (response.ok) {
                        console.log(json)
                        setRule(json)
                    }
                    }
                
                    fetchRule()
                }, [])
                return (
                    <div className="rule-details">
                    {rule && (
                        <AddRules ruleName={rule.ruleName} ruleDesc={rule.ruleDesc} metric={rule.metric} threshold={rule.threshold} condition={rule.condition} channel={rule.notificationChannel}/>
                    )}
                    </div>
                );
}
 
export default EditRules;