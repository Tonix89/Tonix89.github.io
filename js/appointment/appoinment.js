import { message } from "../message/message.js";

const dateCont = document.querySelector(".date-cont");
const date = document.getElementById("date");
const time = document.getElementById("time");
let cal = 1;

const url1 =
  "https://sheets.googleapis.com/v4/spreadsheets/1yiF60cQio0nA5zqS0OltjEhi7BFu0KgNTfslZ3FQoKA/values/Cal" +
  cal +
  "!A1:H9?&key=AIzaSyBH_CwQRbwk6m0FKYcSnJEZl7OARPTsLW4";
console.log(url1);

const url2 =
  "https://sheets.googleapis.com/v4/spreadsheets/1yiF60cQio0nA5zqS0OltjEhi7BFu0KgNTfslZ3FQoKA/values/Cal" +
  cal +
  "!A10:A20?&key=AIzaSyBH_CwQRbwk6m0FKYcSnJEZl7OARPTsLW4";
console.log(url2);

async function dateApi() {
  try {
    const sheets1 = await fetch(url1);
    const dateResult = await sheets1.json();
    console.log(dateResult);

    const sheetsDateResult = dateResult.values;
    console.log(sheetsDateResult);

    getDate(sheetsDateResult);
  } catch (error) {
    console.log(error);
    dateCont.innerHTML = message("error", error);
  }
}

dateApi();

async function timeApi() {
  try {
    const sheets2 = await fetch(url2);
    const timeResult = await sheets2.json();
    console.log(timeResult);
    const sheetsTimeResult = timeResult.values;
    console.log(sheetsTimeResult);

    getTime(sheetsTimeResult);
  } catch (error) {
    console.log(error);
    dateCont.innerHTML = message("error", error);
  }
}

timeApi();

function getDate(sheetsDateResult) {
  for (let r = 1; r < sheetsDateResult.length; r++) {
    for (let c = 0; c < 8; c++) {
      // console.log(preFilledTiles.length);
      // console.log(r);
      // console.log(c);
      // console.log(preFilledTiles[r][c]);
      let dateTile = document.createElement("div");
      if (sheetsDateResult[r][c]) {
        dateTile.innerText = sheetsDateResult[r][c];
        dateTile.setAttribute("values", sheetsDateResult[r][c]);
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
      //   if (sheetsResult[r][6] || sheetsResult[r][7]) {
      //     tile.classList.add("weekend");
      //   }
      //   if (r == 2 || r == 5) {
      //     tile.classList.add("horizontal-line");
      //   }
      //   if (c == 2 || c == 5) {
      //     tile.classList.add("vertical-line");
      //   }
      //   if (once) {
      //     tile.addEventListener("click", selectedTile);
      //   }
      dateTile.classList.add("dateTile");
      date.appendChild(dateTile);
    }
  }
}

function getTime(sheetsTimeResult) {
  for (let i = 1; i < sheetsTimeResult.length; i++) {
    let timeList = document.createElement("li");
    timeList.innerText = sheetsTimeResult[i][0];
    timeList.setAttribute("values", sheetsTimeResult[i][0]);
    timeList.classList.add("timeList", "dropdown-item");
    time.appendChild(timeList);
  }
}
