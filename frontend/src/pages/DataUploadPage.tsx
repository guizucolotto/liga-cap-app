
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CSVUploader from "@/components/CSVUploader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { loadTeamsFromCSV, saveTeamsToLocalStorage } from "@/data/teamsDataService";
import { loadPlayersFromCSV, savePlayersToLocalStorage } from "@/data/playersDataService";
import { loadQBStatsFromCSV, loadRBStatsFromCSV, loadWRStatsFromCSV, saveStatsToLocalStorage } from "@/data/statsDataService";

const DataUploadPage = () => {
  const [uploading, setUploading] = useState(false);
  
  // Team data handling
  const handleTeamsCSVLoaded = async (csvData: string) => {
    try {
      setUploading(true);
      const teams = await loadTeamsFromCSV(csvData);
      saveTeamsToLocalStorage(teams);
      toast.success(`Loaded ${teams.length} teams`);
    } catch (error) {
      console.error("Error processing teams CSV:", error);
      toast.error("Failed to process teams data");
    } finally {
      setUploading(false);
    }
  };

  // Player data handling
  const handlePlayersCSVLoaded = async (csvData: string) => {
    try {
      setUploading(true);
      const players = await loadPlayersFromCSV(csvData);
      savePlayersToLocalStorage(players);
      toast.success(`Loaded ${players.length} players`);
    } catch (error) {
      console.error("Error processing players CSV:", error);
      toast.error("Failed to process players data");
    } finally {
      setUploading(false);
    }
  };

  // QB Stats handling
  const handleQBStatsCSVLoaded = async (csvData: string) => {
    try {
      setUploading(true);
      const qbStats = await loadQBStatsFromCSV(csvData);
      
      // Get existing stats from storage or create new object
      const currentStats = JSON.parse(localStorage.getItem("football-stats") || "{}");
      currentStats.QB = qbStats;
      
      // Save updated stats
      saveStatsToLocalStorage(currentStats);
      toast.success(`Loaded ${qbStats.length} QB statistics`);
    } catch (error) {
      console.error("Error processing QB stats CSV:", error);
      toast.error("Failed to process QB statistics");
    } finally {
      setUploading(false);
    }
  };

  // RB Stats handling
  const handleRBStatsCSVLoaded = async (csvData: string) => {
    try {
      setUploading(true);
      const rbStats = await loadRBStatsFromCSV(csvData);
      
      // Get existing stats from storage or create new object
      const currentStats = JSON.parse(localStorage.getItem("football-stats") || "{}");
      currentStats.RB = rbStats;
      
      // Save updated stats
      saveStatsToLocalStorage(currentStats);
      toast.success(`Loaded ${rbStats.length} RB statistics`);
    } catch (error) {
      console.error("Error processing RB stats CSV:", error);
      toast.error("Failed to process RB statistics");
    } finally {
      setUploading(false);
    }
  };

  // WR Stats handling
  const handleWRStatsCSVLoaded = async (csvData: string) => {
    try {
      setUploading(true);
      const wrStats = await loadWRStatsFromCSV(csvData);
      
      // Get existing stats from storage or create new object
      const currentStats = JSON.parse(localStorage.getItem("football-stats") || "{}");
      currentStats.WR = wrStats;
      
      // Save updated stats
      saveStatsToLocalStorage(currentStats);
      toast.success(`Loaded ${wrStats.length} WR statistics`);
    } catch (error) {
      console.error("Error processing WR stats CSV:", error);
      toast.error("Failed to process WR statistics");
    } finally {
      setUploading(false);
    }
  };

  // Clear all data
  const handleClearAllData = () => {
    localStorage.removeItem("football-teams");
    localStorage.removeItem("football-players");
    localStorage.removeItem("football-stats");
    toast.success("All data cleared successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
        <Button variant="destructive" onClick={handleClearAllData}>
          Clear All Data
        </Button>
      </div>
      
      <Tabs defaultValue="teams">
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Upload Teams Data</CardTitle>
              <CardDescription>
                Upload a CSV file containing team data. The CSV should include headers for id, name, conference, division, capSpace, capUsed, and totalPlayers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVUploader 
                onCSVLoaded={handleTeamsCSVLoaded} 
                buttonText="Upload Teams CSV"
              />
              
              <div className="mt-4 text-sm text-muted-foreground">
                <h4 className="font-medium">Expected CSV Format:</h4>
                <pre className="mt-2 p-2 bg-muted rounded-md overflow-x-auto">
                  id,name,conference,division,capSpace,capUsed,totalPlayers<br/>
                  cowboys,Dallas Cowboys,NFC,East,$119548296,$159651704,43<br/>
                  eagles,Philadelphia Eagles,NFC,East,$130290953,$148909047,40
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="players">
          <Card>
            <CardHeader>
              <CardTitle>Upload Players Data</CardTitle>
              <CardDescription>
                Upload a CSV file containing player data. The CSV should include headers for id, name, team, position, and salary.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVUploader 
                onCSVLoaded={handlePlayersCSVLoaded} 
                buttonText="Upload Players CSV"
              />
              
              <div className="mt-4 text-sm text-muted-foreground">
                <h4 className="font-medium">Expected CSV Format:</h4>
                <pre className="mt-2 p-2 bg-muted rounded-md overflow-x-auto">
                  id,name,team,position,salary<br/>
                  1,Drake Maye,Dallas Cowboys,QB,$42966243<br/>
                  2,CeeDee Lamb,Dallas Cowboys,WR,$30145250
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>QB Statistics</CardTitle>
                <CardDescription>
                  Upload quarterback statistics data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CSVUploader 
                  onCSVLoaded={handleQBStatsCSVLoaded} 
                  buttonText="Upload QB Stats"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>RB Statistics</CardTitle>
                <CardDescription>
                  Upload running back statistics data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CSVUploader 
                  onCSVLoaded={handleRBStatsCSVLoaded} 
                  buttonText="Upload RB Stats"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>WR Statistics</CardTitle>
                <CardDescription>
                  Upload wide receiver statistics data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CSVUploader 
                  onCSVLoaded={handleWRStatsCSVLoaded} 
                  buttonText="Upload WR Stats"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataUploadPage;
