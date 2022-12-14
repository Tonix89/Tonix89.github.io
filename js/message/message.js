export function message(messageType = "success", message = "") {
  return `<div>Sorry, we have an error.</div>
  <div ${messageType}>${message}</div>`;
}
