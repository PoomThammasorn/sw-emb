const express = require("express");
const app = express();
const admin = require("firebase-admin");
const dataRoutes = require("./routes/dataRoutes");
const cors = require("cors"); // Import the cors package

// Initialize Firebase Admin SDK
const serviceAccount = require("./embedded-swa-ver2-firebase-adminsdk-5jist-50c6993bd5.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://embedded-swa-ver2-default-rtdb.asia-southeast1.firebasedatabase.app", // Replace with your Firebase project's URL
});

// Enable CORS for all routes
app.use(cors());

// Start the server
const port = 3000; // Replace with your desired port number
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Server run correctly.");
});

app.use("/data", dataRoutes);
