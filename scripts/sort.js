// DOM Elements

let input = document.getElementById("filter-tasks");
let todoSortButton = document.getElementById("todo-sort");
let inProgressSortButton = document.getElementById("inprogress-sort");
let completedSortButton = document.getElementById("completed-sort");
let todoAlphabet = document.getElementById("todo-alphabet");
let todoStartDate = document.getElementById("todo-start-date");
let todoDueDate = document.getElementById("todo-due-date");
let inprogressAlphabet = document.getElementById("inprogress-alphabet");
let inprogressStartDate = document.getElementById("inprogress-start-date");
let inprogressDueDate = document.getElementById("inprogress-due-date");
let completedAlphabet = document.getElementById("completed-alphabet");
let completedStartDate = document.getElementById("completed-start-date");
let completedDueDate = document.getElementById("completed-due-date");

let allTasks;
let names = [];

async function getAllTasksForFilter() {
  allTasks = await getAllTasks(loginUseremail.value.toLowerCase());
  names = Object.keys(allTasks.taskDetails);
  let sortedNames = names.sort();
  removeElements();
  for (let i of sortedNames) {
    if (
      i.toLowerCase().startsWith(input.value.toLowerCase()) &&
      input.value != ""
    ) {
      let listItem = document.createElement("li");
      listItem.classList.add("list-items");
      listItem.style.cursor = "pointer";
      listItem.setAttribute("onclick", "displayNames('" + i + "',allTasks)");
      let word = "<b>" + i.substr(0, input.value.length) + "</b>";
      word += i.substr(input.value.length);
      listItem.innerHTML = word;
      document.querySelector(".list").appendChild(listItem);
    }
  }
}

function onSearch() {
  if (input.value === "" && allTasks) {
    todoBucket.replaceChildren();
    completedTask.replaceChildren();
    inProgressBucket.replaceChildren();
    writeUserTask(allTasks);
  }
}

function searchButton() {
  let searchedValue = input.value;
  if (searchedValue === "") {
    onSearch();
  } else {
    names.forEach((name) => {
      if (searchedValue.toLowerCase() === name.toLowerCase()) {
        todoBucket.replaceChildren();
        completedTask.replaceChildren();
        inProgressBucket.replaceChildren();
        allTasks.taskDetails[name].taskName = name;
        checkAndUpdateTask(
          allTasks.taskDetails[name],
          allTasks.taskDetails[name].taskProgress,
          true
        );
        removeElements();
      }
    });
  }
}

function displayNames(value, taskDetails) {
  input.value = value;
  todoBucket.replaceChildren();
  completedTask.replaceChildren();
  inProgressBucket.replaceChildren();
  taskDetails.taskDetails[value].taskName = value;
  checkAndUpdateTask(
    taskDetails.taskDetails[value],
    taskDetails.taskDetails[value].taskProgress,
    true
  );

  removeElements();
}

function removeElements() {
  let items = document.querySelectorAll(".list-items");
  items.forEach((item) => {
    item.remove();
  });
}

function SortClicked(bucketType) {
  switch (bucketType) {
    case "New":
      todoSortButton.classList.toggle("show-category-button");
      break;
    case "Inprogress":
      inProgressSortButton.classList.toggle("show-category-button");
      break;
    case "Completed":
      completedSortButton.classList.toggle("show-category-button");
      break;
  }
}

function seperateTasksOnCategory(allTasks, category) {
  let categoryTasks = {};
  let taskNames = Object.keys(allTasks.taskDetails);
  taskNames.forEach((taskName) => {
    allTasks.taskDetails[taskName].taskName = taskName;
  });
  let tasks = Object.values(allTasks.taskDetails);
  Object.entries(tasks).forEach(([key, value]) => {
    if (value.taskProgress === category) categoryTasks[value.taskName] = value;
  });
  return categoryTasks;
}

