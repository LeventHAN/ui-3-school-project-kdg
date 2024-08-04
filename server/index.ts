import express from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import dotenv from "dotenv";
import { routes } from "./src/routes";
import { Server } from "socket.io";
import { schedule } from "node-cron";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: `.env.${process.env.NODE_ENV}`, override: true });

const app = express();
http.createServer(app);

const secureSocketIO = new Server({
  cors: {
    origin: "*",
  },
});

secureSocketIO.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token.split("Bearer ").pop();
    jwt.verify(token, process.env.SUPABASE_JWT_SECRET || "") as JwtPayload;
    console.log("Websocket connected admin user");
    socket.join("admin");
    next();
  } catch {
    console.log("Websocket connected guess");
    socket.join("guests");
    next();
  }
});

secureSocketIO.on("connection", (socket) => {
  socket.on("admin:notify", (data) => {
    console.log("New notification received from the admin.", data);
    socket.broadcast.to("guests").emit("notification", data);
  });
});

const allowedOrigins = ["https://localhost:5174", "https://127.0.0.1:5174"];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true); // remove before inlevering :)
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(bodyParser.json());

app.use("/", routes);

// start the server
app.listen(process.env.BACK_PORT, () => {
  console.log(
    `Express server running @ http://${process.env.BACK_HOST}:${process.env.BACK_PORT} and socket.io @ http://${process.env.BACK_HOST}:${process.env.BACK_PORT_SOCKET} `
  );
});

if (process.env.BACK_PORT_SOCKET)
  secureSocketIO.listen(parseInt(process.env.BACK_PORT_SOCKET));

const prisma = new PrismaClient();

schedule("*/30 * * * * *", async () => {
  console.log("Updating and emitting events for POIs");
  try {
    // Fetch all POIs with only the necessary attributes
    const pois = await prisma.pointOfInterest.findMany({
      select: {
        id: true,
        currentQueueLength: true,
      },
    });

    // Update the queue length and emit events
    pois.forEach(async (poi) => {
      const updatedQueueLength = Math.floor(Math.random() * 31); // Random number between 0 and 30
      // Update the currentQueueLine attribute in the database
      await prisma.pointOfInterest.update({
        where: { id: poi.id },
        data: { currentQueueLength: updatedQueueLength },
      });
    });
    secureSocketIO.emit("poi:queueUpdate");
    console.log("Done updating and emitting events for POIs");
  } catch (error) {
    console.error("Error updating and emitting events:", error);
  }
});
