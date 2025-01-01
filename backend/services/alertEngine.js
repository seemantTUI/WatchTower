const Rule = require('../models/ruleModel');
const Metric = require('../models/metricModel');
const Notification = require('../models/notificationModel');
const { triggerNotification } = require('./notificationService');

const evaluateRules = async () => {
    console.log("Starting rule evaluation...");
  
    try {
      const rules = await Rule.find();
      const metrics = await Metric.find();
  
      for (const rule of rules) {
        try {
          const metric = metrics.find((m) => m.metricName === rule.metricName);
          if (!metric) continue;

            const breach =
            (rule.condition === "greater" && metric.value > rule.threshold) ||
            (rule.condition === "less" && metric.value < rule.threshold);
  
          if (breach) {
            const existingNotification = await Notification.findOne({ ruleId: rule._id });
            if (existingNotification) {
              console.log(`Notification already sent for rule: ${rule.ruleName}`);
              continue;
            }
  
            const notification = new Notification({
              ruleId: rule._id,
              message: `Alert! ${rule.metricName} breached the threshold.`,
            });
  
            await notification.save();
  
            await triggerNotification(rule, notification.message);
            console.log(`Notification triggered for rule: ${rule.ruleName}`);
          }
        } catch (innerError) {
          console.error(
            `Error while evaluating rule: ${rule.ruleName} (ID: ${rule._id})`,
            innerError
          );
        }
      }
  
      console.log("Rule evaluation completed.");
    } catch (error) {
      console.error("Error during rule evaluation process:", error);
    }
  };
  

module.exports = { evaluateRules };
