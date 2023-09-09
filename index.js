const express = require("express");
const app = express();
const path = require("path");
const { spawn } = require("child_process");

const filePath = path.join(__dirname, "classify.py");

// Define the Python script and its arguments
const pythonScript = filePath;

app.use(express.json());
// Define a route for making predictions
app.post("/predict", (req, res) => {

  // Get the input data from the request body 
  // const inputJson = JSON.stringify(req.body);
  const  data = req.body;

  const inputJson = JSON.stringify(data); // Replace with your input data

  console.log("This is sent by postman",data);

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
