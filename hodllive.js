// Everyone
const channels = [
  "GURA",
  "CALLIOPE",
  "AMELIA",
  "INANIS",
  "KIARA",
  "SORA",
  "ROBOCO",
  "MIKO",
  "SUISEI",
  "MEL",
  "MATSURI",
  "FUBUKI",
  "AKI",
  "HAATO",
  "AQUA",
  "SHION",
  "AYAME",
  "CHOCO",
  "SUBARU",
  "MIO",
  "OKAYU",
  "KORONE",
  "PEKORA",
  "RUSHIA",
  "FLARE",
  "NOEL",
  "MARINE",
  "KANATA",
  "COCO",
  "WATAME",
  "TOWA",
  "LUNA",
  "LAMY",
  "NENE",
  "BOTAN",
  "POLKA",
  "RISU",
  "MOONA",
  "IOFI",
  "MIYABI",
  "KIRA",
  "IZURU",
  "ARURAN",
  "RIKKA",
  "ASTEL",
  "TEMMA",
  "ROBERU",
  "SHIEN",
  "OGA",
];

// Generations
const generations = {
  "Hololive EN": ["GURA", "CALLIOPE", "AMELIA", "INANIS", "KIARA"],
  "JP 0th Gen": ["SORA", "ROBOCO", "MIKO", "SUISEI"],
  "JP 1st Gen": ["MEL", "MATSURI", "FUBUKI", "AKI", "HAATO"],
  "JP 2nd Gen": ["AQUA", "SHION", "AYAME", "CHOCO", "SUBARU"],
  "Hololive Gamers": ["FUBUKI", "MIO", "OKAYU", "KORONE"],
  "JP 3rd Gen": ["PEKORA", "RUSHIA", "FLARE", "NOEL", "MARINE"],
  "JP 4th Gen": ["KANATA", "COCO", "WATAME", "TOWA", "LUNA"],
  "JP 5th Gen": ["LAMY", "NENE", "BOTAN", "POLKA"],
  "Hololive ID": ["RISU", "MOONA", "IOFI"],
  "Holostars 1st Gen": ["MIYABI", "KIRA", "IZURU", "ARURAN", "RIKKA"],
  "Holostars 2nd Gen": ["ASTEL", "TEMMA", "ROBERU"],
  "Holostars 3rd Gen": ["SHIEN", "OGA"],
};

const names = {
  GURA: "Gura",
  CALLIOPE: "Calliope",
  AMELIA: "Amelia",
  INANIS: "Ina'nis",
  KIARA: "Kiara",
  SORA: "Sora",
  ROBOCO: "Roboco",
  MIKO: "Miko",
  SUISEI: "Suisei",
  MEL: "Mel",
  MATSURI: "Matsuri",
  FUBUKI: "Fubuki",
  AKI: "Aki",
  HAATO: "Haato",
  AQUA: "Aqua",
  SHION: "Shion",
  AYAME: "Ayame",
  CHOCO: "Choco",
  SUBARU: "Subaru",
  MIO: "Mio",
  OKAYU: "Okayu",
  KORONE: "Korone",
  PEKORA: "Pekora",
  RUSHIA: "Rushia",
  FLARE: "Flare",
  NOEL: "Noel",
  MARINE: "Marine",
  KANATA: "Kanata",
  COCO: "Coco",
  WATAME: "Watame",
  TOWA: "Towa",
  LUNA: "Luna",
  LAMY: "Lamy",
  NENE: "Nene",
  BOTAN: "Botan",
  POLKA: "Polka",
  RISU: "Risu",
  MOONA: "Moona",
  IOFI: "Iofi",
  MIYABI: "Miyabi",
  KIRA: "Kira",
  IZURU: "Izuru",
  ARURAN: "Aruran",
  RIKKA: "Rikka",
  ASTEL: "Astel",
  TEMMA: "Temma",
  ROBERU: "Roberu",
  SHIEN: "Shien",
  OGA: "Oga",
};

