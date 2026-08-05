import { activationsToImage } from "../utils/colorUtils.js";
import { getLabel } from "../utils/stringLabelUtils.js";
import { Overlay } from "./Overlay.js";

class DetailOverlay extends Overlay {
  // static IMG_URL = "https://197.acervos.at.eu.org/imgs/herbario/arts/500";
  static IMG_URL = "https://acervos-digitais.github.io/herbario-media/imgs/arts/500";

  constructor(metaData, clusterLabels) {
    super("detail");

    this.clusterLabels = clusterLabels;

    this.data = Object.values(metaData).map(x => {
      const { id, color_palette, creator, museum, objects, title, url, year, cluster } = x;
      return { id, color_palette, creator, museum, objects, title, url, year, cluster };
    }).reduce((acc, v) => {
      acc[v.id] = v;
      return acc;
    }, {});

    this.activationImg = document.createElement("canvas");
    this.activationImg.width = 16;
    this.activationImg.height = 16;

    this.loaderEl = document.getElementById("detail-overlay--loader");
    this.imgEl = document.getElementById("detail-overlay--image");
    this.boxesEl = document.getElementById("detail-overlay--boxes");
    this.heatCanvasEl = document.getElementById("detail-overlay--heatmap--canvas");
    this.colorsEl = document.getElementById("detail-overlay--colors");

    this.titleEl = document.getElementById("detail-overlay--title--text");
    this.collectionEl = document.getElementById("detail-overlay--collection--text");
    this.clusterEl = document.getElementById("detail-overlay--cluster--text");
    this.linkEl = document.getElementById("detail-overlay--info--link");
    this.aiTextEl = document.getElementById("detail-overlay--info--subtext");

    const clusterClicked = () => {
      this.clusterEl.classList.toggle("active");
      if (this.clusterEl.classList.contains("active")) {
        this.heatCanvasEl.parentElement.classList.remove("hidden");
      } else {
        this.heatCanvasEl.parentElement.classList.add("hidden");
      }
    }
    this.clusterEl.addEventListener("click", clusterClicked);
  }

  populateDetailOverlay(id, selObjects, selClusters, activations) {
    const data = this.data[id];

    const titleText = data.title == "" ? "untitled" : `${data.title}`;
    const yearText = (data.year > this.nowYear) ? "undated" : `${data.year}`;
    const creatorText = data.creator.includes("http") || data.creator.includes("known") || data.creator.includes("ão identificado") || data.creator == "" ? "unauthored" : `${data.creator}`;

    this.boxesEl.innerHTML = "";
    this.colorsEl.innerHTML = "";
    this.clusterEl.innerHTML = "";

    this.heatCanvasEl.parentElement.classList.add("hidden");
    this.clusterEl.classList.remove("active");

    const drawBoxes = () => {
      this.boxesEl.style.width = `${this.imgEl.width}px`;
      this.boxesEl.style.height = `${this.imgEl.height}px`;
      this.aiTextEl.classList.add("hidden");

      data.objects.filter(o => selObjects.includes(o.label)).forEach(({ box, label, score }) => {
        const boxEl = document.createElement("div");
        boxEl.classList.add("overlay--boxes--box");

        boxEl.style.left = `${box[0] * 100}%`;
        boxEl.style.top = `${box[1] * 100}%`;
        boxEl.style.width = `${(box[2] - box[0]) * 100}%`;
        boxEl.style.height = `${(box[3] - box[1]) * 100}%`;

        // boxEl.innerHTML = `${label}: ${score}`;

        this.boxesEl.appendChild(boxEl);
        this.aiTextEl.classList.remove("hidden");
      });
      this.loaderEl.classList.add("hidden");
      this.imgEl.removeEventListener("load", drawBoxes);
    };

    const drawHeat = () => {
      const actImgCtx = this.activationImg.getContext("2d");
      actImgCtx.putImageData(activationsToImage(activations), 0, 0);

      this.heatCanvasEl.width = this.imgEl.width;
      this.heatCanvasEl.height = this.imgEl.height;
      const heatImgCtx = this.heatCanvasEl.getContext("2d");
      heatImgCtx.clearRect(0, 0, this.heatCanvasEl.width, this.heatCanvasEl.height);

      heatImgCtx.imageSmoothingEnabled = true;
      heatImgCtx.imageSmoothingQuality = "high";

      heatImgCtx.drawImage(this.activationImg, 0, 0, this.heatCanvasEl.width, this.heatCanvasEl.height);

      this.loaderEl.classList.add("hidden");
      this.imgEl.removeEventListener("load", drawHeat);
    };

    this.loaderEl.classList.remove("hidden");
    this.imgEl.addEventListener("load", drawBoxes);
    this.imgEl.addEventListener("load", drawHeat);
    this.imgEl.src = `${DetailOverlay.IMG_URL}/${data.id}.jpg`;

    data.color_palette.forEach(([r, g, b]) => {
      const colorEl = document.createElement("div");
      colorEl.classList.add("overlay--colors--box");
      colorEl.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      this.colorsEl.appendChild(colorEl);
    });

    this.titleEl.innerHTML = `${getLabel(titleText)} (${getLabel(yearText)})<br>${getLabel(creatorText)}`;
    this.collectionEl.innerHTML = `${getLabel("collection")}: ${data.museum}`;

    if (selClusters.length > 0 && selClusters.includes(data.cluster.id)) {
      this.clusterEl.innerHTML = `Cluster: ${this.clusterLabels[data.cluster.id]}`;
    }

    this.linkEl.innerHTML = `${getLabel("information")}`;
    this.linkEl.setAttribute("href", data.url);
    this.linkEl.removeAttribute("download");
  }

  prepareMosaicOverlay() {
    this.loaderEl.classList.remove("hidden");
    this.aiTextEl.classList.add("hidden");
    this.imgEl.src = "";
    [this.boxesEl, this.colorsEl, this.titleEl, this.collectionEl, this.linkEl].forEach(el => el.innerHTML = "");
  }

  populateMosaicOverlay(imgUrl, isAi) {
    this.loaderEl.classList.add("hidden");
    this.imgEl.src = imgUrl;
    this.linkEl.setAttribute("href", imgUrl);
    this.linkEl.setAttribute("download", "acervos.jpg");
    this.linkEl.innerHTML = `${getLabel("download")}`;

    if (isAi) {
      this.aiTextEl.classList.remove("hidden");
    } else {
      this.aiTextEl.classList.add("hidden");
    }
  }
}

export { DetailOverlay };
