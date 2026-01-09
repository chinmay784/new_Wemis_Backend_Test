const kafka = require("../kafka/kafkaClient");
const { GPS_ROUTE } = require("../kafka/topics");
const RouteHistory = require("../models/RouteHistory");

const consumer = kafka.consumer({ groupId: "gps-route-group" });

const start = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: GPS_ROUTE });

  let buffer = [];

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      buffer.push(data);

      // BULK INSERT (VERY IMPORTANT)
      if (buffer.length >= 300) {
        await RouteHistory.insertMany(buffer);
        buffer = [];
      }
    }
  });

  console.log("🚀 GPS Consumer running");
};

start();
