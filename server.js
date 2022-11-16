var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
const PORT = 3000;

// Middlewares - It executes before rendering the page
app.use(express.json());
app.use(express.static(__dirname));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Post request for SignUp validation
app.post("/signup", function (request, response) {
  let userDatas = JSON.parse(fs.readFileSync("./data/user-details.json"));
  let taskData = JSON.parse(fs.readFileSync("./data/task-details.json"));
  if (!(request.body.useremail in userDatas)) {
    userDatas[request.body.useremail] = {
      username: request.body.username,
      useremail: request.body.useremail,
      usertype: request.body.usertype,
      password: request.body.password,
    };
    taskData[request.body.useremail] = {};
    fs.writeFile(
      "./data/user-details.json",
      JSON.stringify(userDatas),
      (error) => {
        if (error) console.log(error);
      }
    );
    fs.writeFile(
      "./data/task-details.json",
      JSON.stringify(taskData),
      (error) => {
        if (error) console.log(error);
      }
    );
    response.status(200).json({ message: "Success" });
    response.end();
  } else {
    response.status(300).json({ message: "User already exists" });
    response.end();
  }
});

// Post request for Login validation
app.post("/login", function (request, response) {
  let userDatas = JSON.parse(fs.readFileSync("./data/user-details.json"));
  if (request.body.useremail in userDatas) {
    if (
      request.body.userPassword === userDatas[request.body.useremail].password
    ) {
      response.status(200).json({ message: "Valid User" });
      response.end();
    } else {
      response.status(205).json({ message: "Wrong Password" });
      response.end();
    }
  } else {
    response.status(300).json({ message: "User Not Found" });
    response.end();
  }
});

// Post request for Task Updation
app.post("/updateTask", function (request, response) {
  let taskData = JSON.parse(fs.readFileSync("./data/task-details.json"));

  taskData[request.body.useremail][request.body.taskName] = {
    taskName: request.body.taskname,
    startDate: request.body.startDate,
    endDate: request.body.endDate,
    priority: request.body.priority,
    description: request.body.description,
    user: request.body.useremail,
    taskProgress: request.body.taskProgress,
  };

  fs.writeFile(
    "./data/task-details.json",
    JSON.stringify(taskData),
    (error) => {
      if (error) console.log(error);
    }
  );
  response.status(200).json({ message: "Success" });
  response.end();
});

// Post request for Duplicate Task Validation
app.post("/validateTask", function (request, response) {
  let taskData = JSON.parse(fs.readFileSync("./data/task-details.json"));
  if (request.body.taskName in taskData[request.body.useremail]) {
    response.json({
      taskDetails: taskData[request.body.useremail][request.body.taskName],
      valid: true,
    });
    response.end();
  } else {
    response.status(300).json({ message: "Success" });
    response.end();
  }
});

// Post request for Delete Task
app.post("/deleteTask", function (request, response) {
  let taskData = JSON.parse(fs.readFileSync("./data/task-details.json"));
  if (request.body) {
    delete taskData[request.body.useremail][request.body.taskName];

    fs.writeFile(
      "./data/task-details.json",
      JSON.stringify(taskData),
      (error) => {
        if (error) console.log(error);
      }
    );
    response.json({ message: true });
    response.end();
  } else {
    response.json({ message: false });
    response.end();
  }
});

// Get all task data of Specific User
app.post("/getAlltask", function (request, response) {
  let taskData = JSON.parse(fs.readFileSync("./data/task-details.json"));
  response.json({ taskDetails: taskData[request.body.loginEmail] });
  response.end();
});

// Get the logged User Details
app.post("/getUserData", function (request, response) {
  let userData = JSON.parse(fs.readFileSync("./data/user-details.json"));
  response.json(userData[request.body.loginEmail]);
  response.end();
});

// Post request for Deleting User Account
app.post("/deleteUserData", function (request, response) {
  let userData = JSON.parse(fs.readFileSync("./data/user-details.json"));
  delete userData[request.body.loginEmail];
  fs.writeFile(
    "./data/user-details.json",
    JSON.stringify(userData),
    (error) => {
      if (error) console.log(error);
    }
  );

  let taskData = JSON.parse(fs.readFileSync("./data/task-details.json"));
  delete taskData[request.body.loginEmail];
  fs.writeFile(
    "./data/task-details.json",
    JSON.stringify(taskData),
    (error) => {
      if (error) console.log(error);
    }
  );
  response.end();
});

// Post request for edit and update task
app.post("/editAndUpdateTask", function (request, response) {
  let newTaskDetails = request.body.taskDetails;
  let taskData = JSON.parse(fs.readFileSync("./data/task-details.json"));
  delete taskData[request.body.loginEmail][request.body.oldTaskName];

  taskData[request.body.loginEmail][newTaskDetails.taskName] = {
    taskName: newTaskDetails.taskname,
    startDate: newTaskDetails.startDate,
    endDate: newTaskDetails.endDate,
    priority: newTaskDetails.priority,
    description: newTaskDetails.description,
    user: newTaskDetails.useremail,
    taskProgress: newTaskDetails.taskProgress,
  };

  fs.writeFile(
    "./data/task-details.json",
    JSON.stringify(taskData),
    (error) => {
      if (error) console.log(error);
    }
  );
  response.json({ taskDetails: taskData[request.body.loginEmail] });
  response.end();
});

// Post request for gtting a single task
app.post("/getSpecificTask", function (request, response) {
  let taskData = JSON.parse(fs.readFileSync("./data/task-details.json"));
  response.json({
    taskDetails: taskData[request.body.loginEmail][request.body.taskName],
  });
  response.end();
});

// Server listening at PORT
app.listen(PORT, () => {
  console.log("Server listening in PORT : " + PORT);
});
