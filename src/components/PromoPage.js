import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";

export default function PromoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [absences, setAbsences] = useState([]);
  const [promos, setPromos] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState("");
  const [promoAbsences, setPromoAbsences] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [topStudents, setTopStudents] = useState([]);
  const [subjectData, setSubjectData] = useState({});
  const [open, setOpen] = useState(false);
  const [justification, setJustification] = useState("");
  const [currentAbsenceId, setCurrentAbsenceId] = useState(null);

  useEffect(() => {
    const fetchAbsences = async () => {
      const response = await fetch("http://localhost:8080/api/absences", {
        method: "GET",
        headers: {
          Authorization: "Basic " + window.btoa("admin:admin"),
        },
      });

      const absencesData = await response.json();
      setAbsences(absencesData);

      const promoNames = [
        ...new Set(absencesData.map((absence) => absence.etudiant.promo)),
      ];
      setPromos(promoNames);
      setSelectedPromo(promoNames[0]);

      setIsLoading(false);
    };

    fetchAbsences();
  }, []);

  useEffect(() => {
    if (selectedPromo) {
      setPromoAbsences(
        absences.filter((absence) => absence.etudiant.promo === selectedPromo)
      );
    }
  }, [selectedPromo, absences]);

  const handlePromoChange = (event) => {
    setSelectedPromo(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    if (selectedPromo) {
      const promoAbs = absences.filter(
        (absence) => absence.etudiant.promo === selectedPromo
      );
      setPromoAbsences(promoAbs);

      // Compute top students
      const studentAbsences = {};
      promoAbs.forEach((absence) => {
        const studentId = absence.etudiant.idEtu;
        if (studentAbsences[studentId]) {
          studentAbsences[studentId].count++;
        } else {
          studentAbsences[studentId] = {
            id: absence.etudiant.idEtu,
            name: absence.etudiant.nomEtu,
            count: 1,
          };
        }
      });
      const topStudents = Object.values(studentAbsences)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      setTopStudents(topStudents);

      // Compute subject data
      const subjectAbsences = {};
      promoAbs.forEach((absence) => {
        const subjectName = absence.matiere.nomMat;
        if (subjectAbsences[subjectName]) {
          subjectAbsences[subjectName]++;
        } else {
          subjectAbsences[subjectName] = 1;
        }
      });
      setSubjectData({
        labels: Object.keys(subjectAbsences),
        datasets: [
          {
            label: "Nombre d'absences",
            data: Object.values(subjectAbsences),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [selectedPromo, absences]);

  const navigate = useNavigate();
  const navigateToAbsencePage = (idEtu) => {
    navigate(`/AdminDashboard/student/${idEtu}`, { state: { student: idEtu } });
  };

  const deleteAbsence = async (idAbs) => {
    await fetch(`http://localhost:8080/api/absences/${idAbs}`, {
      method: "DELETE",
      headers: {
        Authorization: "Basic " + window.btoa("admin:admin"),
      },
    })
      .then((response) => {
        if (response.status === 404) {
          throw new Error("Absence not found");
        } else if (!response.ok) {
          throw new Error("Failed to delete absence");
        }
      })
      // Update the local absences state after successful deletion
      .then(() => {
        setAbsences(absences.filter((absence) => absence.idAbs !== idAbs));
        setPromoAbsences(
          promoAbsences.filter((absence) => absence.idAbs !== idAbs)
        );
      });
  };

  const justifyAbsence = async () => {
    // Find the absence to be updated
    const absenceToUpdate = absences.find(absence => absence.idAbs === currentAbsenceId);
    console.log(absenceToUpdate);
  
    // Make sure the absence was found
    if (!absenceToUpdate) {
      throw new Error('Absence not found');
    }
  
    // Include all the existing properties of the absence in the body of the PUT request
    await fetch(`http://localhost:8080/api/absences/${currentAbsenceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + window.btoa('admin:admin'),
      },
      body: JSON.stringify({
        ...absenceToUpdate,
        estJustifie: true,
        motif: justification,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to justify absence');
      }
    })
    // Update the local absences state after successful update
    .then(() => {
      setAbsences(
        absences.map((absence) => {
          if (absence.idAbs === currentAbsenceId) {
            return { ...absence, estJustifie: true, motif: justification };
          }
          return absence;
        })
      );
      setPromoAbsences(
        promoAbsences.map((absence) => {
          if (absence.idAbs === currentAbsenceId) {
            return { ...absence, estJustifie: true, motif: justification };
          }
          return absence;
        })
      );
    });
    handleClose();
  };
  
  
  
  

  const handleClickOpen = (idAbs) => {
    setCurrentAbsenceId(idAbs);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleJustificationChange = (event) => {
    setJustification(event.target.value);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Statistiques d'absences par promotion
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="select-promo-label">Promotion</InputLabel>
        <Select
          labelId="select-promo-label"
          id="select-promo"
          value={selectedPromo}
          label="Promotion"
          onChange={handlePromoChange}
        >
          {promos.map((promo, index) => (
            <MenuItem key={index} value={promo}>
              {promo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ mt: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Liste des absences" />
          <Tab label="Statistiques" />
        </Tabs>
      </Box>
      {currentTab === 0 && (
        <TextField
          fullWidth
          sx={{ mt: 2 }}
          id="search"
          label="Rechercher"
          value={searchValue}
          onChange={handleSearchChange}
        />
      )}
      <Paper sx={{ width: "100%", mt: 2 }} elevation={6}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {currentTab === 0 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID Étudiant</TableCell>
                      <TableCell>Nom Étudiant</TableCell>
                      <TableCell>Matière</TableCell>
                      <TableCell>Date d'absence</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {promoAbsences
                      .filter(
                        (absence) =>
                          absence.etudiant.nomEtu
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()) ||
                          absence.matiere.nomMat
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                      )
                      .map((absence, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row">
                            {absence.etudiant.idEtu}
                          </TableCell>
                          <TableCell>{absence.etudiant.nomEtu}</TableCell>
                          <TableCell>{absence.matiere.nomMat}</TableCell>
                          <TableCell>{absence.dateAbs}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => deleteAbsence(absence.idAbs)}
                              variant="outlined"
                              color="error"
                            >
                              Supprimer
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleClickOpen(absence.idAbs)}
                              variant="outlined"
                              color="primary"
                            >
                              Justifier
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {currentTab === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Top 10 des étudiants les plus absents:
                    </Typography>
                    <List>
                      {topStudents.map((student, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Avatar>{index + 1}</Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={student.name}
                            secondary={student.count + " absences"}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigateToAbsencePage(student.id)}
                            primaryTypographyProps={{
                              sx: {
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              },
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
                      Nombre d'absences par matière:
                    </Typography>
                    <Pie data={subjectData} />
                  </Paper>
                </Grid>
              </Grid>
            )}
          </>
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Justifier une absence</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Veuillez entrer le motif de l'absence :
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="justification"
              label="Motif"
              type="text"
              fullWidth
              onChange={handleJustificationChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Annuler
            </Button>
            <Button onClick={justifyAbsence} color="primary">
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}
