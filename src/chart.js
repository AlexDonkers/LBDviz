const labels = [
  "2022-10-05T12:00:00",
  "2022-10-05T12:10:00",
  "2022-10-05T12:20:00",
  "2022-10-05T12:30:00",
  "2022-10-05T12:40:00",
  "2022-10-05T12:50:00",
  "2022-10-05T13:00:00",
];

const data = {
  labels: labels,
  datasets: [
    {
        label: "TempSensor_DP",
        backgroundColor: "#ff0072",
        borderColor: "#ff0072",
        data: [21, 21, 20, 20, 21, 21, 23],
        tension: 0.2,
        color: "#E2F0D9",
    },
    {
        label: "MainEntranceHall_ThermalComfort_Feedback",
        backgroundColor: "#ff0072",
        borderColor: "#ff0072",
        data: [1, 0, 0, -1, 0, 0, 1],
        tension: 0.2,
        color: "#E2F0D9"
    },
  ],
};

const config = {
  type: "line",   
  data: data,
  options: {
    interaction: {
        intersect: false,
        mode: 'index',
    },
    legend: {
      labels: {
        fontColor: 'white',
      },
    },
    responsive: true,
    scales: {
      y: {
        grid: { color: "#E2F0D9" },
        ticks: { color: 'white', beginAtZero: true },
      },
      x: {
        grid: { color: "#E2F0D9" },
        ticks: { color: 'white', beginAtZero: true },
      },
    },
  },
};

const myChart = new Chart(document.getElementById("myChart"), config);
