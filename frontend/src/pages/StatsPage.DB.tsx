import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Use axios for API calls
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_URL } from "@/utils/apiUtils";

const DBStats = () => {
  const [dbStats, setDbStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const year = 2025; // Specify the year for fetching data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/import_weekly_data/${year}`);
        console.log('Fetched DB Stats:', response.data); // Log the fetched data
        setDbStats(response.data); // Adjust this line based on the actual data structure returned
      } catch (err) {
        console.error('Error fetching DB data:', err); // Log any errors
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
          <TableHead>Interceptions</TableHead>
          <TableHead>Pass Deflections</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dbStats.map((player) => (
          <TableRow key={player.id}>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.team}</TableCell>
            <TableCell>{player.tackles}</TableCell>
            <TableCell>{player.interceptions}</TableCell>
            <TableCell>{player.passDeflections}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DBStats;