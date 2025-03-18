const express = require("express");

const app = express();
const morgan = require("morgan");
const routes = require("./routes");
const config = require("./config");
const amqplib = require("amqplib");
const OrderService = require("./lib/OrderService");

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to log HTTP requests
app.use(morgan("tiny"));

// Mount the router
app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  // You can also log the error to a file or console
  console.error(err);

  res.status(status).json({
    error: {
      message,
      status
    }
  });
});

(async () => {
  try {
    const connection = await amqplib.connect("amqp://127.0.0.1");

    const channel = await connection.createChannel();

    const queue = "orders";

    await channel.assertQueue(queue, { durable: true });

    console.log(`[x] Waiting for messages in %s`, queue);

    channel.consume(
      queue,
      async (message) => {
        const order = JSON.parse(message.content.toString());
        console.log(`[x] retrieved %s`, JSON.stringify(order));
        await OrderService.create(order.userId, order.email, order.items);

        channel.ack(message);
      },
      {
        noAck: false
      }
    );
  } catch (error) {
    console.error(error);
  }
})();

module.exports = app;
