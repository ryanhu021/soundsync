import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import userRouter from "./routes/user-routes";
import { AuthRequest, auth } from "./util/auth";
import playlistRouter from "./routes/playlist-routes";
import songRouter from "./routes/song-routes";
import oauthRouter from "./routes/oauth-routes";
import exportRouter from "./routes/export-routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.MONGO_USERNAME +
      ":" +
      process.env.MONGO_PASSWORD +
      "@" +
      process.env.MONGO_CLUSTER +
      "/" +
      process.env.MONGO_DB +
      "?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test-auth", auth, (req: AuthRequest, res) => {
  res.send({ user: req.user });
});

app.use("/user", userRouter);
app.use("/song", songRouter);
app.use("/playlist", playlistRouter);
app.use("/oauth", oauthRouter);
app.use("/export", exportRouter);

//running the server
app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
