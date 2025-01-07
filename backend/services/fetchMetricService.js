const mongoose = require('mongoose');
const Metric = require('../models/metricModel'); // Ensure this path points to your Metric model


const fetchWeatherData = async () => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${process.env.CITY}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    const temperature = data.main.temp;
    const windSpeed = data.wind.speed;

    await Metric.findOneAndUpdate(
      { metricName: 'Temperature' },
      { value: temperature },
      { upsert: true, new: true }
    );

    await Metric.findOneAndUpdate(
      { metricName: 'Wind Speed' },
      { value: windSpeed },
      { upsert: true, new: true }
    );

    console.log(`Weather metrics updated: Temperature=${temperature}, Wind Speed=${windSpeed}`);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
  }
};

module.exports = fetchWeatherData;
