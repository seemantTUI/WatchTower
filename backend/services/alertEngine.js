const Rule = require('../models/ruleModel');
const Notification = require('../models/notificationModel');
const { triggerNotification } = require('./notificationService');

const evaluateRules = async () => {
  console.log("Starting rule evaluation...");

  try {
    // Find all rules and populate associated metrics
    const rules = await Rule.find().populate('metric', 'metricName value');

    for (const rule of rules) {
      try {
        if (!rule.metric) {
          console.warn(`Rule "${rule.ruleName}" has no associated metric.`);
          continue;
        }

        const { value: metricValue, metricName } = rule.metric;
        const breach =
          (rule.condition === "greater" && metricValue > rule.threshold) ||
          (rule.condition === "less" && metricValue < rule.threshold);

        if (breach) {
          const existingNotification = await Notification.findOne({ ruleId: rule._id });
          if (existingNotification) {
            console.log(`Notification already sent for rule: ${rule.ruleName}`);
            continue;
          }

          const notification = new Notification({
            ruleId: rule._id,
            message: `Alert! ${metricName} breached the threshold.`,
          });

          await notification.save();

          await triggerNotification(rule, metricValue);
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
