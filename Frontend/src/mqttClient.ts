import mqtt from 'mqtt';

// MQTT client with only subscribe permission
const mqttClient: mqtt.MqttClient = mqtt.connect("wss://85e67d8c7c8a4955a07dbd76348a5bba.s2.eu.hivemq.cloud/mqtt", {
  port: 8884,
  username: 'Client',
  password: process.env.NEXT_PUBLIC_MQTT_CLIENT_PASSWORD,
});

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

mqttClient.on('message', (topic, message) => {
  console.log('MQTT message received:', topic, message.toString());
  if (topic.endsWith('/updated-reviews')) {
    const data = JSON.parse(message.toString());
    window.dispatchEvent(new CustomEvent('mqttReviewReceived', { detail: { data } }));
  }

  if (topic.startsWith('notification/movie')) {
    const notification = JSON.parse(message.toString());
    window.dispatchEvent(new CustomEvent('mqttNotificationReceived', { detail: notification }));
  }

  if (topic.startsWith('movie/')) {
    const data = JSON.parse(message.toString());
    if (topic.endsWith('/new-comment')) {
      window.dispatchEvent(new CustomEvent('mqttNewCommentReceived', { detail: { data } }));
    } else if (topic.endsWith('/updated-comment')) {
      window.dispatchEvent(new CustomEvent('mqttUpdatedReviewReceived', { detail: { data } }));
    } else if (topic.endsWith('/deleted-comment')) {
      window.dispatchEvent(new CustomEvent('mqttDeletedReviewReceived', { detail: { data } }));
    }
  }

  if (topic === 'users/new-today') {
    window.dispatchEvent(new CustomEvent('mqttNewUserToday'));
  }

  if (topic === 'chat/message/validated') {
    const data = JSON.parse(message.toString());
    window.dispatchEvent(new CustomEvent('mqttChatMessageReceived', { detail: { data } }));
  }
});

mqttClient.on('error', (error) => {
  console.error('MQTT error:', error);
});

export default mqttClient;
