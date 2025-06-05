import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Use axios for API calls
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const LBStats = () => {
  const [lbStats, setLbStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const year = 2025; // Specify the year for fetching data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/import_weekly_data/${year}`); // Updated API endpoint
        console.log('Fetched LB Stats:', response.data); // Log the fetched data
        setLbStats(response.data); // Adjust this line based on the actual data structure returned
      } catch (err) {
        console.error('Error fetching LB data:', err); // Log any errors
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
          <TableHead>Tackles</TableHead>
          <TableHead>Sacks</TableHead>
          <TableHead>Interceptions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lbStats.map((player) => (
          <TableRow key={player.id}>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.team}</TableCell>
            <TableCell>{player.tackles}</TableCell>
            <TableCell>{player.sacks}</TableCell>
            <TableCell>{player.interceptions}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LBStats;