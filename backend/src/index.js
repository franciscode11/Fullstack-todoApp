import { connectDB } from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4500;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Running at ${PORT}`);
    });
  })
  .catch((e) => {
    console.log("Error!", e);
  });
