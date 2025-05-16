const Rule = require('../models/ruleModel');
const Notification = require('../models/notificationModel');
const { triggerNotification } = require('./notificationService');
const { parseDuration } = require('../utils/parseDuration');

const evaluateRules = async () => {
  console.log("Starting rule evaluation...");

  try {
    // Find all rules and populate associated metrics and user
    const rules = await Rule.find()
        .populate('metric', 'metricName value')
        .populate('user', '_id');

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

        const now = new Date();
        const lastTime = rule.lastTriggeredAt || new Date(0);
        const waitTime = parseDuration(rule.retriggerAfter);
        const enoughTimePassed = now - new Date(lastTime) > waitTime;
        const shouldTrigger = rule.isArmed || enoughTimePassed;

        if (breach && shouldTrigger) {
          const notification = new Notification({
            ruleId: rule._id,
            user: rule.user?._id,
            message: `Alert! ${metricName} breached the threshold.`,
          });

          await notification.save();
          await triggerNotification(rule, metricValue);

          rule.isArmed = false;
          rule.lastTriggeredAt = now;
          await rule.save();

          console.log(`Notification triggered for rule: ${rule.ruleName}`);
        } else if (breach) {
          console.log(`Rule breached but not armed yet: ${rule.ruleName}`);
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