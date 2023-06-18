import React from 'react'
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import { Navigate } from 'react-router-dom';
import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router-dom';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    border: "1px solid #429cb7",
    borderRadius: "8px",

    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  if (orderBy === "absences") {
    return order === "desc"
      ? (a, b) => -descendingComparator(a, b, orderBy)
      : (a, b) => descendingComparator(a, b, orderBy);
  }
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'idEtu',
    numeric: false,
    disablePadding: true,
    label: 'Identifiant',
  },
  {
    id: 'nomEtu',
    numeric: false,
    disablePadding: false,
    label: 'Nom et prénom',
  },
  {
    id: 'promo',
    numeric: false,
    disablePadding: false,
    label: 'Promotion',
  },
  {
    id: 'absences',
    numeric: true,
    disablePadding: false,
    label: "Nombre d'absences",
  }
];

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'id';
const DEFAULT_ROWS_PER_PAGE = 5;

function EnhancedTableHead(props) {
  const { order, orderBy, rowCount, onRequestSort } =
    props;
  const createSortHandler = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };

  return (
    <TableHead >
      <TableRow>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function AdminDashboardSearchStudent() {
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [page, setPage] = React.useState(0);
  const [visibleRows, setVisibleRows] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
  const [paddingHeight, setPaddingHeight] = React.useState(0);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const [studentsResponse, absencesResponse] = await Promise.all([
          fetch('http://localhost:8080/api/etudiants', {
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + window.btoa('admin:admin'),
            },
          }),
          fetch('http://localhost:8080/api/absences/totalAbsencesEtudiant', {
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + window.btoa('admin:admin'),
            },
          }),
        ]);
  
        const studentsData = await studentsResponse.json();
        const absencesData = await absencesResponse.json();
        const absencesMap = new Map(absencesData.map(({ etuAbs, total_absences }) => [etuAbs, total_absences]));
  
        const studentsWithAbsences = studentsData.map((student) => {
          const absencesCount = absencesMap.get(student.idEtu) || 0;
          return { ...student, absences: absencesCount };
        });
  
        setStudents(studentsWithAbsences);
        setIsLoading(false);
  
        let rowsOnMount = stableSort(
          studentsWithAbsences,
          getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
        );
  
        rowsOnMount = rowsOnMount.slice(
          0 * DEFAULT_ROWS_PER_PAGE,
          0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
        );
  
        setVisibleRows(rowsOnMount);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };
  
    fetchStudents();
  }, []);
  
  

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


useEffect(() => {
  const filtered = students.filter((student) => {
    return (
      student.nomEtu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.promo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.idEtu.toString().includes(searchTerm)
    );
  });

  setFilteredStudents(filtered);
}, [searchTerm, students]);


  useEffect(() => {
    const sortedRows = stableSort(filteredStudents, getComparator(order, orderBy));
    const updatedRows = sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  
    setVisibleRows(updatedRows);
    setPage(0);
  }, [searchTerm, filteredStudents, order, orderBy, rowsPerPage]);
  
  


  const handleRequestSort = React.useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === "asc";
      const toggledOrder = isAsc ? "desc" : "asc";
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);

      const filteredStudents = students.filter((student) => {
        return (
          student.nomEtu.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.promo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.idEtu.toString().includes(searchTerm)
        );
      });

      const sortedRows = stableSort(filteredStudents, getComparator(toggledOrder, newOrderBy));
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );

      setVisibleRows(updatedRows);
    },
    [order, orderBy, page, rowsPerPage, searchTerm],
  );




  const handleChangePage = React.useCallback(
    (event, newPage) => {
      setPage(newPage);

      const filteredStudents = students.filter((student) => {
        return (
          student.nomEtu.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.promo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.idEtu.toString().includes(searchTerm)
        );
      });

      const sortedRows = stableSort(filteredStudents, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage,
      );

      setVisibleRows(updatedRows);

    },
    [order, orderBy, rowsPerPage, students, searchTerm],
  );


  const handleChangeRowsPerPage = React.useCallback(
    (event) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);

      setPage(0);

      const filteredStudents = students.filter((student) => {
        return (
          student.nomEtu.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.promo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.idEtu.toString().includes(searchTerm)
        );
      });

      const sortedRows = stableSort(filteredStudents, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage,
      );

      setVisibleRows(updatedRows);

      setPaddingHeight(0);
    },
    [order, orderBy, students, searchTerm],
  );




  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: "space-between" }}>

        <Typography variant='h6'>
          Rechercher un étudiant
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            value={searchTerm}
            onChange={handleSearch}
          />
        </Search>
      </Box>
      <Paper sx={{ width: '100%', mt: 2 }} elevation={6}>
        {isLoading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (

          <>
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={"medium"}
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={students.length}
                />
                <TableBody>
                  {visibleRows
                    ? visibleRows.map((students, index) => {
                      return (
                        <TableRow
                          hover
                          onClick={()=>{navigate(`/AdminDashboard/student/${students.idEtu}`, { state: {student : students.idEtu} })}}
                          role="checkbox"
                          tabIndex={-1}
                          key={students.idEtu}
                          sx={{ cursor: 'pointer' }}
                        >
                        

                          <TableCell>{students.idEtu}</TableCell>
                          <TableCell >{students.nomEtu}</TableCell>
                          <TableCell >{students.promo}</TableCell>
                          <TableCell align='right' >{students.absences}</TableCell>
                        </TableRow>
                      );
                    })
                    : null}
                  {paddingHeight > 0 && (
                    <TableRow
                      style={{
                        height: paddingHeight,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredStudents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>)}
      </Paper>
    </Box>
  );
}