const colors = {
  GURA: "#2d6d99",
  CALLIOPE: "#fbccdc",
  AMELIA: "#ffe3b8",
  INANIS: "#695c81",
  KIARA: "#fa8155",
  SORA: "#7a463d",
  ROBOCO: "#a600de",
  MIKO: "#f98990",
  SUISEI: "#77a9eb",
  MEL: "#eebd81",
  MATSURI: "#e69b48",
  FUBUKI: "#a3E0fd",
  AKI: "#efd0ac",
  HAATO: "#e0455d",
  AQUA: "#eaabdb",
  SHION: "#7c4c95",
  AYAME: "#d00005",
  CHOCO: "#a23d46",
  SUBARU: "#e6ed71",
  MIO: "#c32338",
  OKAYU: "#c6aad7",
  KORONE: "#a6716c",
  PEKORA: "#aabfee",
  RUSHIA: "#69c8b4",
  FLARE: "#ff4e26",
  NOEL: "#556679",
  MARINE: "#ab4c4a",
  KANATA: "#3183f1",
  COCO: "#fe935d",
  WATAME: "#dec984",
  TOWA: "#b08fc6",
  LUNA: "#f9aed5",
  LAMY: "#b9def0",
  NENE: "#fe7530",
  BOTAN: "#4b444e",
  POLKA: "#c11c32",
  RISU: "#f6bbbb",
  MOONA: "#b19edd",
  IOFI: "#8fc04f",
  MIYABI: "#ae3533",
  KIRA: "#93d1cd",
  IZURU: "#6481c3",
  ARURAN: "#48746d",
  RIKKA: "#694f5c",
  ASTEL: "#3a5ad3",
  TEMMA: "#f7dba9",
  ROBERU: "#87180f",
  SHIEN: "#65447f",
  OGA: "#446324",
};

// UI Stuff
function createGenerationTree() {
  return Object.entries(generations).map(([generation, members]) => ({
    label: generation,
    children: members.map((member) => ({
      id: member,
      label: names[member],
    })),
  }));
}

