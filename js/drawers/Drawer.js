class Drawer {
  constructor() {
    this.drawingEl = document.getElementById("canvas--drawing");
  }

  scaleFromLevel(zoomLevel) {
    let zoomScale = 7 / 16 * zoomLevel + 1;
    if (zoomLevel < 0) {
      zoomScale = 16 ** (zoomLevel / 20);
    }
    return zoomScale;
  }

  resetEl(el) {
    ["aspectRatio", "width", "top", "left", "position"].forEach(s => el.style[s] = "unset");
  }
}

export { Drawer };
