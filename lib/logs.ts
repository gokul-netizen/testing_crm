import pino from "pino";
import path from "path";

const transport = pino.transport({
  target: "pino-roll",
  options: {
    file: path.join(process.cwd(), "logs", "app.logs"),
    frequency: "daily",
    mkdir: true,
  },
});

const logger = pino(
  {
    timestamp: () =>
      `,"time":"${new Date().toISOString()}"`,
  },
  transport
);

export default logger;