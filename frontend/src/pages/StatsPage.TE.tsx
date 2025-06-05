import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Use axios for API calls
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TEStats = () => {
  const [teStats, setTeStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const year = 2025; // Specify the year for fetching data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/import_weekly_data/${year}`); // Updated API endpoint
        console.log('Fetched TE Stats:', response.data); // Log the fetched data
        setTeStats(response.data); // Adjust this line based on the actual data structure returned
      } catch (err) {
        console.error('Error fetching TE data:', err); // Log any errors
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Receptions</TableHead>
          <TableHead>Rec Yards</TableHead>
          <TableHead>Rec TD</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teStats.map((player) => (
          <TableRow key={player.id}>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.team}</TableCell>
            <TableCell>{player.receptions}</TableCell>
            <TableCell>{player.recYards}</TableCell>
            <TableCell>{player.recTD}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TEStats;