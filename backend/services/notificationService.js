const axios = require('axios');
const nodemailer = require('nodemailer');
const twilio = require('twilio');


// Trigger Notifications
const triggerNotification = (rule, value) => {
    const message = rule.alertMessage || `Alert! ${rule.metricName} breached threshold with value ${value}.`;
  
    if (rule.notificationChannel === 'email') {
        //  sendEmailNotification(rule.userId, message);
    } else 
    if (rule.notificationChannel === 'sms') {
      sendSMSNotification(rule.userId, message);
      
     } else if (rule.notificationChannel === 'webhook') {
       //sendWebhookNotification(rule.userId, message);
     }
  };
  
//   const sendEmailNotification = (email, message) => {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//     });
  
//     transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Alert Notification',
//       text: message,
//     });
//   };
  
  const sendSMSNotification = (phone, message) => {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
    client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE,
        to: "+4915236129849",
      });
    
      console.log(message.body);
};
  
//   const sendWebhookNotification = (webhookUrl, message) => {
//     axios.post(webhookUrl, { message });
//   };

module.exports = {triggerNotification};