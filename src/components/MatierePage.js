import React, { useState, useEffect } from "react";

import { useLocation, useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Grid,
  Box,
  TextField,
  Paper
} from "@mui/material";

import { Bar, Line } from "react-chartjs-2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";


const MatierePage = () => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const matiere = location.state.matiere;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const navigate = useNavigate();

  const navigateToAbsencePage = (idEtu) => {
    navigate(`/AdminDashboard/student/${idEtu}`, { state: {student : idEtu} });
  };

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
        // Filtrer les absences pour la matière spécifique
        const absencesForSubject = filterAbsencesForSubject(jsonData, matiere);
        setData(absencesForSubject);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
  
    fetchData();
  }, [matiere]);
  

  const filteredData = data.filter((absence) => {
    const date = new Date(absence.dateAbs);
    return (!startDate || date >= startDate) && (!endDate || date <= endDate);
  });

  // Filtre les absences pour la matière spécifique
  const filterAbsencesForSubject = (absences, subject) => {
    return absences.filter((absence) => absence.matiere.nomMat === subject);
  };

  // Trouve l'étudiant avec le plus d'absences
  const findStudentWithMostAbsences = (absences) => {
    // Logique pour trouver l'étudiant avec le plus d'absences
  };

  // Calcule le nombre total d'absences
  const calculateTotalAbsences = (absences) => {
    return absences.length;
  };

  const absencesCount = filteredData.reduce((acc, curr) => {
    acc[curr.etudiant.nomEtu] = (acc[curr.etudiant.nomEtu] || {absences: 0, id: curr.etudiant.idEtu});
    acc[curr.etudiant.nomEtu].absences++;
    return acc;
  }, {});

  // Trier les étudiants par le nombre d'absences et prendre les cinq premiers
  const top5 = Object.entries(absencesCount)
  .sort((a, b) => b[1].absences - a[1].absences)
  .slice(0, 5)
  .map(([name, {absences, id}]) => ({ name, absences, id }));

  // Calcul du nombre d'absences pour chaque groupe de TD
  const absencesCountByGroup = filteredData.reduce((acc, curr) => {
    acc[curr.etudiant.promo] = (acc[curr.etudiant.promo] || 0) + 1;
    return acc;
  }, {});

  // Trier les groupes par le nombre d'absences et prendre les cinq premiers
  const top5Groups = Object.entries(absencesCountByGroup)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([group, absences]) => ({ group, absences }));

  // Création d'un objet pour stocker les absences par mois
  // Initialisation de l'objet pour stocker les absences par mois
  let absencesByMonth = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
  };

  // Parcours de toutes les absences
  filteredData.forEach((absence) => {
    const month = new Date(absence.dateAbs).getMonth() + 1;

    // Incrémenter la valeur du mois correspondant
    absencesByMonth[month]++;
  });

  // Convertir les absences par mois en un tableau pour le graphique
  const absencesArray = Object.keys(absencesByMonth).map((key) => ({
    month: key,
    absences: absencesByMonth[key],
  }));

  // Trier le tableau par mois
  absencesArray.sort((a, b) => a.month - b.month);

  const extractSubjectName = (text) => {
    const regex = /-\s?(.*)/;
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return text;
  };
  
  
  // Utilisez les fonctions pour calculer les statistiques avec les données filtrées
  const totalAbsences = calculateTotalAbsences(filteredData);
  const noDataMessage = filteredData.length === 0 ? "Aucune absence pour la période sélectionnée." : "";


  return (
    <Container>
      <Box sx={{ flexGrow: 1, mt: 0 }}>
        <Typography variant="h3" align="center" marginBottom={5}>
          Absences pour la matière {extractSubjectName(matiere)}
        </Typography>
        <Grid container spacing={2} align="center">
          <Grid item xs={12} >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
             
                  <DatePicker
                    label="Date de début"
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    format="dd/MM/yyyy"
                  />
                
                  <DatePicker
                    label="Date de fin"
                    value={endDate}
                    onChange={(newValue) => {
                      setEndDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    format="dd/MM/yyyy"
                  />
            </LocalizationProvider>
          </Grid>
          {filteredData.length > 0 ? (
          <>
           <Grid item xs={12}>
            <Typography variant="h6" align="center">
              Nombre total d'absences: {totalAbsences}
            </Typography>
            <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Line
                data={{
                  labels: absencesArray.map((item) => `Mois ${item.month}`),
                  datasets: [
                    {
                      label: "Nombre d'absences",
                      data: absencesArray.map((item) => item.absences),
                      fill: true,
                      borderColor: "rgb(75, 192, 192)",
                      tension: 0.5,
                    },
                  ],
                }}
                options={{
                  responsive: true,

                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            </Paper>
          </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Top 5 des étudiants les plus absents:
              </Typography>
              <List>
                {top5.map((student, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Avatar>{index + 1}</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={student.name}
                      secondary={student.absences + " absences"}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigateToAbsencePage(student.id)}
                      primaryTypographyProps={{ 
                        sx: { 
                          '&:hover': { 
                            textDecoration: 'underline'
                          } 
                        } 
                      }}
                    />
                  </ListItem>
                ))}
              </List>

            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Top 5 des groupes avec le plus d'absences:
              </Typography>
              <List>
                {top5Groups.map((group, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Avatar>{index + 1}</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={group.group}
                      secondary={group.absences + " absences"}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          </>
        ) : (
            <Grid item xs={12} marginTop={10} >
          <Typography variant="h6"  color="secondary" marginBottom={5}>
          Aucune absence pour la période sélectionnée
        </Typography>
        </Grid>
        )}
          
        </Grid>
      </Box>
    </Container>
  );
};

export default MatierePage;
