export let numSelected = null;
export function selectNumber() {
  // console.log(numSelected);
  if (numSelected != null) {
    numSelected.classList.remove("number-selected");
  }
  numSelected = this;
  if (dateTile) {
    numSelected.classList.add("date-selected");
  }
  if (number) {
    numSelected.classList.add("number-selected");
  }
  if (timeList) {
    numSelected.classList.add("time-selected");
  }
}
