import { connectDB } from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3498;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Running at http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.log("Error!", e);
  });
