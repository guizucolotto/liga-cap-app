import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Use axios for API calls
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_URL } from "@/utils/apiUtils";

const DLStats = () => {
  const [dlStats, setDlStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const year = 2025; // Specify the year for fetching data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/import_weekly_data/${year}`);
        console.log('Fetched DL Stats:', response.data); // Log the fetched data
        setDlStats(response.data); // Adjust this line based on the actual data structure returned
      } catch (err) {
        console.error('Error fetching DL data:', err); // Log any errors
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
          <TableHead>Sacks</TableHead>
          <TableHead>Tackles</TableHead>
          <TableHead>Interceptions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dlStats.map((player) => (
          <TableRow key={player.id}>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.team}</TableCell>
            <TableCell>{player.sacks}</TableCell>
            <TableCell>{player.tackles}</TableCell>
            <TableCell>{player.interceptions}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DLStats;