// DOM Elements

var modal = document.querySelector(".modal");
var todoAdd = document.getElementById("todo-add-task");
var inprogressAdd = document.getElementById("inprogress-add-task");
var completedAdd = document.getElementById("completed-add-task");
var closeButton = document.querySelector(".close-button");
var cancelButton = document.getElementById("task-cancel-button");
var addTask = document.getElementById("add-task");
var startDate = document.getElementById("start-date");
var endDate = document.getElementById("end-date");
var taskName = document.getElementById("task-name");
var todoPriority = document.getElementById("todo-priority");
var taskDescription = document.getElementById("description");
var todoBucket = document.getElementById("todo-cards");
var inProgressBucket = document.getElementById("inprogress-cards");
var completedTask = document.getElementById("completed-cards");
var taskSnackbar = document.getElementById("task-snackbar");
var exitWindow = document.getElementById("exit-window");
var deleteTaskName = document.getElementById("delete-task");
var deleteButton = document.getElementById("conform-delete");
var confirmCancelButton = document.getElementById("conform-cancel");
var deletedSnackBar = document.getElementById("dashboard-snackbar-close");
var viewModal = document.querySelector(".view-task-modal");
var closeViewModal = document.getElementById("close-view-task");
var closeViewButton = document.getElementById("close-view-task-modal");
var editViewModal = document.getElementById("edit-view-task-modal");
var updateTaskModal = document.getElementById("update-task-modal");
var closeUpdateButton = document.getElementById("close-edit-task");
var cancelUpdateButton = document.getElementById("close-edit-task-modal");
var confirmUpdate = document.getElementById("update-view-task-modal");
var updatedSnackbar = document.getElementById("updated-snackbar");
var updatedSnackbarClose = document.getElementById("updated-snackbar-close");
var navbar = document.getElementById("navbar");
var closeDeleteModal = document.getElementById("close-delete-task");
let viewTaskName = document.getElementById("view-task-name");
let viewStartDate = document.getElementById("view-start-date");
let viewEndDate = document.getElementById("view-due-date");
let viewTaskDescription = document.getElementById("view-description");
let viewPriority = document.getElementById("view-priority");
let viewTaskProgress = document.getElementById("view-progress");

let updateTaskName = document.getElementById("edit-task-name");
let updateStartDate = document.getElementById("edit-start-date");
let updateDueDate = document.getElementById("edit-end-date");
let updatePriority = document.getElementById("edit-priority");
let updateTaskProgress = document.getElementById("edit-progress");
let updateDescription = document.getElementById("edit-description");

var todayDate = new Date().toISOString().split("T")[0];
var progressOfTask = "New";
var deleteTaskCard;

let count = 0;

function toggleModal(taskProgress) {
  progressOfTask = taskProgress;
  switch (taskProgress) {
    case "New":
      startDate.min = todayDate;
      break;
    case "Inprogress":
      startDate.min = "";
      break;
    case "Completed":
      startDate.min = "";
      break;
    case "Empty":
      emptyAddTask();
      break;
  }
  todoPriority.value = "";
  modal.classList.toggle("show-modal");
}

function setMaxForDate() {
  switch (progressOfTask) {
    case "New":
      endDate.min = startDate.value;
      endDate.max = "";
      break;
    case "Inprogress":
      endDate.min = todayDate;
      endDate.max = "";
      break;
    case "Completed":
      endDate.min = startDate.value;
      endDate.max = todayDate;
      break;
  }
  endDate.disabled = false;
}

function checkForStartDate() {
  if (startDate.value === "") {
    endDate.disabled = true;
    startDate.setCustomValidity("Please Select Start Date");
    startDate.reportValidity();
  } else {
    endDate.disabled = false;
  }
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
    emptyAddTask();
  }
}

async function validateNewTask() {
  if (taskName.value.length === 0) {
    taskName.setCustomValidity("Enter valid Task Name");
    taskName.reportValidity();
  } else {
    if (startDate.value.length === 0) {
      startDate.setCustomValidity("Select Starting Date of Task");
      startDate.reportValidity();
    } else {
      if (endDate.value.length === 0) {
        endDate.setCustomValidity("Select Due Date of Task");
        endDate.reportValidity();
      } else {
        let validateTaskName = await validateTask({
          taskName: taskName.value,
          useremail: loginUseremail.value.toLowerCase(),
        });
        if (validateTaskName.valid) {
          taskSnackbar.innerHTML = `Task ${taskName.value} already exists in ${validateTaskName.taskDetails.taskProgress} Task section`;
          taskSnackbar.classList.add("show-snackbar");
          setTimeout(function () {
            taskSnackbar.classList.remove("show-snackbar");
          }, 5000);
        } else {
          let taskDetails = {
            taskName: taskName.value,
            startDate: startDate.value,
            endDate: endDate.value,
            priority: todoPriority.value,
            description: taskDescription.value,
            useremail: loginUseremail.value.toLowerCase(),
            taskProgress: progressOfTask,
          };
          seperateAndCreateTaskCard(taskDetails);
          closeButton.click();
          emptyAddTask();
        }
      }
    }
  }
}

