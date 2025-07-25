import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface SalaryOverviewProps {
  players: any[];
}

const SalaryOverview: React.FC<SalaryOverviewProps> = ({ players }) => {
  const roster = players || [];

  const salaryByPosition: Record<string, number> = {};
  roster.forEach((p) => {
    const position = p.position || p["Position"] || "";
    const salary = Number(p.salary ?? p["2025"]) || 0;
    salaryByPosition[position] = (salaryByPosition[position] || 0) + salary;
  });

  const sortedPositionLabels = Object.keys(salaryByPosition).sort(
    (a, b) => salaryByPosition[b] - salaryByPosition[a]
  );

  const sortedPlayers = roster
    .slice()
    .sort(
      (a, b) =>
        (Number(b.salary ?? b["2025"]) || 0) - (Number(a.salary ?? a["2025"]) || 0)
    );

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold">
              Salary Distribution by Position (2025)
            </h3>
            <div className="h-[320px] bg-gray-50 rounded-md flex items-center justify-center">
              {roster.length === 0 ? (
                <p className="text-gray-500">No data</p>
              ) : (
                <Bar
                  data={{
                    labels: sortedPositionLabels,
                    datasets: [
                      {
                        label: "Total Salary (2025)",
                        data: sortedPositionLabels.map((pos) => salaryByPosition[pos]),
                        backgroundColor: "#22d3ee",
                      },
                    ],
                  }}
                  options={{
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const val = context.parsed.x || context.raw;
                            return ` $${(val / 1_000_000).toFixed(1)}M`;
                          },
                        },
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          callback: (value) => `$${(+value / 1_000_000).toFixed(1)}M`,
                        },
                      },
                      y: {
                        ticks: { font: { size: 12 } },
                      },
                    },
                  }}
                  height={300}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Salary Distribution by Player (2025)</h3>
            <div className="h-[320px] bg-gray-50 rounded-md flex items-center justify-center">
              {roster.length === 0 ? (
                <p className="text-gray-500">No data</p>
              ) : (
                <Bar
                  data={{
                    labels: sortedPlayers.map((p) => p.name || p["Player"]),
                    datasets: [
                      {
                        label: "Salary (2025)",
                        data: sortedPlayers.map((p) => Number(p.salary ?? p["2025"]) || 0),
                        backgroundColor: "#2563eb",
                      },
                    ],
                  }}
                  options={{
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const val = context.parsed.x || context.raw;
                            return ` $${(val / 1_000_000).toFixed(1)}M`;
                          },
                        },
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          callback: (value) => `$${(+value / 1_000_000).toFixed(1)}M`,
                        },
                      },
                      y: {
                        ticks: { font: { size: 12 } },
                      },
                    },
                  }}
                  height={300}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryOverview;

