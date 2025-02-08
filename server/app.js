import express from "express";
import { spawn } from "child_process";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Function to convert an Uint8Array to a string
var uint8arrayToString = function (data) {
  return String.fromCharCode.apply(null, data);
};

app.post("/api/mood-analysis", (req, res) => {
  const texts = req.body.texts.join("\x1E");

  const process = spawn("python", ["server/mood_analysis/model.py", texts]);

  // Handle normal output
  process.stdout.on("data", (data) => {
    res.json({feeling: uint8arrayToString(data)});
  });

  // Handle error output
  process.stderr.on("data", (data) => {
    // As said before, convert the Uint8Array to a readable string.
    console.log(uint8arrayToString(data));
  });

  process.on("exit", (code) => {
    console.log("Process quit with code : " + code);
  });
});

app.listen(3000, () => {
  console.log("Listening to port 3000...");
});
