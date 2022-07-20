/**
 * @typedef {Object} VTuberInfo
 * @property {Object.<string, {full_name: string, emoji: string, debut: Date, color: string}>} members
 * @property {Object.<string, Object.<string, Object.<string, string>>>} generations
 */

/**
 * @type {VTuberInfo}
 */
const vtubers = await fetch("./vtubers.json")
  .then((res) => res.json())
  .then((json) => {
    Object.entries(json.members).forEach(
      ([member, memberInfo]) =>
        (json.members[member] = {
          ...memberInfo,
          debut: new Date(memberInfo.debut),
        })
    );
    return json;
  });
console.log(vtubers);
const membersInfo = vtubers.members;
const generations = vtubers.generations;

// ORDER MATTERS FOR PERMALINKS
// New members must go at the bottom
const channels = Object.keys(membersInfo);

// UI Stuff
function createGenerationTree() {
  return Object.entries(generations).map(([branch, generations]) => ({
    label: branch,
    children: Object.entries(generations).map(([generation, members]) => ({
      label: generation,
      children: members.map((member) => ({
        id: member,
        label: member,
      })),
    })),
  }));
}

/*
Stupid hack to get around the fact that vue-chartjs seems to assume
that there's only one chart on the page
*/
const ReactiveChart = Vue.component("reactive-chart", {
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

const globalData = {
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
  configOpen: false,
  dimension: "subs",
  memberSearch: null,
  selectedMembers: [],
  dateMode: "absolute",
  absoluteDateRange: [new Date(2020, 8, 9), new Date()],
  relativeDateMagnitude: 30,
  relativeDateUnit: "days",
};

const ValueChart = Vue.component("value-chart", {
  data: () => globalData,
  template: `
    <reactive-chart
      :chartData="valueChartData"
      :options="valueChartOptions"
    ></reactive-chart>
  `,
  computed: {
    selectedDateRange() {
      if (this.dateMode === "absolute") {
        return this.absoluteDateRange;
      } else if (this.dateMode === "relative") {
        return [
          moment()
            .subtract(this.relativeDateMagnitude, this.relativeDateUnit)
            .toDate(),
          moment().toDate(),
        ];
      }
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
        animation: false,
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
  },
});

const RateChart = Vue.component("rate-chart", {
  data: () => globalData,
  template: `
    <reactive-chart
      :chartData="rateChartData"
      :options="rateChartOptions"
    ></reactive-chart>
  `,
  computed: {
    selectedDateRange() {
      if (this.dateMode === "absolute") {
        return this.absoluteDateRange;
      } else if (this.dateMode === "relative") {
        return [
          moment()
            .subtract(this.relativeDateMagnitude, this.relativeDateUnit)
            .toDate(),
          moment().toDate(),
        ];
      }
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
        animation: false,
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
  },
});

const RankChart = Vue.component("rank-chart", {
  data: () => globalData,
  template: `
    <reactive-chart
      :chartData="rankChartData"
      :options="rankChartOptions"
    ></reactive-chart>
  `,
  computed: {
    selectedDateRange() {
      if (this.dateMode === "absolute") {
        return this.absoluteDateRange;
      } else if (this.dateMode === "relative") {
        return [
          moment()
            .subtract(this.relativeDateMagnitude, this.relativeDateUnit)
            .toDate(),
          moment().toDate(),
        ];
      }
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
});

const About = Vue.component("about", {
  template: `
    <section>
      <section id="about">
        <el-card>
          <h1 id="about-title" slot="header">About HODLLive</h1>
          <section id="about-blurb">
            <p>
              HODLLive was created so that we can watch the wonderful
              entertainers of Hololive and Holostars grow. It automatically
              updates once per day with the latest viewership numbers from each
              member\'s YouTube channel. The HODLLive interface is intended to
              provide simple and powerful tools for analyzing how viewership
              counts change over time.
            </p>
            <p>
              Please remember that viewership counts are not a competition!
              Viewership counts do not make a member any better or worse than
              others. All of the members collaborate and contribute to each
              other\'s success and to the success of the whole group. The whole
              group is enriched by the success of all of its members across
              countries and languages.
            </p>
            <p>
              If you are new to the VTuber fandom, please do your part and learn
              about the culture and expectations. There are real people behind
              the avatars.
            </p>
          </section>
        </el-card>
      </section>
    </section>
  `,
});

// Routes
const router = new VueRouter({
  routes: [
    { name: "value", path: "/:dimension/value", component: ValueChart },
    { name: "rate", path: "/:dimension/rate", component: RateChart },
    { name: "rank", path: "/:dimension/rank", component: RankChart },
    { name: "about", path: "/about", component: About },
    { path: "/", redirect: "/subs/value" },
  ],
});

ELEMENT.locale(ELEMENT.lang.en);
new Vue({
  el: "#chart-all",
  router,
  data: globalData,
  computed: {
    // Date manipulation is dependent on the range of dates present in viwershipStats
    selectDateRangeOptions() {
      const { minDate, maxDate } = this.dateRange;
      return {
        shortcuts: createDateRangeShortcuts(minDate, maxDate),
        disabledDate: bindIsDateInRange(minDate, maxDate),
      };
    },
    configQuery() {
      return {
        members: packMembers(this.selectedMembers),
        since:
          this.dateMode === "absolute"
            ? dateToString(this.absoluteDateRange[0])
            : undefined,
        until:
          this.dateMode === "absolute"
            ? dateToString(this.absoluteDateRange[1])
            : undefined,
        ago:
          this.dateMode === "relative"
            ? this.relativeDateUnit === "days"
              ? `${this.relativeDateMagnitude}d`
              : `${this.relativeDateMagnitude}m`
            : undefined,
      };
    },
  },
  mounted() {
    const dimension = this.$router.currentRoute.params.dimension;
    if (dimension) {
      this.dimension = dimension;
    }

    const query = this.$router.currentRoute.query;

    // Load config from query params
    if (query.members) {
      this.selectedMembers = unpackMembers(query.members);
    }

    if (query.since || query.until) {
      const startDate = query.since
        ? stringToDate(query.since)
        : this.absoluteDateRange[0];
      const endDate = query.until
        ? stringToDate(query.until)
        : this.absoluteDateRange[1];
      this.dateMode = "absolute";
      this.absoluteDateRange = [startDate, endDate];
    } else if (query.ago) {
      this.dateMode = "relative";
      this.relativeDateUnit = query.ago.substr(-1) === "d" ? "days" : "months";
      this.relativeDateMagnitude = Number(
        query.ago.substr(0, query.ago.length - 1)
      );
    }
  },
  methods: {
    openSidebar() {
      this.configOpen = true;
    },
    closeSidebar() {
      this.configOpen = false;
      this.$router.push({
        // Keep name the same
        name: this.$router.currentRoute.name,
        // Change dimension route param & data config query params if necessary
        params: { dimension: this.dimension },
        query: this.configQuery,
      });
    },
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
      const candidates = Object.keys(membersInfo).filter((name) =>
        name.toLowerCase().startsWith(value)
      );
      if (candidates.length === 1) {
        const selectedMember = candidates[0];
        console.log("Completing search with", selectedMember);
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
  globalData.viewershipStats.byMember = statsByMemberByDate;

  const minDate = Object.values(statsByMemberByDate)
    .map((statsByDate) => Object.keys(statsByDate))
    // Stats are sorted, so the first element is the earliest date
    .map((datapoints) => datapoints[0])
    // Process as dates
    .map(stringToDate)
    // Take the minimum of dates
    .reduce((lowest, current) => (current < lowest ? current : lowest));

  const maxDate = Object.values(statsByMemberByDate)
    .map((statsByDate) => Object.keys(statsByDate))
    // Stats are sorted, so the last element is the latest date
    .map((datapoints) => datapoints[datapoints.length - 1])
    // Process as dates
    .map(stringToDate)
    // Take the maximum of dates
    .reduce((highest, current) => (current > highest ? current : highest));

  globalData.dateRange = { minDate, maxDate };
  globalData.absoluteDateRange = [minDate, maxDate];

  globalData.viewershipStats.byDate = Object.fromEntries(
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
  if (!statsByMemberByDate) {
    return { datasets: [] };
  }

  return {
    datasets: members.map(function (member) {
      const statsByDate = statsByMemberByDate[member];
      const memberInfo = membersInfo[member];
      const color = memberInfo.color;
      return {
        label: member,
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
        borderColor: color,
        pointBackgroundColor: color,
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
  if (!statsByMemberByDate) {
    return { datasets: [] };
  }
  return {
    datasets: members.map(function (member) {
      const statsByDate = statsByMemberByDate[member];
      const color = membersInfo[member].color;

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
          moment(minDate).subtract(1, "days"),
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
        label: member,
        data: changeRateStats.map(function ([date, changeInStat]) {
          return {
            x: date,
            y: changeInStat,
          };
        }),
        fill: false,
        borderColor: color,
        pointBackgroundColor: color,
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
  if (!stats.byDate) {
    return { datasets: [] };
  }

  const rankByDateByMember = getRanksOnDates(
    stats,
    members,
    [minDate, maxDate],
    whichStat
  );

  return {
    datasets: members.map(function (member) {
      const color = membersInfo[member].color;

      return {
        label: member,
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
        borderColor: color,
        pointBackgroundColor: color,
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

function packMembers(selectedMembers) {
  // Convert to a number
  return (
    toBigInt(
      // Prepend a 1. This is just for "padding" to make all member slugs the same length.
      // If we don't do this, packed member slugs containing only members at the lowest bits will only be 1 or 2 characters
      "1" +
        // The string of bits formed where
        channels
          // 1's are channels that are selected
          .map((channel) => (selectedMembers.includes(channel) ? "1" : "0"))
          .join(""),
      // From binary
      2
    )
      // In base 36 (digits + lowercase letters)
      .toString(36)
  );
}

function unpackMembers(packedMembers) {
  return (
    // Get the number from the base 36 packed string
    toBigInt(packedMembers, 36)
      // As binary
      .toString(2)
      // Remove the "padding" bit which was added when packing
      .substring(1)
      .split("")
      // Where for each digit
      .reduce(
        // If the digit is 1, add the corresponding member to the selection
        (acc, curr, index) =>
          curr === "1" ? acc.concat(channels[index]) : acc,
        []
      )
  );
}

function toBigInt(value, radix) {
  return [...value.toString()].reduce(
    (r, v) => r * BigInt(radix) + BigInt(parseInt(v, radix)),
    0n
  );
}