/*
Stupid hack to get around the fact that vue-chartjs seems to assume
that there's only one chart on the page
*/
const reactiveChart = Vue.component("reactive-chart", {
  extends: VueChartJs.Line,
  mixins: [VueChartJs.mixins.reactiveProp],
  props: ["options"],
  // [Big sigh] options are not reactive in vue-chartjs
  watch: {
    options: {
      deep: true,
      handler() {
        this.renderChart(this.chartData, this.options);
      },
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
});

Vue.component("value-chart", {
  extends: reactiveChart,
});

Vue.component("rate-chart", {
  extends: reactiveChart,
});

Vue.component("rank-chart", {
  extends: reactiveChart,
});

ELEMENT.locale(ELEMENT.lang.en);
const vChart = new Vue({
  el: "#chart-all",
  data: {
    // Hardcoded values
    constants: {
      generationTree: createGenerationTree(),
    },
    // Computed from hodllive.json
    viewershipStats: {
      // map of member -> date -> { views, subs }
      byMember: null,
      // map of date -> member -> { views, subs }
      byDate: null,
    },
    dateRange: {
      minDate: null,
      maxDate: null,
    },
    // Dynamic configuration values
    activeTab: "value",
    dimension: "subs",
    memberSearch: null,
    selectedMembers: generations["Hololive EN"],
    selectedDateRange: [],
  },
  computed: {
    // Date manipulation is dependent on the range of dates present in viwershipStats
    selectDateRangeOptions() {
      const { minDate, maxDate } = this.dateRange;
      return {
        shortcuts: createDateRangeShortcuts(minDate, maxDate),
        disabledDate: bindIsDateInRange(minDate, maxDate),
      };
    },
    // Adapt the current configuration to fit the dataset format that chartjs is expecting
    valueChartData() {
      return getValueDatasets(
        this.viewershipStats,
        this.selectedMembers,
        this.selectedDateRange,
        this.dimension
      );
    },
    valueChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text:
            this.dimension === "subs"
              ? "Subscriber count vs. Date"
              : "View count vs. Date",
        },
        tooltips: {
          enabled: true,
          mode: "single",
          callbacks: {
            title: function (tooltipItems) {
              // Take just the calendar date
              // Tooltips are formatted like Sep 9, 2020, 12:00 AM
              return tooltipItems[0].label.split(",").slice(0, 2).join(",");
            },
            label: function (tooltipItem, datasets) {
              // Name: Styled Number
              return `${
                datasets.datasets[tooltipItem.datasetIndex].label
              }: ${formatApproximateCount(Number(tooltipItem.value))}`;
            },
          },
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                type: "linear",
                callback: function (value) {
                  return formatApproximateCount(value);
                },
              },
            },
          ],
        },
        hover: {
          mode: "point",
        },
      };
    },
    rateChartData() {
      return getRateDatasets(
        this.viewershipStats,
        this.selectedMembers,
        this.selectedDateRange,
        this.dimension
      );
    },
    rateChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text:
            this.dimension === "subs"
              ? "Rate of subscriber count change vs. Date"
              : "Rate of view count change vs. Date",
        },
        tooltips: {
          enabled: true,
          mode: "single",
          callbacks: {
            title: function (tooltipItems) {
              // Take just the calendar date
              // Tooltips are formatted like Sep 9, 2020, 12:00 AM
              return tooltipItems[0].label.split(",").slice(0, 2).join(",");
            },
            label: function (tooltipItem, datasets) {
              // Name: Styled Number
              return `${
                datasets.datasets[tooltipItem.datasetIndex].label
              }: ${formatApproximateCount(Number(tooltipItem.value))}`;
            },
          },
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                type: "linear",
                callback: function (value) {
                  return formatApproximateCount(value);
                },
              },
            },
          ],
        },
        hover: {
          mode: "point",
        },
      };
    },
    rankChartData() {
      return getRankDatasets(
        this.viewershipStats,
        this.selectedMembers,
        this.selectedDateRange,
        this.dimension
      );
    },
    rankChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text:
            this.dimension === "subs"
              ? "Subscriber rank vs. Date"
              : "View rank vs. Date",
        },
        tooltips: {
          enabled: true,
          mode: "single",
          callbacks: {
            title: function (tooltipItems) {
              // Take just the calendar date
              // Tooltips are formatted like Sep 9, 2020, 12:00 AM
              return tooltipItems[0].label.split(",").slice(0, 2).join(",");
            },
          },
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day",
              },
            },
          ],
          yAxes: [
            {
              type: "linear",
              ticks: {
                stepSize: 1,
                reverse: true,
              },
            },
          ],
        },
        hover: {
          mode: "point",
        },
      };
    },
  },
  methods: {
    clearSelectedMembers() {
      this.selectedMembers.forEach((member) =>
        this.$refs.memberSelect.setChecked(member, false)
      );
      this.selectedMembers.splice(0);
    },
    setMemberCheck(node, checked) {
      // Only member checkboxes have ids
      if (node.id) {
        this.selectMember(node.id, checked);
      }
    },
    setActiveTab(index) {
      this.activeTab = index;
    },
    selectMemberPreset(value) {
      if (value === "daily-top-5") {
        this.clearSelectedMembers();
        topNOnDate(
          this.viewershipStats,
          5,
          this.dateRange.maxDate,
          this.dimension
        ).forEach((member) => this.selectMember(member, true));
      } else if (value === "daily-top-10") {
        this.clearSelectedMembers();
        topNOnDate(
          this.viewershipStats,
          10,
          this.dateRange.maxDate,
          this.dimension
        ).forEach((member) => this.selectMember(member, true));
      }
    },
    completeMemberSearch(value) {
      const candidates = Object.entries(names).filter(([member, name]) =>
        name.toLowerCase().startsWith(value)
      );
      if (candidates.length === 1) {
        const [selectedMember, _] = candidates[0];
        this.selectMember(selectedMember, true);
        this.memberSearch = null;
      }
    },
    selectMember(member, selected) {
      const selectedMemberIndex = this.selectedMembers.indexOf(member);
      if (selected && selectedMemberIndex === -1) {
        this.selectedMembers.push(member);
        this.$refs.memberSelect.setChecked(member, true);
      } else if (!selected && selectedMemberIndex !== -1) {
        this.selectedMembers.splice(selectedMemberIndex, 1);
        this.$refs.memberSelect.setChecked(member, false);
      }
    },
  },
});

function createDateRangeShortcuts(minDate, maxDate) {
  if (!(minDate && maxDate)) {
    return [];
  }

  return [
    {
      text: "All time",
      onClick: bindSetDateRange(minDate, maxDate),
    },
    {
      text: "Past 30 days",
      onClick: bindSetDateRange(
        moment(maxDate).subtract(30, "days").toDate(),
        maxDate
      ),
    },
  ];
}

function bindSetDateRange(start, end) {
  return function (picker) {
    picker.$emit("pick", [start, end]);
  };
}

function bindIsDateInRange(minDate, maxDate) {
  return function (date) {
    return date < minDate || date > maxDate;
  };
}

