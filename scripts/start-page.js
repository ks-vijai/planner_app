// Dom Elements
let loginPage = document.getElementById("login-page");
let signupPage = document.getElementById("signup-page");
let todoDashboard = document.getElementById("todo-dashboard");
let logoSection = document.getElementById("logo-section");
let loginUseremail = document.getElementById("login-email");
let loginUserPassword = document.getElementById("login-password");
let username = document.getElementById("username");
let useremail = document.getElementById("user-email");
let usertypes = document.getElementById("user-types");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirm-password");
let passwordEye = document.getElementById("password-eye");
let confirmPasswordEye = document.getElementById("confirm-password-eye");
let loginPasswordEye = document.getElementById("login-password-eye");
let userTypeOptions = document.getElementById("user-type-options");
let userTypeBox = document.getElementById("user-types-box");

// Default opening page
signupPage.style.display = "none";
loginPage.style.display = "block";
todoDashboard.style.display = "none";

var validEmail =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var validPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,15}$/;

function passwordValidation() {
  password.onpaste = (event) => event.preventDefault();
  confirmPassword.onpaste = (event) => event.preventDefault();
  loginUserPassword.onpaste = (event) => event.preventDefault();
}

function signupValidation() {
  if (username.value.length < 1) {
    username.setCustomValidity("Enter a valid username");
    username.reportValidity();
  } else {
    if (!useremail.value.match(validEmail)) {
      useremail.setCustomValidity("Enter a valid email");
      useremail.reportValidity();
    } else {
      if (password.value.length < 8) {
        password.setCustomValidity(
          "Password must contains atleast 8 Characters"
        );
        password.reportValidity();
      } else {
        if (!password.value.match(validPassword)) {
          password.setCustomValidity(
            "Password should contain atleast one number and one special character"
          );
          password.reportValidity();
        } else {
          if (!(password.value === confirmPassword.value)) {
            confirmPassword.setCustomValidity(
              "Password and Confirm Password must be same"
            );
            confirmPassword.reportValidity();
          } else {
            let userType;
            if (
              usertypes.innerHTML === "Student" ||
              usertypes.innerHTML === "Professional"
            ) {
              userType = usertypes.innerHTML;
            } else {
              userType = "";
            }
            let userdetails = {
              username: username.value,
              useremail: useremail.value.toLowerCase(),
              usertype: userType,
              password: password.value,
            };
            getAndValidateUserData(userdetails);
          }
        }
      }
    }
  }
}

function writeToSelect(type) {
  if (type) {
    usertypes.innerHTML = type;
    showDropDownUserType();
  }
}

function loginVerification() {
  if (!loginUseremail.value.toLowerCase().match(validEmail)) {
    loginUseremail.setCustomValidity("Enter a valid email");
    loginUseremail.reportValidity();
  } else {
    if (loginUserPassword.value.length === 0) {
      loginUserPassword.setCustomValidity("Fill the Password Field");
      loginUserPassword.reportValidity();
    } else {
      if (!loginUserPassword.value.match(validPassword)) {
        loginUserPassword.setCustomValidity(
          "Invalid Password.. Fill the Correct Password"
        );
        loginUserPassword.reportValidity();
      } else {
        let loginUserDetails = {
          useremail: loginUseremail.value.toLowerCase().toLowerCase(),
          userPassword: loginUserPassword.value,
        };
        getAndValidateLoginUserData(loginUserDetails);
      }
    }
  }
}

function showDropDownUserType() {
  userTypeOptions.classList.toggle("hide-display-options");
}

function redirectLoginPage() {
  loginPage.style.display = "block";
  loginPage.classList.add("active");
  todoDashboard.style.display = "none";
  signupPage.style.display = "none";
}

function redirectSignUp() {
  loginPage.style.display = "none";
  todoDashboard.style.display = "none";
  signupPage.style.display = "block";
  signupPage.classList.add("active");
}

function showPassword(passwordElement, element) {
  passwordElement.classList.toggle("fa-eye-slash");
  if (element.type === "text") {
    element.type = "password";
  } else {
    element.type = "text";
  }
}

function showConfirmPassword(passwordElement) {
  passwordElement.classList.toggle("fa-eye-slash");
  if (confirmPassword.type === "text") {
    confirmPassword.type = "password";
  } else {
    confirmPassword.type = "text";
  }
}

// Event Listeners

passwordEye.addEventListener("click", () =>
  showPassword(passwordEye, password)
);
confirmPasswordEye.addEventListener("click", () =>
  showPassword(confirmPasswordEye, confirmPassword)
);
loginPasswordEye.addEventListener("click", () =>
  showPassword(loginPasswordEye, loginUserPassword)
);
userTypeBox.addEventListener("click", showDropDownUserType);
