import { Sorter } from "./Sorter.js";
import { ColorSorter } from "./ColorSorter.js";
import { DateSorter } from "./DateSorter.js";

class DateColorSorter extends Sorter {
  constructor(data) {
    super(data, "dateXcolor");

    this.pickers = {
      color: document.getElementById("dateXcolor--sorter--color-picker"),
      interval: document.getElementById("dateXcolor--sorter--interval--input"),
    };

    this.dispatchTimeout = null;
    const dispatchColor = () => {
      this.color = ColorSorter.hexToRgb(this.pickers.color.value);
      document.dispatchEvent(this.sortDataEvent);
    };

    this.pickers.color.addEventListener("input", () => {
      if (this.dispatchTimeout !== null) {
        clearTimeout(this.dispatchTimeout);
      }
      this.dispatchTimeout = setTimeout(dispatchColor, 100);
    });

    this.color = ColorSorter.hexToRgb(this.pickers.color.value);

    this.pickers.interval.value = 1;
    this.pickers.interval.addEventListener("change", () => {
      this.interval = this.pickers.interval.value;
      document.dispatchEvent(this.sortDataEvent);
    });
    this.interval = this.pickers.interval.value;
  }

  sort(validIdsSet) {
    if (!this.enableEl.checked) return;

    const byYear = DateSorter.sortByYear(validIdsSet, this.data, this.interval);

    return byYear.map(({ yearIdx, yearLabel, ids }) => ({
      yearIdx,
      yearLabel,
      ids: ColorSorter.sortIdColors(ids, this.data, this.color).map(x => x.id)
    }));
  }
}

export { DateColorSorter };
