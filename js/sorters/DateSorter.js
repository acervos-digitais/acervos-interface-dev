import { Sorter } from "./Sorter.js";

class DateSorter extends Sorter {
  constructor(data) {
    super(data, "date");

    this.picker = document.getElementById("date--sorter--interval--input");
    this.picker.value = 1;
    this.picker.addEventListener("change", () => {
      this.interval = this.picker.value;
      document.dispatchEvent(this.sortDataEvent);
    });
    this.interval = this.picker.value;
  }

  static sortByYear(ids, data, interval) {
    const yearIdx2Ids = Array.from(ids).reduce((acc, id) => {
      const yearIdx = Math.floor(parseInt(data[id].year) / interval);
      if (!(yearIdx in acc)) {
        acc[yearIdx] = [];
      }
      acc[yearIdx].push(id);
      return acc;
    }, {});

    const byYear = (a, b) => parseInt(a.year) - parseInt(b.year);
    const byYearIdx = (a, b) => parseInt(a.yearIdx) - parseInt(b.yearIdx);

    return Object.entries(yearIdx2Ids).map(([yearIdx, ids]) => ({
      yearIdx,
      yearLabel: [Math.floor(interval * yearIdx), Math.floor(interval * yearIdx) + interval - 1],
      ids: ids.toSorted(byYear)
    })).toSorted(byYearIdx);
  }

  sort(validIdsSet) {
    if (!this.enableEl.checked) return;

    return DateSorter.sortByYear(validIdsSet, this.data, this.interval);
  }
}

export { DateSorter };
