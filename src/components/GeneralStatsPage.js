import React, { useState, useEffect } from "react";
import { 
  Typography,
  Grid,
  Box,
  Paper,
  TextField
} from "@mui/material";
import { Bar, Line,HorizontalBar  } from "react-chartjs-2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import frLocale from "date-fns/locale/fr";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const GeneralStatsPage = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/absences', {
          method: 'GET',
          headers: {  
            'Authorization': 'Basic ' + window.btoa('admin:admin'),
          },
        });
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
  
    fetchData();
  }, []);

  const filteredData = data.filter((absence) => {
    const date = new Date(absence.dateAbs);
    return (!startDate || date >= startDate) && (!endDate || date <= endDate);
  });

  const absencesCount = filteredData.reduce((acc, curr) => {
    acc[curr.etudiant.nomEtu] = (acc[curr.etudiant.nomEtu] || 0) + 1;
    return acc;
  }, {});



  const absencesBySubject = filteredData.reduce((acc, curr) => {
    acc[curr.matiere.nomMat] = (acc[curr.matiere.nomMat] || 0) + 1;
    return acc;
  }, {});

  const absencesByPromo = filteredData.reduce((acc, curr) => {
    acc[curr.etudiant.promo] = (acc[curr.etudiant.promo] || 0) + 1;
    return acc;
  }, {});

  const absencesByTDGroup = filteredData.reduce((acc, curr) => {
    acc[curr.etudiant.td] = (acc[curr.etudiant.td] || 0) + 1;
    return acc;
  }, {});

  const absencesByDay = filteredData.reduce((acc, curr) => {
    const day = new Date(curr.dateAbs).getDay();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Convertir les données en tableaux pour les graphiques
  const studentAbsencesArray = Object.entries(absencesCount);
  const subjectAbsencesArray = Object.entries(absencesBySubject);
  const promoAbsencesArray = Object.entries(absencesByPromo);
  const TDGroupAbsencesArray = Object.entries(absencesByTDGroup);
  const dayAbsencesArray = Object.entries(absencesByDay).sort(([dayA], [dayB]) => dayA - dayB);

  return (
    <Box sx={{ flexGrow: 1, mt: 0 }}>
      <Typography variant="h3" align="center" marginBottom={5}>
        Statistiques générales des absences
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale="frFR">
        <Grid container spacing={2} align="center">
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Date de début"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
              format="dd/MM/yyyy"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Date de fin"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
              format="dd/MM/yyyy"
            />
          </Grid>
        </Grid>
      </LocalizationProvider>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Nombre total d'absences: {filteredData.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Absences par étudiant
            </Typography>
            <Bar
                data={{
                    labels: studentAbsencesArray.map(([name]) => name),
                    datasets: [
                    {
                        label: 'Absences',
                        data: studentAbsencesArray.map(([, count]) => count),
                        backgroundColor: 'rgb(75, 192, 192)',
                    },
                    ],
                }}
                options={{
                    indexAxis: 'y',  // Ajoutez cette ligne
                    responsive: true,
                    scales: {
                    x: {
                        beginAtZero: true,
                    },
                    },
                }}
            />

          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Absences par matière
            </Typography>
            <Bar
              data={{
                labels: subjectAbsencesArray.map(([name]) => name),
                datasets: [
                  {
                    label: 'Absences',
                    data: subjectAbsencesArray.map(([, count]) => count),
                    backgroundColor: 'rgb(255, 99, 132)',
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Absences par promotion
            </Typography>
            <Bar
              data={{
                labels: promoAbsencesArray.map(([name]) => name),
                datasets: [
                  {
                    label: 'Absences',
                    data: promoAbsencesArray.map(([, count]) => count),
                    backgroundColor: 'rgb(153, 102, 255)',
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Absences par jour de la semaine
            </Typography>
            <Line
              data={{
                labels: dayAbsencesArray.map(([day]) => daysOfWeek[day]),
                datasets: [
                  {
                    label: 'Absences',
                    data: dayAbsencesArray.map(([, count]) => count),
                    backgroundColor: 'rgb(54, 162, 235)',
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneralStatsPage
