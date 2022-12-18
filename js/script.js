const textCont = document.getElementsByClassName("typewrite");
const game = document.getElementsByClassName("typewrite-game");
const index = document.getElementsByClassName("typewrite-index");
// console.log(game.length);
// console.log(index.length);

const textData1 = [
  "Hi, I'm a Front-End Developer.",
  "Hei, Jeg er front-end Utvikler.",
  "Uy, Front-end developer diay ko.",
];

const textData2 = ["Sorry, This page is under construction."];

window.onload = function () {
  for (let i = 0; i < textCont.length; i++) {
    new myFunction(textCont[i]);
  }
};

myFunction = function (textContainer) {
  this.sentCont = textContainer;
  this.initialLoop = 0;
  this.reverseAfter = 1000;
  this.text = "";
  this.type();
  this.textDeleting = false;
};

myFunction.prototype.type = function () {
  let textData = "";
  let indexPage = false;
  if (game.length === 1 && index.length === 0) {
    console.log("yes");
    textData = textData2;
  } else {
    textData = textData1;
    indexPage = true;
  }
  const sentence = textData[this.initialLoop % textData.length];

  if (this.textDeleting) {
    this.text = sentence.substring(0, this.text.length - 1);
  } else {
    this.text = sentence.substring(0, this.text.length + 1);
  }

  this.sentCont.innerHTML = '<span class="wrap">' + this.text + "</span>";

  const that = this;
  let typeSpeed = 200 - Math.random() * 100;

  if (this.textDeleting) {
    typeSpeed /= 5;
  }

  if (!this.textDeleting && this.text === sentence) {
    if (indexPage) {
      typeSpeed = this.reverseAfter;
      this.textDeleting = true;
    } else {
      typeSpeed = this.reverseAfter;
      this.textDeleting = false;
    }
  } else if (this.textDeleting && this.text === "") {
    this.textDeleting = false;
    this.initialLoop++;
    typeSpeed = 500;
  }

  setTimeout(function () {
    that.type();
  }, typeSpeed);
};
