import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SchedulePage = () => {
  const [scheduleData, setScheduleData] = useState<{ AFC: any[]; NFC: any[] }>({ AFC: [], NFC: [] });
  const [loading, setLoading] = useState(true);
  const [afcWeek, setAfcWeek] = useState(1);
  const [nfcWeek, setNfcWeek] = useState(1);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`${API_URL}/schedule`);
        const data = await res.json();
        setScheduleData(data);
      } catch (error) {
        console.error("Erro ao buscar calendário:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const renderConference = (conference: "AFC" | "NFC", selectedWeek: number, setWeek: (v: number) => void) => {
    const weeks = scheduleData[conference];
    if (!weeks || weeks.length === 0) return null;
    const currentWeek = weeks.find((w: any) => w.week === selectedWeek) || weeks[0];

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{conference}</h2>
        <div className="flex items-center gap-4 mb-4">
          <Select value={String(selectedWeek)} onValueChange={v => setWeek(Number(v))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {weeks.map((w: any) => (
                <SelectItem key={w.week} value={String(w.week)}>
                  Week {w.week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {weeks.length} weeks
          </span>
        </div>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Week {currentWeek.week} Matchups</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {currentWeek.matchups.map((matchup: any) => (
                <div
                  key={matchup.id}
                  className="border rounded-lg p-4 bg-white flex items-center justify-between"
                >
                  <div className="flex-1 text-right pr-3">{matchup.away}</div>
                  <div className="font-bold text-nfl-navy">@</div>
                  <div className="flex-1 pl-3">{matchup.home}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
        <span className="text-sm text-muted-foreground">2025 Season</span>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {renderConference("AFC", afcWeek, setAfcWeek)}
          {renderConference("NFC", nfcWeek, setNfcWeek)}
        </>
      )}
    </div>
  );
};

export default SchedulePage;