function writeUserTask(userTasks) {
  let taskNames = Object.keys(userTasks.taskDetails);
  taskNames.forEach((taskName) => {
    userTasks.taskDetails[taskName].taskName = taskName;
    checkAndUpdateTask(
      userTasks.taskDetails[taskName],
      userTasks.taskDetails[taskName].taskProgress
    );
  });
}

function daysCalculator(date1, date2) {
  let startDate = new Date(date1);
  let endDate = new Date(date2);
  let diffTime = Math.abs(startDate - endDate);
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function emptyAddTask() {
  taskName.value = "";
  startDate.value = "";
  endDate.value = "";
  todoPriority.value = "";
  taskDescription.value = "";
}

function seperateAndCreateTaskCard(taskDetails) {
  writeNewTask(taskDetails);
  checkAndUpdateTask(taskDetails, progressOfTask);
}

function checkAndUpdateTask(taskDetails, taskProgress, filterView) {
  let noOfDays = 0,
    i = 0;
  let message = "";
  let taskCard;
  switch (taskProgress) {
    case "New":
      noOfDays = daysCalculator(taskDetails.startDate, todayDate);
      message = "- Days to Start";
      taskCard = createAndUpdateTaskCard(
        taskDetails,
        noOfDays,
        message,
        "#f9e79f"
      );
      todoBucket.innerHTML += taskCard;
      todoBucket.scrollTop -= todoBucket.scrollHeight;
      break;
    case "Completed":
      noOfDays = "";
      message = "Completed";
      taskCard = createAndUpdateTaskCard(
        taskDetails,
        noOfDays,
        message,
        "#addfad"
      );
      completedTask.innerHTML += taskCard;
      completedTask.scrollTop -= completedTask.scrollHeight;
      break;
    case "Inprogress":
      noOfDays = daysCalculator(taskDetails.endDate, todayDate);
      message = "- Days Left";
      taskCard = createAndUpdateTaskCard(
        taskDetails,
        noOfDays,
        message,
        "#fadbd8"
      );
      inProgressBucket.innerHTML += taskCard;
      inProgressBucket.scrollTop -= inProgressBucket.scrollHeight;
      break;
  }
  if (filterView) {
    document.getElementById(`task-cards-${count - 1}`).click();
  }
}

function createAndUpdateTaskCard(taskDetails, noOfDays, message, color) {
  let taskCard = `<div class="task-cards" id="task-cards-${count}" draggable="true" onclick="viewTaskCard(event,taskname${count},${count})" ondragstart="dragStarted(event,'task-cards-${count}')">
    <div class="task-heading">
      <div class="task-name">
        <button
          aria-label="Change Progress"
          data-cooltipz-dir="top"
          class="tick-button"
          onclick="showTaskProgress(event,'dropdown-content-${count}')"
        >
          <i class="bi bi-check-circle tick-icon" id="change-task-progress"></i>
        </button>
        <div class="dropdown-content" id="dropdown-content-${count}">
           <p id="change-todo-task" onclick="changeTaskProgress('New',taskname${count},'task-cards-${count}','dropdown-content-${count}')">TO-DO</p>
           <p id="change-inprogress-task" onclick="changeTaskProgress('Inprogress',taskname${count},'task-cards-${count}','dropdown-content-${count}')">Inprogress</p>
           <p id="change-completed-task" onclick="changeTaskProgress('Completed',taskname${count},'task-cards-${count}','dropdown-content-${count}')">Completed</p>
        </div>
       <span id="taskname${count}">${taskDetails.taskName}</span>
      </div>
      <div
        class="delete-container"
        aria-label="Delete Task"
        data-cooltipz-dir="top"
        id="delete-tasks"
        onclick="deleteTask(event,taskname${count})"
      >
        <i class="bi bi-trash delete-icon"></i>
      </div>
    </div>
    <div class="task-counter">
    <div class="task-progress ${taskDetails.priority.toLowerCase()}-priority" title="Priority">${
    taskDetails.priority[0]
  }</div>
      <div class="task-deadlines">
        <div class="start-date" title="Start Date">${
          taskDetails.startDate
        }</div>
        <div class="seperator">-</div>
        <div class="due-date" title="Due Date">${taskDetails.endDate}</div>
      </div>
      <div class="days-count" title="Task Progress" style="background:${color}">
        ${noOfDays}
        <div class="progress-message">&nbsp;${message}</div>
      </div>
    </div>
  </div>`;
  count++;
  return taskCard;
}

async function viewTaskCard(event, taskName, count) {
  if (
    event.target.id !== "change-task-progress" &&
    event.target.id !== "change-todo-task" &&
    event.target.id !== "change-inprogress-task" &&
    event.target.id !== "change-completed-task"
  ) {
    document
      .getElementById(`dropdown-content-${count}`)
      .classList.remove("display-profile");
    let validateTaskName = await validateTask({
      taskName: taskName.innerHTML,
      useremail: loginUseremail.value.toLowerCase(),
    });

    viewTaskName.innerHTML = taskName.innerHTML;
    viewStartDate.innerHTML = validateTaskName.taskDetails.startDate;
    viewEndDate.innerHTML = validateTaskName.taskDetails.endDate;
    viewTaskDescription.innerHTML = validateTaskName.taskDetails.description;
    viewPriority.innerHTML = validateTaskName.taskDetails.priority;
    viewTaskProgress.innerHTML = validateTaskName.taskDetails.taskProgress;

    switch (validateTaskName.taskDetails.priority) {
      case "High":
        viewPriority.style.color = "black";
        viewPriority.style.backgroundColor = "#faa0a0";
        break;
      case "Medium":
        viewPriority.style.backgroundColor = "#fffec8";
        break;
      case "Low":
        viewPriority.style.backgroundColor = "#90ee90";
        break;
    }
    closeViewTaskModal();
  }
}

function deleteTask(event, taskName) {
  if (event.target.id != "delete-tasks") {
    viewModal.classList.toggle("show-modal");
    deleteTaskCard = taskName;
    deleteTaskName.innerHTML = `You won't be able to revert this task <br><br><span class="delete-task-name">Task Name: ${deleteTaskCard.innerHTML}<span><br>`;
    exitWindow.classList.toggle("show-modal");
  }
}

function showTaskProgress(event, dropdownId) {
  if (event.target.id === "change-task-progress") {
    document.getElementById(dropdownId).classList.toggle("display-profile");
  }
}

async function changeTaskProgress(
  newProgress,
  taskNameId,
  taskCardId,
  dropdownId
) {
  document.getElementById(dropdownId).classList.remove("display-profile");
  let getTaskDetail = await getSingleTask(
    loginUseremail.value.toLowerCase(),
    taskNameId.innerHTML
  );
  getTaskDetail.taskDetails.taskName = taskNameId.innerHTML;
  getTaskDetail.taskDetails.useremail = loginUseremail.value.toLowerCase();
  switch (newProgress) {
    case "Completed":
      if (getTaskDetail.taskDetails.taskProgress != "Completed") {
        getTaskDetail.taskDetails.taskProgress = "Completed";
        checkAndUpdateTask(getTaskDetail.taskDetails, "Completed");
        editAndUpdateTaskDetails({
          oldTaskName: taskNameId.innerHTML,
          loginEmail: loginUseremail.value.toLowerCase(),
          taskDetails: getTaskDetail.taskDetails,
        });
        document.getElementById(taskCardId).remove();
      }
      break;
    case "New":
      if (getTaskDetail.taskDetails.taskProgress != "New") {
        getTaskDetail.taskDetails.taskProgress = "New";
        checkAndUpdateTask(getTaskDetail.taskDetails, "New");
        editAndUpdateTaskDetails({
          oldTaskName: taskNameId.innerHTML,
          loginEmail: loginUseremail.value.toLowerCase(),
          taskDetails: getTaskDetail.taskDetails,
        });
        document.getElementById(taskCardId).remove();
      }
      break;
    case "Inprogress":
      if (getTaskDetail.taskDetails.taskProgress != "Inprogress") {
        getTaskDetail.taskDetails.taskProgress = "Inprogress";
        checkAndUpdateTask(getTaskDetail.taskDetails, "Inprogress");
        editAndUpdateTaskDetails({
          oldTaskName: taskNameId.innerHTML,
          loginEmail: loginUseremail.value.toLowerCase(),
          taskDetails: getTaskDetail.taskDetails,
        });
        document.getElementById(taskCardId).remove();
      }
      break;
  }
}

function confirmDeleteTask() {
  let deletedConfirmation = document.getElementById("deleted-message");
  deleteAndRemoveTaskName(
    deleteTaskCard.innerHTML,
    loginUseremail.value.toLowerCase()
  );
  deleteTaskCard.parentNode.parentNode.parentNode.remove();
  deletedConfirmation.innerHTML = ` Task ${deleteTaskCard.innerHTML} Deleted Succesfully`;
  dashboardSnackbar.classList.add("login-snackbar");
  setTimeout(function () {
    dashboardSnackbar.classList.remove("login-snackbar");
  }, 4000);
  confirmCancelButton.click();
}

function editViewTaskModal() {
  closeViewTaskModal();
  updateTaskCard();
}

function updateTaskCard() {
  updateTaskModal.classList.add("show-modal");

  updateTaskName.value = viewTaskName.innerHTML;
  updateStartDate.value = viewStartDate.innerHTML;
  updateDueDate.value = viewEndDate.innerHTML;
  updatePriority.value = viewPriority.innerHTML;
  updateTaskProgress.value = viewTaskProgress.innerHTML;
  updateDescription.value = viewTaskDescription.innerHTML;
}

async function confirmUpdateTask() {
  if (updateTaskName.value.length === 0) {
    updateTaskName.setCustomValidity("Enter valid Task Name");
    updateTaskName.reportValidity();
  } else {
    if (updateStartDate.value.length === 0) {
      updateStartDate.setCustomValidity("Select Starting Date of Task");
      updateStartDate.reportValidity();
    } else {
      if (updateDueDate.value.length === 0) {
        updateDueDate.setCustomValidity("Select Due Date of Task");
        updateDueDate.reportValidity();
      } else {
        if (updateTaskProgress.value.length === 0) {
          updateTaskProgress.setCustomValidity("Select Task Progress");
          updateTaskProgress.reportValidity();
        } else {
          let taskDetails = {
            taskName: updateTaskName.value,
            startDate: updateStartDate.value,
            endDate: updateDueDate.value,
            priority: updatePriority.value,
            description: updateDescription.value,
            useremail: loginUseremail.value.toLowerCase(),
            taskProgress: updateTaskProgress.value,
          };
          todoBucket.replaceChildren();
          completedTask.replaceChildren();
          inProgressBucket.replaceChildren();
          let newTaskDetails = await editAndUpdateTaskDetails({
            oldTaskName: viewTaskName.innerHTML,
            loginEmail: loginUseremail.value.toLowerCase(),
            taskDetails: taskDetails,
          });
          writeUserTask(newTaskDetails);
          cancelUpdateButton.click();
          updatedSnackbar.classList.add("login-snackbar");
          setTimeout(function () {
            updatedSnackbar.classList.remove("login-snackbar");
          }, 7000);
        }
      }
    }
  }
}

function closeDeleteConfirmation() {
  exitWindow.classList.toggle("show-modal");
}

function closeDeletedSnackbar() {
  dashboardSnackbar.classList.remove("login-snackbar");
}

function closeViewTaskModal() {
  viewModal.classList.toggle("show-modal");
}

function closeUpdateTaskModal() {
  updateTaskModal.classList.toggle("show-modal");
}

function updatedCloseSnackBar() {
  updatedSnackbar.classList.remove("login-snackbar");
}

// Event Listeners

addTask.addEventListener("click", validateNewTask);
inprogressAdd.addEventListener("click", () => toggleModal("Inprogress"));
completedAdd.addEventListener("click", () => toggleModal("Completed"));
todoAdd.addEventListener("click", () => toggleModal("New"));
closeButton.addEventListener("click", () => toggleModal("Empty"));
window.addEventListener("click", windowOnClick);
cancelButton.addEventListener("click", () => toggleModal("Empty"));
deletedSnackBar.addEventListener("click", closeDeletedSnackbar);
closeViewModal.addEventListener("click", closeViewTaskModal);
closeViewButton.addEventListener("click", closeViewTaskModal);
editViewModal.addEventListener("click", editViewTaskModal);
closeUpdateButton.addEventListener("click", closeUpdateTaskModal);
cancelUpdateButton.addEventListener("click", closeUpdateTaskModal);
confirmUpdate.addEventListener("click", confirmUpdateTask);
updatedSnackbarClose.addEventListener("click", updatedCloseSnackBar);
closeDeleteModal.addEventListener("click", closeDeleteConfirmation);
