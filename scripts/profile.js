// Dom Elements

var profileIcon = document.getElementById("profile-icon");
var profileBar = document.getElementById("profile-bar");
var deleteAccount = document.getElementById("delete-account");
var logout = document.getElementById("logout");
var loggedUserName = document.getElementById("logged-username");
var loggedUserType = document.getElementById("logged-usertype");
var deletePopup = document.getElementById("confirm-delete-account");
var deletePopupClose = document.getElementById("delete-close-button");
var deleteConfirMessage = document.getElementById(
  "delete-confirmation-message"
);
var deleteButtonMessage = document.getElementById("delete-confirm");
var deleteCancel = document.getElementById("delete-cancel");
var updateLiveTime = document.getElementById("current-time");
var updateLiveDate = document.getElementById("current-date");
var todoContainer = document.getElementById("todo-container");

var month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

async function showProfileBar() {
  let userData = await getLoggedUserData(loginUseremail.value.toLowerCase());
  loggedUserName.innerHTML = userData.username;
  if (userData.usertype) {
    loggedUserType.innerHTML = userData.usertype;
  }
  profileBar.classList.toggle("display-profile");
}

function disableProfileSection() {
  profileBar.classList.remove("display-profile");
}

function deleteAccountConfirmation() {
  deleteConfirMessage.innerHTML = `Are you Sure want to delete your account ? <br /><br>`;
  closeDeletePopup();
  showProfileBar();
}

function confirmLogoutProfile() {
  deleteConfirMessage.innerHTML = `Are you Sure want to Logout ?<br><Br>`;
  closeDeletePopup();
  showProfileBar();
}

function closeDeletePopup() {
  deletePopup.classList.toggle("show-modal");
}

function deleteAccountPermanent() {
  if (deleteButtonMessage.innerHTML === "Yes Logout") {
    window.location.reload();
  } else {
    deleteUserAccount(loginUseremail.value.toLowerCase());
    window.location.reload();
    deleteCancel.click();
  }
}

function liveTime() {
  let currentDateTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  currentDateTime = currentDateTime.split(",");
  let currentDateOfCity = currentDateTime[0].split("/");
  let currentTime = currentDateTime[1].split(" ");
  let currentTimeOfCity = currentTime[1];
  let [currentMonth, currentDate, currentYear] = currentDateOfCity;
  let [currentHour, minute, second] = currentTimeOfCity.split(":");
  if (currentHour < 10) {
    currentHour = "0" + currentHour;
  }
  if (currentDate < 10) {
    currentDate = "0" + currentDate;
  }
  updateLiveTime.innerHTML = `${currentHour}:${minute} ${currentTime[2]}`;
  updateLiveDate.innerHTML = `${currentDate}-${
    month[currentMonth - 1]
  }-${currentYear}`;
}

setInterval(liveTime, 1000);

// Event Listeners

todoContainer.addEventListener("click", disableProfileSection);
profileIcon.addEventListener("click", showProfileBar);
deleteAccount.addEventListener("click", deleteAccountConfirmation);
logout.addEventListener("click", confirmLogoutProfile);
deletePopupClose.addEventListener("click", closeDeletePopup);
deleteCancel.addEventListener("click", closeDeletePopup);
deleteButtonMessage.addEventListener("click", deleteAccountPermanent);
