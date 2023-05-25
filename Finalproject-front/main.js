const humidity = document.querySelector(".humidity");
const temperature = document.querySelector(".temperature");
const light = document.querySelector(".light");
const ul = document.querySelector(".weather-stats .details ul");
var hum = 0;
var tem = 0;

const getData = async () => {
  const options = {
    method: "GET",
    // credentials: "include",
  };
  await fetch(`http://127.0.0.1:3000/data`, options)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      hum = parseInt(data.dataTable.humidity);
      tem = parseInt(data.dataTable.temp);
      document.getElementById("hum").innerHTML = hum;
      document.getElementById("tem").innerHTML = tem;
      // setGraph();
    })
    .catch((error) => console.error(error));
};

function setGraph() {
  const humidity = document.getElementById("humidity");
  const temperature = document.getElementById("temperature");
  new Chart(humidity, {
    type: "doughnut",
    data: {
      labels: ["Red"],
      datasets: [
        {
          label: "# of Votes",
          data: [hum, 100 - hum],
          borderRadius: 10,
          borderWidth: 10,
        },
      ],
    },
    options: {
      events: [],
      backgroundColor: ["#8FA0CE", "#FFFF"],
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  new Chart(temperature, {
    type: "doughnut",
    data: {
      labels: ["Red"],
      datasets: [
        {
          label: "# of Votes",
          data: [tem, 50 - tem],
          borderRadius: 10,
          borderWidth: 10,
        },
      ],
    },
    options: {
      events: [],
      backgroundColor: ["#CE8F8F", "#FFFF"],
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function dryState() {
  var state = 0;
  if (tem >= 40) state += 1;
  if (hum >= 30 && hum <= 50) state += 1;
  var result = document.getElementById("result");
  var imgid = document.getElementById("imgid");

  switch (state) {
    case 0:
      imgid.src = "images/storm.png";
      result.innerHTML = "ตากไปก็ไม่แห้ง";
      result.style.color = "red";
      break;
    case 1:
      imgid.src = "images/cloudy.png";
      result.innerHTML = "อยากตากก็ตากได้นะ";
      result.style.color = "rgb(255, 160, 8)";
      result.style.webkitTextStroke = "0.05px black";
      result.style.textStroke = "0.05px black";
      break;
    case 2:
      imgid.src = "images/sun.png";
      result.innerHTML = "ไปตากผ้าตอนนี้เลย";
      result.style.color = "green";
      break;
    default:
      break;
  }
}

function updateChart() {
  // Update the chart data
  const chartHum = Chart.getChart("humidity");
  // console.log(chartHum);
  chartHum.data.datasets[0].data = [hum, 100 - hum];
  chartHum.update();

  const chartTem = Chart.getChart("temperature");
  chartTem.data.datasets[0].data = [tem, 50 - tem];
  chartTem.update();
}

function onLoadFunctions() {
  getData()
    .then(setGraph)
    .then(dryState)
    .catch(function (error) {
      console.error("Error:", error);
    });
  const dailyUpdatesInterval = setInterval(updateFunctions, 2000);
}

function updateFunctions() {
  // console.log("update");
  getData()
    .then(updateChart)
    .then(dryState)
    .catch(function (error) {
      console.error("Error:", error);
    });
}
