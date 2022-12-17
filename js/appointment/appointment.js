import { message } from "../message/message.js";

const dateCont = document.querySelector(".date-cont");
const date = document.getElementById("date");
const time = document.getElementById("time");
const formCont = document.querySelector(".formCont");
const appointmentForm = document.getElementById("appointmentForm");
const fullName = document.getElementById("fullname");
const fullnameError = document.getElementById("fullnameError");
const email = document.getElementById("email");
const emailError = document.getElementById("emailError");
const dateError = document.getElementById("dateError");
const timeError = document.getElementById("timeError");
const successMessage = document.getElementById("messageSent");

let cal = 1;
let dateSelected = null;

const url1 =
  "https://sheets.googleapis.com/v4/spreadsheets/1yiF60cQio0nA5zqS0OltjEhi7BFu0KgNTfslZ3FQoKA/values/Cal" +
  cal +
  "!A1:I9?&key=AIzaSyBH_CwQRbwk6m0FKYcSnJEZl7OARPTsLW4";
// console.log(url1);

const url2 =
  "https://sheets.googleapis.com/v4/spreadsheets/1yiF60cQio0nA5zqS0OltjEhi7BFu0KgNTfslZ3FQoKA/values/Cal" +
  cal +
  "!A10:A20?&key=AIzaSyBH_CwQRbwk6m0FKYcSnJEZl7OARPTsLW4";
// console.log(url2);

const postUrl = "https://formspree.io/f/xbjbwrav";

async function dateApi() {
  try {
    const sheets1 = await fetch(url1);
    const dateResult = await sheets1.json();
    // console.log(dateResult);

    const sheetsDateResult = dateResult.values;
    // console.log(sheetsDateResult);

    // getDate(sheetsDateResult);

    for (let r = 1; r < sheetsDateResult.length; r++) {
      for (let c = 0; c < 8; c++) {
        let dateTile = document.createElement("div");
        if (sheetsDateResult[r][c]) {
          dateTile.innerText = sheetsDateResult[r][c];
          dateTile.setAttribute(
            "value",
            sheetsDateResult[r][c] +
              "/" +
              sheetsDateResult[0][0] +
              "/" +
              sheetsDateResult[0][1]
          );
          dateTile.addEventListener("click", selectDate);
          // dateTile.addEventListener("click", getValue);
        }
        if (sheetsDateResult[r][c] === sheetsDateResult[r][0]) {
          dateTile.classList.add("week-number");
        }
        if (sheetsDateResult[r][c] === sheetsDateResult[1][c]) {
          dateTile.classList.add("week-header");
        }
        if (
          sheetsDateResult[r][c] === sheetsDateResult[r][6] ||
          sheetsDateResult[r][c] === sheetsDateResult[r][7]
        ) {
          if (sheetsDateResult[r][c]) {
            dateTile.classList.add("weekend");
          }
        }
        dateTile.classList.add("dateTile");
        date.appendChild(dateTile);
      }
    }
  } catch (error) {
    console.log(error);
    dateCont.innerHTML = message("error", error);
  }
}

dateApi();

function selectDate() {
  if (dateSelected != null) {
    dateSelected.classList.remove("date-selected");
  }
  dateSelected = this;
  //   console.log(this.classList);
  if (this.classList[0] !== "week-number") {
    dateSelected.classList.add("date-selected");
  }
}

function preventDefault(e) {
  e.preventDefault();
  let dateChoosen = "";
  if (dateSelected) {
    // console.log(dateSelected.getAttribute("value"));
    dateChoosen = dateSelected.getAttribute("value");
  }
  let timeChoosen = "";
  if (time) {
    // console.log(time.value);
    timeChoosen = time.value;
  }
  console.log(dateChoosen);
  console.log(timeChoosen);
  if (validateLength(fullName.value, 5) === true) {
    fullnameError.style.display = "none";
  } else {
    fullnameError.style.display = "block";
  }

  if (validateEmail(email.value) === true) {
    emailError.style.display = "none";
  } else {
    emailError.style.display = "block";
  }

  if (dateChoosen) {
    dateError.style.display = "none";
  } else {
    dateError.style.display = "block";
  }

  if (timeChoosen === "undefined") {
    timeError.style.display = "block";
    console.log("yes");
  } else {
    timeError.style.display = "none";
  }

  if (
    validateEmail(email.value) === true &&
    validateLength(fullName.value, 5) === true &&
    dateChoosen &&
    timeChoosen !== "undefined"
  ) {
    const data = {
      name: fullName.value,
      email: email.value,
      date: dateChoosen,
      time: timeChoosen,
    };
    postData(data).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
    });
    successMessage.innerHTML = "Booking Sent";
    formCont.style.display = "none";
  }
  //   console.log(dateChoosen);
  //   console.log(timeChoosen);
}
appointmentForm.addEventListener("submit", preventDefault);

// function getValue() {
//   let dateChoosen = "";
//   if (dateSelected) {
//     // console.log(dateSelected.getAttribute("value"));
//     dateChoosen = dateSelected.getAttribute("value");
//   }
//   let timeChoosen = "";
//   if (time) {
//     // console.log(time.value);
//     timeChoosen = time.value;
//   }
//   //   console.log(dateChoosen);
//   //   console.log(timeChoosen);

//   appointmentForm.addEventListener(
//     "submit",
//     submitForm(dateChoosen, timeChoosen)
//   );
// }

// function submitForm(dateChoosen, timeChoosen) {
//   console.log(dateChoosen);
//   console.log(timeChoosen);
//   if (validateLength(fullName.value, 5) === true) {
//     fullnameError.style.display = "none";
//   } else {
//     fullnameError.style.display = "block";
//   }

//   if (validateEmail(email.value) === true) {
//     emailError.style.display = "none";
//   } else {
//     emailError.style.display = "block";
//   }

//   if (
//     validateEmail(email.value) === true &&
//     validateLength(fullName.value, 5) === true
//   ) {
//     const data = {
//       name: fullName.value,
//       email: email.value,
//       date: dateChoosen,
//       time: timeChoosen,
//     };
//     postData(data).then((data) => {
//       console.log(data); // JSON data parsed by `data.json()` call
//     });
//     successMessage.innerHTML = "Booking Sent";
//     formCont.style.display = "none";
//   }
// }

async function timeApi() {
  try {
    const sheets2 = await fetch(url2);
    const timeResult = await sheets2.json();
    // console.log(timeResult);
    const sheetsTimeResult = timeResult.values;
    // console.log(sheetsTimeResult);

    getTime(sheetsTimeResult);
  } catch (error) {
    console.log(error);
    dateCont.innerHTML = message("error", error);
  }
}

timeApi();

function getTime(sheetsTimeResult) {
  for (let i = 1; i < sheetsTimeResult.length; i++) {
    let timeList = document.createElement("option");
    console.log(timeList);
    timeList.setAttribute("value", sheetsTimeResult[i][0]);
    console.log(timeList.getAttribute("value"));
    if (timeList.getAttribute("value") === "undefined") {
      timeList.innerText = "";
    } else {
      timeList.innerText = "Kl. " + sheetsTimeResult[i][0];
      timeList.classList.add("timeList");
    }
    time.appendChild(timeList);
    // time.addEventListener("click", getValue);
  }
}

function validateLength(value, len) {
  if (value.trim().length >= len) {
    return true;
  } else {
    return false;
  }
}

function validateEmail(email) {
  const regEx = /\S+@\S+\.\S+/;
  const patternMatches = regEx.test(email);
  return patternMatches;
}

async function postData(data) {
  const response = await fetch(postUrl, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}
