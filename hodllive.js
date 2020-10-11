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

const vConfig = new Vue({
  el: "#chart-all",
  data: {
    constants: {
      generationTree: createGenerationTree(),
    },
    selectedDataset: "subs",
  },
  methods: {
    setMemberCheck(node, checked) {
      // To manage checking a member in multiple places
      this.$refs.memberSelect.setChecked(node.id, checked);
    },
  },
});

document.getElementById("chart-sidebar-open").onclick = function () {
  document.getElementById("chart-config").classList.add("open");
};

document.getElementById("chart-sidebar-close").onclick = function () {
  document.getElementById("chart-config").classList.remove("open");
};

// Data Manipulation
// whichStat: "subs" or "views"
function getDatasets(stats, members, whichStat) {
  return generations["Hololive EN"].map(function (member) {
    let datapoints = stats[member];
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
  });
}

let dataPromise = fetch("./hodllive.json").then(function (response) {
  return response.json();
});
dataPromise.then(function (stats) {
  let ctx = document.getElementById("chart").getContext("2d");
  let subChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: getDatasets(stats, generations["Hololive EN"], "views"),
    },
    options: {
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
    },
  });
});
