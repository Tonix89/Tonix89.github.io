const textCont = document.getElementsByClassName("typewrite");
const textData = [
  "Hi, I'm a Front-End Developer.",
  "Hei, Jeg er front-end Utvikler.",
  "Uy, Front-end developer diay ko.",
];

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
    typeSpeed = this.reverseAfter;
    this.textDeleting = true;
  } else if (this.textDeleting && this.text === "") {
    this.textDeleting = false;
    this.initialLoop++;
    typeSpeed = 500;
  }

  setTimeout(function () {
    that.type();
  }, typeSpeed);
};
