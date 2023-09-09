const express = require("express");
const app = express();
const path = require("path");
const { spawn } = require("child_process");

const filePath = path.join(__dirname, "classify.py");

// Define the Python script and its arguments
const pythonScript = filePath;

// Define a route for making predictions
app.get("/predict", (req, res) => {
  const inputJson = JSON.stringify({
    text: "On [Date], I noticed an unauthorized transaction of [Amount] from my savings account ([Account Number: XXXX-XXXX-XXXX-XXXX]). I immediately contacted your customer support hotline to report the issue and request assistance in resolving this matter. To my dismay, my experience with your customer service was far from satisfactory.",
  }); // Replace with your input data

  // Spawn the Python child process
  const pythonProcess = spawn("python", [pythonScript, inputJson]);

  // Handle the output from the Python process
  pythonProcess.stdout.on("data", (data) => {
    const result = JSON.parse(data.toString());
    console.log(`Python script output: ${JSON.stringify(result)}`);
    res.send(result);
  });

  // Handle errors, if any
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python script error: ${data.toString()}`);
  });

  // Listen for the Python process to exit
  pythonProcess.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
