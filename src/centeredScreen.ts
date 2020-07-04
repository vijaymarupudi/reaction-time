export function centeredScreen(rootScreen: HTMLElement) {

  // not using min-height because of https://stackoverflow.com/questions/8468066/child-inside-parent-with-min-height-100-not-inheriting-height

  // screenContainer takes the dimensions of the rootScreen

  const screenContainer = document.createElement("div");
  rootScreen.appendChild(screenContainer);
  screenContainer.style.width = "100%";
  screenContainer.style.height = "100%";
  screenContainer.style.display = "flex";

  const screen = document.createElement("div");
  // screen is centered within the screen container.
  // this method is for IE compat and for oversized elements to be scrollable
  // https://stackoverflow.com/questions/33454533/cant-scroll-to-top-of-flex-item-that-is-overflowing-container
  screen.style.margin = "auto";
  screenContainer.appendChild(screen);
  return screen;
}
