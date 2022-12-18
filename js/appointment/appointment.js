import { message } from "../message/message.js";

const dateCont = document.querySelector(".date-cont");
const date = document.getElementById("date");
const month = document.getElementById("month");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const time = document.getElementById("time");
const formCont = document.querySelector(".formCont");
const appointmentForm = document.getElementById("appointmentForm");
const fullName = document.getElementById("fullname");
const fullnameError = document.getElementById("fullnameError");
const email = document.getElementById("email");
const emailError = document.getElementById("emailError");
const dateError = document.getElementById("dateError");
const timeError = document.getElementById("timeError");

let cal = 1;
let dateSelected = null;

function prevBtn(e) {
  e.preventDefault();
  // console.log(prev.value);
  cal += parseInt(prev.value);
  // console.log(cal);
  const currentDate = document.querySelectorAll(".dateTile");
  currentDate.forEach((cDate) => {
    cDate.remove();
  });
  dateApi();
}
prev.addEventListener("click", prevBtn);

function nextBtn(e) {
  e.preventDefault();
  cal += parseInt(next.value);
  // console.log(cal);
  const currentDate = document.querySelectorAll(".dateTile");
  currentDate.forEach((cDate) => {
    cDate.remove();
  });
  dateApi();
}
next.addEventListener("click", nextBtn);

// console.log(cal);

const url2 =
  "https://sheets.googleapis.com/v4/spreadsheets/1yiF60cQio0nA5zqS0OltjEhi7BFu0KgNTfslZ3FQoKA/values/Cal" +
  cal +
  "!A10:A20?&key=AIzaSyBH_CwQRbwk6m0FKYcSnJEZl7OARPTsLW4";
// console.log(url2);

const postUrl = "https://formspree.io/f/xbjbwrav";

async function dateApi() {
  try {
    const url1 =
      "https://sheets.googleapis.com/v4/spreadsheets/1yiF60cQio0nA5zqS0OltjEhi7BFu0KgNTfslZ3FQoKA/values/Cal" +
      cal +
      "!A1:I9?&key=AIzaSyBH_CwQRbwk6m0FKYcSnJEZl7OARPTsLW4";
    if (cal === 1) {
      prev.style.visibility = "hidden";
    } else {
      prev.style.visibility = "visible";
    }
    if (cal === 4) {
      next.style.visibility = "hidden";
    } else {
      next.style.visibility = "visible";
    }
    // console.log(url1);
    const sheets1 = await fetch(url1);
    const dateResult = await sheets1.json();
    // console.log(dateResult);

    const sheetsDateResult = dateResult.values;
    // console.log(sheetsDateResult);

    // getDate(sheetsDateResult);

    for (let r = 1; r < sheetsDateResult.length; r++) {
      for (let c = 0; c < 8; c++) {
        month.innerText =
          sheetsDateResult[0][0] + " - " + sheetsDateResult[0][1];
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
          // console.log(sheetsDateResult[r][0]);
        }
        if (r === r && c === 0) {
          dateTile.classList.add("week-number");
        }
        if (r === 1 && c === c) {
          dateTile.classList.add("week-header");
        }
        if ((r === r && c === 6) || (r === r && c === 7)) {
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
    formCont.innerHTML = message("error", error);
  }
}

dateApi();

function selectDate() {
  if (dateSelected != null) {
    dateSelected.classList.remove("date-selected");
  }
  dateSelected = this;
  // console.log(this.classList[0]);
  if (
    this.classList[0] !== "week-number" &&
    this.classList[0] !== "week-header"
  ) {
    dateSelected.classList.add("date-selected");
  }
}

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
    formCont.innerHTML = message("error", error);
  }
}

timeApi();

function getTime(sheetsTimeResult) {
  for (let i = 1; i < sheetsTimeResult.length; i++) {
    let timeList = document.createElement("option");
    // console.log(timeList);
    timeList.setAttribute("value", sheetsTimeResult[i][0]);
    // console.log(timeList.getAttribute("value"));
    if (timeList.getAttribute("value") === "undefined") {
      timeList.innerText = "";
    } else {
      timeList.innerText = "Kl. " + sheetsTimeResult[i][0];
      timeList.classList.add("timeList");
    }
    time.appendChild(timeList);
  }
}

function validateForm(e) {
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
  // console.log(dateChoosen);
  // console.log(timeChoosen);
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
    formCont.style.display = "none";
    document.getElementById("sending").style.display = "block";
    postData(data).then((data) => {
      // console.log(data);
      setTimeout(() => {
        if (data.ok) {
          document.getElementById("sending").innerHTML = "Booking Sent";
        } else {
          document.getElementById("sending").innerHTML = "Sorry, " + data.error;
        }
      }, 2000);
    });
  }
}
appointmentForm.addEventListener("submit", validateForm);

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
  try {
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
  } catch (error) {
    console.log(error);
    formCont.innerHTML = message("error", error);
  }
}
