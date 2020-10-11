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
const { pipe } = rxjs;

let sidebarOpen = false;
document.getElementById("chart-sidebar-button").onclick = function () {
  if (sidebarOpen) {
    sidebarOpen = false;
    document.getElementById("chart-config").classList.remove("open");
    document.getElementById("chart-sidebar-button").classList.remove("open");
  } else {
    sidebarOpen = true;
    document.getElementById("chart-config").classList.add("open");
    document.getElementById("chart-sidebar-button").classList.add("open");
  }
};

const selectedMembers = new Set();
// Member -> Checkboxes[]
const memberCheckboxes = {};
const selectionParent = document.getElementById("selectedMembers");
Object.entries(generations).forEach(([gen, members]) => {
  const generationWrapper = document.createElement("li");
  generationWrapper.classList.add("select-generation");
  selectionParent.appendChild(generationWrapper);

  const generationCheckbox = document.createElement("sl-checkbox");
  generationCheckbox.appendChild(document.createTextNode(gen));
  generationWrapper.appendChild(generationCheckbox);

  const generationMemberParent = document.createElement("ul");
  generationWrapper.appendChild(generationMemberParent);

  let processing = false;
  const generationMemberCheckboxes = members.map(function (member) {
    const memberWrapper = document.createElement("li");
    memberWrapper.classList.add("select-member");
    generationMemberParent.appendChild(memberWrapper);

    const memberCheckbox = document.createElement("sl-checkbox");
    memberCheckbox.appendChild(document.createTextNode(names[member]));
    memberWrapper.appendChild(memberCheckbox);

    memberCheckbox.addEventListener("sl-change", function (event) {
      if (memberCheckbox.checked) {
        // Check this member in other groups
        memberCheckboxes[member].forEach(function (checkbox) {
          if (!checkbox.checked) {
            checkbox.checked = true;
          }
        });

        // Track that this member is selected
        selectedMembers.add(member);

        // If this wasn't from a generation checkbox click, see if the generation checkbox should be changed
        if (!processing) {
          processing = true;
          if (
            members.every(function (member) {
              return selectedMembers.has(member);
            })
          ) {
            generationCheckbox.indeterminate = false;
            generationCheckbox.checked = true;
          } else {
            generationCheckbox.indeterminate = true;
            generationCheckbox.checked = false;
          }
          processing = false;
        }
      } else {
        // Un-check this member in other groups
        memberCheckboxes[member].forEach(function (checkbox) {
          if (checkbox.checked) {
            checkbox.checked = false;
          }
        });

        // Track that this member is no longer selected
        selectedMembers.delete(member);

        // If this wasn't from a generation checkbox click, see if the generation checkbox should be changed
        if (!processing) {
          processing = true;
          if (
            members.every(function (member) {
              return !selectedMembers.has(member);
            })
          ) {
            generationCheckbox.indeterminate = false;
            generationCheckbox.checked = false;
          } else {
            generationCheckbox.indeterminate = true;
            generationCheckbox.checked = false;
          }
          processing = false;
        }
      }
    });

    if (!(member in memberCheckboxes)) {
      memberCheckboxes[member] = [];
    }
    memberCheckboxes[member].push(memberCheckbox);

    return memberCheckbox;
  });

  // When the generation checkbox is clicked, we want to check/uncheck all of the members
  generationCheckbox.addEventListener("sl-change", function (event) {
    if (!processing) {
      processing = true;
      if (generationCheckbox.checked || generationCheckbox.indeterminate) {
        generationMemberCheckboxes.forEach(function (memberCheckbox) {
          if (!memberCheckbox.checked) {
            memberCheckbox.checked = true;
          }
        });
      } else {
        generationMemberCheckboxes.forEach(function (memberCheckbox) {
          if (memberCheckbox.checked) {
            memberCheckbox.checked = false;
          }
        });
      }
      generationCheckbox.indeterminate = false;
      processing = false;
    }
  });
});

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