// All the data
const dataPromise = fetch("./hodllive.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (stats) {
    // Stats is map of member -> { date, views, subs }[]
    // Produce object from object
    return Object.fromEntries(
      Object.entries(stats).map(([member, memberStats]) => [
        // With same keys,
        member,
        // But transforming stats from datapoint[] to (string) date -> datapoint
        Object.fromEntries(
          memberStats.map((datapoint) => {
            const { date, ...rest } = datapoint;
            // Converting dates
            let dateComponents = date.split("-");
            let year = Number(dateComponents[0]);
            let month = Number(dateComponents[1]) - 1; // 0-indexed month
            let day = Number(dateComponents[2]);

            return [
              // And preserving the rest that isn't the date
              `${year}-${month}-${day}`,
              rest,
            ];
          })
        ),
      ])
    );
  });
dataPromise.then((statsByMemberByDate) => {
  vChart.viewershipStats.byMember = statsByMemberByDate;

  const minDate = stringToDate(
    Object.values(statsByMemberByDate)
      .map((statsByDate) => Object.keys(statsByDate))
      // Stats are sorted, so the first element is the earliest date
      .map((datapoints) => datapoints[0])
      // Take the minimum of dates
      .reduce((lowest, current) => (current < lowest ? current : lowest))
  );

  const maxDate = stringToDate(
    Object.values(statsByMemberByDate)
      .map((statsByDate) => Object.keys(statsByDate))
      // Stats are sorted, so the last element is the latest date
      .map((datapoints) => datapoints[datapoints.length - 1])
      // Take the maximum of dates
      .reduce((highest, current) => (current > highest ? current : highest))
  );

  vChart.dateRange = { minDate, maxDate };
  vChart.selectedDateRange = [minDate, maxDate];

  vChart.viewershipStats.byDate = Object.fromEntries(
    // For each date
    dateRange(minDate, maxDate).map((date) => {
      const stringDate = dateToString(date);

      // Create Object entry
      return [
        // With key (string) date
        stringDate,
        // And value map of member -> datapoint
        Object.fromEntries(
          // Produce another map
          Object.entries(statsByMemberByDate)
            .map(([member, statsByDate]) => {
              return [
                // With key member
                member,
                // And value datapoint at date
                stringDate in statsByDate ? statsByDate[stringDate] : undefined,
              ];
            })
            .filter(([member, datapoint]) => datapoint !== undefined)
        ),
      ];
    })
  );
});

document.getElementById("chart-sidebar-open").onclick = function () {
  document.getElementById("chart-config").classList.add("open");
};

document.getElementById("chart-sidebar-close").onclick = function () {
  document.getElementById("chart-config").classList.remove("open");
};

function dateRange(minDate, maxDate) {
  const currentDate = moment(minDate);
  const range = [];
  while (currentDate.isSameOrBefore(maxDate)) {
    range.push(currentDate.toDate());
    currentDate.add(1, "days");
  }
  return range;
}

