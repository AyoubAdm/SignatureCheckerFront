import React from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  InputBase,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';

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
    border: '1px solid #429cb7',
    borderRadius: '8px',
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

export default function AdminDashboardSearchPromo() {
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPromos, setFilteredPromos] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/promotion', {
          method: 'GET',
          headers: {
            Authorization: 'Basic ' + window.btoa('admin:admin'),
          },
        });

        const promosData = await response.json();
        setPromos(promosData);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch promos:', error);
      }
    };

    fetchPromos();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = promos.filter((promo) => {
      return promo.nomPromo.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredPromos(filtered);
  }, [searchTerm, promos]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Rechercher une promotion</Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleSearch}
          />
        </Search>
      </Box>
      <Paper sx={{ width: '100%', mt: 2 }} elevation={6}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom de la promotion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPromos
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((promo, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {promo.nomPromo}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredPromos.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </Paper>
    </Box>
  );
}
