import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    color: '#3f51b5',
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
  },
});

const AbsencePage = (props) => {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [absencesBySubject, setAbsencesBySubject] = useState({});
  const [absencesByDay, setAbsencesByDay] = useState([]);
  const location = useLocation();
  const idEtu = location.state.student;
  const [maxAbsencesByMonth, setMaxAbsencesByMonth] = useState([]);
  const [absencesOverTime, setAbsencesOverTime] = useState({});
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [totalAbsenceHours, setTotalAbsenceHours] = useState(0);
  const [absenceHoursBySubject, setAbsenceHoursBySubject] = useState({});
  const [studentInfo, setStudentInfo] = useState({});

  const countAbsencesByDayOfWeek = (data) => {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    const absencesByDay = Array(5).fill(0);

    data.forEach((absence) => {
      const day = new Date(absence.dateAbs).getDay();
      absencesByDay[day]++;
    });

    return days.map((day, index) => ({
      day,
      absences: absencesByDay[index + 2],
    }));
  };

  const findMaxAbsencesByMonthAndSubject = (data) => {
    const absencesByMonthAndSubject = {};

    data.forEach((absence) => {
      const month = new Date(absence.dateAbs).getMonth() + 1;
      const subject = absence.matiere.nomMat;

      if (!absencesByMonthAndSubject[month]) {
        absencesByMonthAndSubject[month] = {};
      }

      if (!absencesByMonthAndSubject[month][subject]) {
        absencesByMonthAndSubject[month][subject] = 0;
      }

      absencesByMonthAndSubject[month][subject]++;
    });

    return Object.entries(absencesByMonthAndSubject).map(
      ([month, subjects]) => {
        const maxSubject = Object.entries(subjects).reduce((a, b) =>
          a[1] > b[1] ? a : b
        );
        return {
          month: monthNames[month - 1],
          subject: maxSubject[0],
          absences: maxSubject[1],
        };
      }
    );
  };

  const countAbsencesOverTime = (data) => {
    const absencesByDate = {};

    data.forEach((absence) => {
      const date = absence.dateAbs.split("T")[0];
      if (!absencesByDate[date]) {
        absencesByDate[date] = 0;
      }
      absencesByDate[date]++;
    });

    return Object.entries(absencesByDate)
      .map(([date, absences]) => ({ date, absences }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseAbsences = await fetch(
          `http://localhost:8080/api/absences/etudiant/${idEtu}`,
          {
            method: "GET",
            headers: {
              Authorization: "Basic " + window.btoa("admin:admin"),
            },
          }
        );

        const jsonDataAbsences = await responseAbsences.json();
        setData(jsonDataAbsences);

        if (jsonDataAbsences.length > 0) {
          const studentNamee = jsonDataAbsences[0].etudiant.nomEtu;
          setStudentName(studentNamee);
        }

        // Appel à la nouvelle API pour récupérer les informations de l'étudiant
        const responseStudentInfo = await fetch(
          `http://localhost:8080/api/etudiants/${idEtu}`,
          {
            method: "GET",
            headers: {
              Authorization: "Basic " + window.btoa("admin:admin"),
            },
          }
        );

        const jsonDataStudentInfo = await responseStudentInfo.json();
        setStudentInfo(jsonDataStudentInfo);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, [idEtu]);

  useEffect(() => {
    const filteredData = data.filter((absence) => {
      const date = new Date(absence.dateAbs);
      if (selectedStartDate && selectedEndDate) {
        return date >= selectedStartDate && date <= selectedEndDate;
      } else if (selectedStartDate) {
        return date >= selectedStartDate;
      } else if (selectedEndDate) {
        return date <= selectedEndDate;
      }
      return true;
    });

    const absences = {};
    let totalHours = 0;
    const hoursBySubject = {};

    filteredData.forEach((absence) => {
      const subject = absence.matiere.nomMat.substring(12);
      const hours = absence.duree / 60; // convert minutes to hours

      totalHours += hours;

      if (!hoursBySubject[subject]) {
        hoursBySubject[subject] = 0;
      }

      hoursBySubject[subject] += hours;

      if (!absences[subject]) {
        absences[subject] = 0;
      }
      absences[subject]++;
    });

    setTotalAbsenceHours(totalHours);
    setAbsenceHoursBySubject(hoursBySubject);

    setAbsencesBySubject(absences);
    setAbsencesByDay(countAbsencesByDayOfWeek(filteredData));
    setMaxAbsencesByMonth(findMaxAbsencesByMonthAndSubject(filteredData));
    setAbsencesOverTime(countAbsencesOverTime(filteredData));
  }, [data, selectedStartDate, selectedEndDate]);

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const totalAbsences = data.length;

  const absencesPercentage = Object.fromEntries(
    Object.entries(absencesBySubject).map(([subject, count]) => [
      subject,
      ((count / totalAbsences) * 100).toFixed(2),
    ])
  );

  const absencesByMonth = {};
  data.forEach((absence) => {
    const month = new Date(absence.dateAbs).getMonth() + 1;
    if (!absencesByMonth[month]) {
      absencesByMonth[month] = 0;
    }
    absencesByMonth[month]++;
  });

  const chartData = {
    labels: Object.keys(absencesBySubject),
    datasets: [
      {
        label: "Nombre d'absences",
        data: Object.values(absencesBySubject),
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
  };

  const pieChartData = {
    labels: Object.keys(absencesBySubject),
    datasets: [
      {
        data: Object.values(absencesBySubject),
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
  };

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const horizontalBarChartData = {
    labels: Object.keys(absencesByMonth).map((month) => monthNames[month - 1]),
    datasets: [
      {
        label: "Nombre d'absences",
        data: Object.values(absencesByMonth),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const horizontalBarChartOptions = {
    indexAxis: "y",
    scales: {
      x: {
        ticks: {
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Container>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography className={classes.title} gutterBottom>
            {studentName}
          </Typography>
          <Typography className={classes.content}>
            Promo: {studentInfo.promo}
          </Typography>
          <Typography className={classes.content}>
            TD: {studentInfo.td}
          </Typography>
          <Typography className={classes.content}>
            TP: {studentInfo.tp}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ flexGrow: 10, mt: 4 }}>
        <Grid container spacing={4} align="center">
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date de début"
                value={selectedStartDate}
                onChange={handleStartDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="Date de fin"
                value={selectedEndDate}
                onChange={handleEndDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={12} alignItems="left">
            <Card elevation={3}>
              <CardHeader title="Statistiques d'absence" />
              <CardContent>
                <Typography align="left">
                  <strong>
                    {" "}
                    Heures totales d'absence: {totalAbsenceHours} heure(s){" "}
                  </strong>
                </Typography>
                <ul>
                  {Object.entries(absenceHoursBySubject).map(
                    ([subject, hours]) => (
                      <li key={subject}>
                        <Typography align="left">
                          {subject}: {hours} heure(s)
                        </Typography>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Typography variant="h6">Absences par matière</Typography>
            <Paper>
              <Pie data={pieChartData} />
            </Paper>
          </Grid>
          <Grid item xs={11} sm={12}>
            <Typography variant="h6">Absences par mois</Typography>
            <Paper>
              <Bar
                data={horizontalBarChartData}
                options={horizontalBarChartOptions}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AbsencePage;
