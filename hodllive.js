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

Vue.component("viewership-chart", {
  extends: VueChartJs.Line,
  mixins: [VueChartJs.mixins.reactiveProp],
  props: ["options"],
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          unit: "day",
        },
      },
    ],
  },
};

const vChart = new Vue({
  el: "#chart-all",
  data: {
    constants: {
      generationTree: createGenerationTree(),
      chartOptions,
    },
    dimension: "subs",
    viewershipStats: null,
    selectedMembers: generations["Hololive EN"],
  },
  computed: {
    viewershipChartData() {
      return getDatasets(
        this.viewershipStats,
        this.selectedMembers,
        this.dimension
      );
    },
  },
  methods: {
    setMemberCheck(node, checked) {
      // Only member checkboxes have ids
      if (node.id) {
        // To manage checking a member in multiple places
        this.$refs.memberSelect.setChecked(node.id, checked);

        // Poor man's observable Set via an array
        if (checked && !this.selectedMembers.includes(node.id)) {
          this.selectedMembers.push(node.id);
        } else if (!checked && this.selectedMembers.includes(node.id)) {
          this.selectedMembers.splice(this.selectedMembers.indexOf(node.id), 1);
        }
      }
    },
  },
});

// All the data
const dataPromise = fetch("./hodllive.json").then(function (response) {
  return response.json();
});
dataPromise.then((stats) => (vChart.viewershipStats = stats));

document.getElementById("chart-sidebar-open").onclick = function () {
  document.getElementById("chart-config").classList.add("open");
};

document.getElementById("chart-sidebar-close").onclick = function () {
  document.getElementById("chart-config").classList.remove("open");
};

// Data Manipulation
// whichStat: "subs" or "views"
function getDatasets(stats, members, whichStat) {
  return {
    datasets: members.map(function (member) {
      const datapoints = stats[member];
      return {
        label: names[member],
        data: datapoints.map(function (datapoint) {
          let dateComponents = datapoint.date.split("-");
          let year = Number(dateComponents[0]);
          let month = Number(dateComponents[1]) - 1; // 0-indexed month
          let day = Number(dateComponents[2]);

          return {
            x: new Date(year, month, day),
            y: datapoint[whichStat],
          };
        }),
        fill: false,
        borderColor: colors[member],
        lineTension: 0,
      };
    }),
  };
}
