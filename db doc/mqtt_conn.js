const mqtt = require('mqtt');

// MQTT broker URL
const mqttBrokerUrl = 'mqtt://broker.emqx.io';

// MQTT authentication credentials
const mqttUsername = 'emqx'; // Replace with your MQTT username
const mqttPassword = 'public'; // Replace with your MQTT password

// Options for MQTT connection
const mqttOptions = {
  clientId: 'atlener_solutions_mqtt_client', // Unique client ID
  clean: true, // Keep session clean
  connectTimeout: 4000, // Time before connection times out
  reconnectPeriod: 1000, // Reconnect period
  username: mqttUsername, // MQTT username
  password: mqttPassword, // MQTT password
  port: 1883
};

// Connect to the MQTT broker
const client = mqtt.connect(mqttBrokerUrl, mqttOptions);

// MQTT connection events
client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Subscribe to the topics
  const topics = ['vehicle_vcu_data', 'vehicle_vcu_switch_request'];

  topics.forEach((topic) => {
    client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic}`);
      } else {
        console.error(`Subscription error for topic ${topic}:`, err);
      }
    });
  });
});

module.exports = client;