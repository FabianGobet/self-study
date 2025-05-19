import "./config.js";
import app from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Press Ctrl+C to stop the server`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
