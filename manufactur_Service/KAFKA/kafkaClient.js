const { Kafka } = require("kafkajs");

module.exports = new Kafka({
  clientId: "manufactur-gps",
  brokers: ["localhost:9092"] // or cloud kafka
});