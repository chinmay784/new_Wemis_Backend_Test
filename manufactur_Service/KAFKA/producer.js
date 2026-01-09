const kafka = require("./kafkaClient");
const { GPS_ROUTE } = require("./topics");

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log("✅ Kafka Producer connected");
};

const sendRoutePoint = async (data) => {
  await producer.send({
    topic: GPS_ROUTE,
    messages: [
      {
        key: data.imei, // partition per device
        value: JSON.stringify(data)
      }
    ]
  });
};

module.exports = { connectProducer, sendRoutePoint };
