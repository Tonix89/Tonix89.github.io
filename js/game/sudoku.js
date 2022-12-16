import { message } from "../message/message.js";
import { numSelected } from "../extra/select.js";
import { selectNumber } from "../extra/select.js";
const boardCont = document.querySelector(".board");

let errors = 0;
let level = 1;
let nextLevel = 2;
let eachDigit = 9;
let digits = true;
let once = true;

// console.log(url);
async function apiCall() {
  try {
    const url =
      "https://sheets.googleapis.com/v4/spreadsheets/1yPkQ3tfVYV-DtNPtLfLbPDefwgjiLG2CnY5Ra72MmC0/values/Level" +
      level +
      "!A2:I10?&key=AIzaSyBH_CwQRbwk6m0FKYcSnJEZl7OARPTsLW4";

    const board = await fetch(url);
    const boardArray = await board.json();
    // console.log(boardArray);

    const preFilledTiles = boardArray.values;
    // console.log(typeof preFilledTiles);

    if (level === 7) {
      document.getElementById("loader").style.display = "none";
      document.getElementById("digits").style.display = "none";
      document.querySelector(".level").style.display = "none";
      document.querySelector(".errors").style.display = "none";
    } else {
      setGame(preFilledTiles);
    }
  } catch (error) {
    // console.log(error);
    boardCont.innerHTML = message("error", error);
  }
}

apiCall();

function setGame(preFilledTiles) {
  // console.log(preFilledTiles.length);
  if (digits) {
    digits = false;
    for (let i = 1; i <= 9; i++) {
      let number = document.createElement("div");
      number.id = i;
      number.innerText = i;
      number.addEventListener("click", selectNumber);
      number.classList.add("number", "d" + i);
      document.getElementById("digits").appendChild(number);
    }
  }

  for (let r = 0; r < preFilledTiles.length; r++) {
    for (let c = 0; c < preFilledTiles.length; c++) {
      // console.log(preFilledTiles.length);
      // console.log(r);
      // console.log(c);
      // console.log(preFilledTiles[r][c]);
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      if (preFilledTiles[r][c] != "-") {
        document.getElementById("loader").style.display = "none";
        tile.innerText = preFilledTiles[r][c];
        tile.classList.add("tile-start", "n" + preFilledTiles[r][c]);
      }
      if (r == 2 || r == 5) {
        tile.classList.add("horizontal-line");
      }
      if (c == 2 || c == 5) {
        tile.classList.add("vertical-line");
      }
      if (once) {
        tile.addEventListener("click", selectedTile);
      }
      tile.classList.add("tile");
      document.getElementById("board" + level).appendChild(tile);
    }
  }
}

async function selectedTile() {
  try {
    const url1 =
      "https://sheets.googleapis.com/v4/spreadsheets/1yPkQ3tfVYV-DtNPtLfLbPDefwgjiLG2CnY5Ra72MmC0/values/Level" +
      level +
      "!J2:R10?&key=AIzaSyBH_CwQRbwk6m0FKYcSnJEZl7OARPTsLW4";
    // console.log(url1);
    const solution = await fetch(url1);
    const solArray = await solution.json();
    // console.log(solArray);

    const tileSolution = solArray.values;
    // console.log(tileSolution);
    // console.log(this);

    const isTileStart = this.classList[0];
    // console.log(isTileStart);

    if (numSelected) {
      // console.log(this.innerText);
      if (this.style.backgroundColor == "red") {
        this.innerText = "";
        this.style.backgroundColor = "#273141";
      }
      if (this.innerText != "" || isTileStart == "tile-start") {
        return;
      }

      let coords = this.id.split("-");
      let r = parseInt(coords[0]);
      let c = parseInt(coords[1]);
      // console.log(r);
      // console.log(c);
      // console.log(tileSolution[r][c]);
      if (tileSolution[r][c] == numSelected.id) {
        this.style.backgroundColor = "black";
        this.innerText = numSelected.id;
        this.classList.add("tile-start", "n" + numSelected.id, "inserted");
        const singleTile = document.querySelectorAll(".tile-start");
        const allTile = document.querySelectorAll(".tile");
        const nSelected = document.querySelector(".number-selected");
        // console.log(nSelected);
        const nX = document.querySelectorAll(".n" + nSelected.innerText);
        // console.log(nX);
        if (nX.length === eachDigit) {
          nSelected.classList.add("hideDigit");
          nSelected.classList.remove("number-selected");
          numSelected = null;
        }
        if (singleTile.length === allTile.length) {
          errors = 0;
          setTimeout(() => {
            alert(
              "Congratulation, you finished Level:" +
                level +
                ". You just unlock an information about me."
            );
            document.querySelector(".modal-btn-lock-" + level).style.display =
              "none";
            document.querySelector(".modal-btn-unlock-" + level).style.display =
              "block";
            document.getElementById("board" + level).style.display = "none";
            document.getElementById("board" + nextLevel).style.display = "flex";
            const hiddenDigit = document.querySelectorAll(".hideDigit");
            hiddenDigit.forEach((digs) => {
              digs.classList.remove("hideDigit");
              digs.classList.remove("number-selected");
            });
            level += 1;
            nextLevel += 1;
            eachDigit += 9;
            document.getElementById("errors1").style.display = "inline";
            document.getElementById("errors2").style.display = "inline";
            document.getElementById("level").innerText = level;
            document.getElementById("loader").style.display = "flex";
            apiCall();
          }, 1000);
        }
      } else {
        this.innerText = numSelected.id;
        this.classList.add("inserted", "wrong");
        errors += 1;
        document.getElementById("errors" + errors).style.display = "none";
        this.style.backgroundColor = "red";
        if (errors === 3) {
          once = false;
          errors = 0;
          setTimeout(() => {
            alert("Sorry, you made 3 mistakes. You have to do it again.");
            const insertedN = document.querySelectorAll(".inserted");
            insertedN.forEach((ins) => {
              ins.innerText = "";
              ins.style.backgroundColor = "#273141";
              this.style.backgroundColor = "#273141";
              ins.classList.remove("n" + numSelected.id);
              ins.classList.remove("inserted");
            });
            const hiddenDigit = document.querySelectorAll(".hideDigit");
            hiddenDigit.forEach((digs) => {
              digs.classList.remove("hideDigit");
              digs.classList.remove("number-selected");
            });
            document.getElementById("errors1").style.display = "inline";
            document.getElementById("errors2").style.display = "inline";
            document.getElementById("errors3").style.display = "inline";
            once = true;
          }, 1000);
        }
      }
    }
  } catch (error) {
    console.log(error);
    boardCont.innerHTML = message("error", error);
  }
}

window.addEventListener("beforeunload", (e) => {
  const warning =
    "Reloading or leaving the page means you have to start again when you return.";

  // Gecko + IE
  (e || window.event).returnValue = warning;

  // Safari, Chrome, and other WebKit-derived browsers
  return warning;
});
