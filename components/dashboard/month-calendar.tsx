"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      mode: "index" as const,
      intersect: false,
      backgroundColor: "#1f2937",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#374151",
      borderWidth: 1,
    },
  },
  scales: {
    y: {
      min: 0,
      max: 400,
      ticks: {
        stepSize: 50,
        color: "rgba(255, 255, 255, 0.3)",
        font: {
          size: 10,
        },
      },
      grid: {
        color: "rgba(255, 255, 255, 0.05)",
        drawBorder: false,
      },
      border: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "rgba(255, 255, 255, 0.3)",
        font: {
          size: 10,
        },
      },
      border: {
        display: false,
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2,
      borderColor: "#3b82f6",
    },
    point: {
      radius: 0,
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const data = {
  labels,
  datasets: [
    {
      data: [350, 200, 250, 200, 300, 250, 350, 200, 250, 300, 350, 400],
      fill: true,
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.12)");
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
        return gradient;
      },
    },
  ],
};

export function MonthCalendar() {
  return (
    <div className="h-[300px] w-full">
      <Line options={options} data={data} />
    </div>
  );
}