function dateToString(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function stringToDate(str) {
  let dateComponents = str.split("-");
  let year = Number(dateComponents[0]);
  let month = Number(dateComponents[1]);
  let day = Number(dateComponents[2]);
  return new Date(year, month, day);
}

function formatApproximateCount(count) {
  const absCount = Math.abs(count);
  if (absCount === 0) {
    return "0";
  } else if (absCount < 1000) {
    return `${count}`;
  } else if (absCount < 100000) {
    return `${(count / 1000).toFixed(2)}K`;
  } else if (absCount < 1000000) {
    return `${Math.floor(count / 1000)}K`;
  } else {
    return `${(absCount / 1000000).toFixed(2)}M`;
  }
}

// Data Manipulation
// dateRange: [startDate, endDate]
// whichStat: "subs" or "views"
function getValueDatasets(stats, members, [minDate, maxDate], whichStat) {
  const statsByMemberByDate = stats.byMember;
  return {
    datasets: members.map(function (member) {
      const statsByDate = statsByMemberByDate[member];
      return {
        label: names[member],
        data: Object.entries(statsByDate)
          .map(([date, datapoint]) => [stringToDate(date), datapoint])
          .filter(([date, datapoint]) => date >= minDate && date <= maxDate)
          .map(function ([date, datapoint]) {
            return {
              x: date,
              y: datapoint[whichStat],
            };
          }),
        fill: false,
        borderColor: colors[member],
        pointBackgroundColor: colors[member],
        lineTension: 0,
        pointRadius: 4,
        borderWidth: 4,
        pointHoverBorderWidth: 4,
        pointHoverBackgroundColor: "#000000",
        pointHoverBorderColor: "#000000",
      };
    }),
  };
}

function getRateDatasets(stats, members, [minDate, maxDate], whichStat) {
  const statsByMemberByDate = stats.byMember;
  return {
    datasets: members.map(function (member) {
      const statsByDate = statsByMemberByDate[member];

      const minDateInStats = moment.min(
        Object.keys(statsByDate)
          .map(stringToDate)
          .map((date) => moment(date))
      );
      // Since we'll be calculating rate on date as (count on date - count on preceding date)
      // We'll take the more recent of either:
      const datasetMinDate = moment
        .max(
          // The day before the start of the configured date range (to have a datapoint for the earliest date)
          moment(minDate).subtract("days", 1),
          // Or the day after the earliest datapoint we have (the earliest date we can generate a rate datapoint for)
          minDateInStats
        )
        .toDate();

      // [date, stat on date] in the range of dates we can calculate change rate for
      const inputStats = Object.entries(statsByDate)
        .map(([date, datapoint]) => [stringToDate(date), datapoint])
        .filter(
          ([date, datapoint]) => date >= datasetMinDate && date <= maxDate
        )
        .map(([date, datapoint]) => [date, datapoint[whichStat]]);

      const changeRateStats = [];
      // We'll be producing n-1 datapoints
      for (let i = 1; i < inputStats.length; i++) {
        const [date, stat] = inputStats[i];
        const [_, precedingStat] = inputStats[i - 1];
        // Where the datapoint on a particular date is value on date - value on previous date
        // Meaning a the value on a particular date is "change since yesterday"
        changeRateStats.push([date, stat - precedingStat]);
      }

      return {
        label: names[member],
        data: changeRateStats.map(function ([date, changeInStat]) {
          return {
            x: date,
            y: changeInStat,
          };
        }),
        fill: false,
        borderColor: colors[member],
        pointBackgroundColor: colors[member],
        lineTension: 0,
        pointRadius: 4,
        borderWidth: 4,
        pointHoverBorderWidth: 4,
        pointHoverBackgroundColor: "#000000",
        pointHoverBorderColor: "#000000",
      };
    }),
  };
}

function getRanksOnDates(stats, members, [minDate, maxDate], whichStat) {
  const statsByDateByMember = stats.byDate;
  // Produce object from object
  return Object.fromEntries(
    // Examining stats by date
    Object.entries(statsByDateByMember)
      // Converting string dates to real Dates
      .map(([date, rankStatsByMember]) => [
        stringToDate(date),
        rankStatsByMember,
      ])
      // Taking only those dates in the range
      .filter(([date, statsByMember]) => date >= minDate && date <= maxDate)
      // And producing entries
      .map(([date, statsByMember]) => [
        // With key as the string date
        dateToString(date),
        // And value as map of member -> { ...datapoint, rank }
        Object.fromEntries(
          Object.entries(statsByMember)
            // With only the selected members
            .filter(([member, datapoint]) => members.includes(member))
            // Sorted according to the stat in question
            .sort(
              ([member1, datapoint1], [member2, datapoint2]) =>
                datapoint2[whichStat] - datapoint1[whichStat]
            )
            .map(([member, datapoint], rank) => [
              member,
              // And merging the sorted rank into the datapoint
              { ...datapoint, rank },
            ])
        ),
      ])
  );
}

// dateRange: [startDate, endDate]
// whichStat: "subs" or "views"
function getRankDatasets(stats, members, [minDate, maxDate], whichStat) {
  const rankByDateByMember = getRanksOnDates(
    stats,
    members,
    [minDate, maxDate],
    whichStat
  );

  return {
    datasets: members.map(function (member) {
      return {
        label: names[member],
        data: Object.entries(rankByDateByMember)
          .map(([date, rankStatsByMember]) => [
            stringToDate(date),
            rankStatsByMember,
          ])
          .filter(([date, rankByMember]) => member in rankByMember)
          .map(function ([date, rankByMember]) {
            return {
              x: date,
              y: rankByMember[member].rank + 1, // 0-indexed ranks are bad for humans
            };
          }),
        fill: false,
        borderColor: colors[member],
        pointBackgroundColor: colors[member],
        lineTension: 0,
        pointRadius: 4,
        borderWidth: 4,
        pointHoverBorderWidth: 4,
        pointHoverBackgroundColor: "#000000",
        pointHoverBorderColor: "#000000",
      };
    }),
  };
}

function topNOnDate(stats, n, date, whichStat) {
  return Object.entries(
    getRanksOnDates(stats, channels, [date, date], whichStat)[
      dateToString(date)
    ]
  )
    .filter(([member, datapoint]) => datapoint.rank < n)
    .map(([member, datapoint]) => member);
}