async function sortCardsBasedOnCriteria(bucketType, sortingCategory) {
  let allTasks = await getAllTasks(loginUseremail.value.toLowerCase());
  let categoryTasks;
  switch (bucketType) {
    case "New":
      categoryTasks = seperateTasksOnCategory(allTasks, bucketType);
      todoSortButton.classList.toggle("show-category-button");
      switch (sortingCategory) {
        case "alphabet":
          todoAlphabet.classList.toggle("fa-sort-alpha-desc");
          todoBucket.replaceChildren();
          todoBucket.classList.remove("todo-cards-reverse");
          if (!todoAlphabet.classList.contains("fa-sort-alpha-desc"))
            todoBucket.classList.add("todo-cards-reverse");
          Object.keys(categoryTasks)
            .sort()
            .reduce((accumulator, key) => {
              checkAndUpdateTask(
                categoryTasks[key],
                categoryTasks[key].taskProgress
              );
            }, {});
          break;
        case "start-date":
          todoStartDate.classList.toggle("fa-arrow-down-9-1");
          todoBucket.replaceChildren();
          todoBucket.classList.remove("todo-cards-reverse");
          if (!todoStartDate.classList.contains("fa-arrow-down-9-1"))
            todoBucket.classList.add("todo-cards-reverse");
          let sortedByDate = Object.values(categoryTasks).sort((a, b) =>
            a.startDate > b.startDate ? 1 : -1
          );
          Object.values(sortedByDate).forEach((value) => {
            checkAndUpdateTask(value, value.taskProgress);
          });
          break;
        case "end-date":
          todoBucket.replaceChildren();
          todoDueDate.classList.toggle("fa-arrow-down-9-1");
          todoBucket.classList.remove("todo-cards-reverse");
          if (!todoDueDate.classList.contains("fa-arrow-down-9-1"))
            todoBucket.classList.add("todo-cards-reverse");
          let sortedByEndDate = Object.values(categoryTasks).sort((a, b) =>
            a.endDate > b.endDate ? 1 : -1
          );
          Object.values(sortedByEndDate).forEach((value) => {
            checkAndUpdateTask(value, value.taskProgress);
          });
          break;
        case "none":
          todoBucket.replaceChildren();
          Object.values(categoryTasks).forEach((value) => {
            checkAndUpdateTask(value, value.taskProgress);
          });
          break;
      }
      break;
    case "Inprogress":
      categoryTasks = seperateTasksOnCategory(allTasks, bucketType);
      inProgressSortButton.classList.toggle("show-category-button");
      switch (sortingCategory) {
        case "alphabet":
          inprogressAlphabet.classList.toggle("fa-sort-alpha-desc");
          inProgressBucket.replaceChildren();
          inProgressBucket.classList.remove("todo-cards-reverse");
          if (!inprogressAlphabet.classList.contains("fa-sort-alpha-desc"))
            inProgressBucket.classList.add("todo-cards-reverse");
          Object.keys(categoryTasks)
            .sort()
            .reduce((accumulator, key) => {
              checkAndUpdateTask(
                categoryTasks[key],
                categoryTasks[key].taskProgress
              );
            }, {});
          break;
        case "start-date":
          inprogressStartDate.classList.toggle("fa-arrow-down-9-1");
          inProgressBucket.replaceChildren();
          inProgressBucket.classList.remove("todo-cards-reverse");
          if (!inprogressStartDate.classList.contains("fa-arrow-down-9-1"))
            inProgressBucket.classList.add("todo-cards-reverse");
          let sortedByDate = Object.values(categoryTasks).sort((a, b) =>
            a.startDate > b.startDate ? 1 : -1
          );
          Object.values(sortedByDate).forEach((value) => {
            checkAndUpdateTask(value, value.taskProgress);
          });
          break;
        case "end-date":
          inprogressDueDate.classList.toggle("fa-arrow-down-9-1");
          inProgressBucket.replaceChildren();
          inProgressBucket.classList.remove("todo-cards-reverse");
          if (!inprogressDueDate.classList.contains("fa-arrow-down-9-1"))
            inProgressBucket.classList.add("todo-cards-reverse");
          let sortedByEndDate = Object.values(categoryTasks).sort((a, b) =>
            a.endDate > b.endDate ? 1 : -1
          );
          Object.values(sortedByEndDate).forEach((value) => {
            checkAndUpdateTask(value, value.taskProgress);
          });
          break;
        case "none":
          inProgressBucket.replaceChildren();
          Object.values(categoryTasks).forEach((value) => {
            checkAndUpdateTask(value, value.taskProgress);
          });
          break;
      }
      break;
    case "Completed":
      categoryTasks = seperateTasksOnCategory(allTasks, bucketType);
      completedSortButton.classList.toggle("show-category-button");
      switch (sortingCategory) {
        case "alphabet":
          completedAlphabet.classList.toggle("fa-sort-alpha-desc");
          completedTask.replaceChildren();
          completedTask.classList.remove("todo-cards-reverse");
          if (!completedAlphabet.classList.contains("fa-sort-alpha-desc"))
            completedTask.classList.add("todo-cards-reverse");
          Object.keys(categoryTasks)
            .sort()
            .reduce((accumulator, key) => {
              checkAndUpdateTask(
                categoryTasks[key],
                categoryTasks[key].taskProgress
              );
            }, {});
          break;
        case "start-date":
          completedStartDate.classList.toggle("fa-arrow-down-9-1");
          completedTask.replaceChildren();
          completedTask.classList.remove("todo-cards-reverse");
          if (!completedStartDate.classList.contains("fa-arrow-down-9-1"))
            completedTask.classList.add("todo-cards-reverse");
          let sortedByDate = Object.values(categoryTasks).sort((a, b) =>
            a.startDate > b.startDate ? 1 : -1
          );
          Object.values(sortedByDate).forEach((value) => {
            checkAndUpdateTask(value, value.taskProgress);
          });
          break;
        case "end-date":
          completedDueDate.classList.toggle("fa-arrow-down-9-1");
          completedTask.replaceChildren();
          completedTask.classList.remove("todo-cards-reverse");
          if (!completedDueDate.classList.contains("fa-arrow-down-9-1"))
            completedTask.classList.add("todo-cards-reverse");
          let sortedByEndDate = Object.values(categoryTasks).sort((a, b) =>
            a.endDate > b.endDate ? 1 : -1
          );
          Object.values(sortedByEndDate).forEach((value) => {
            checkAndUpdateTask(value, value.taskProgress);
          });
          break;
        case "none":
          completedTask.replaceChildren();
          Object.values(categoryTasks).forEach((value) => {
            checkAndUpdateTask(value, value.taskProgress);
          });
          break;
      }
      break;
  }
}

// Event Listeners

input.addEventListener("keyup", getAllTasksForFilter);
