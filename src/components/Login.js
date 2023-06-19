import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from './AuthProvider';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://univ-cotedazur.fr/">
        Université Côte d'azur
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Login() {

  const navigate = useNavigate();

  const [error, setError] = React.useState("");
  
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const isLogged = await login(data.get('identifiant'), data.get('mot de passe'))
    if(isLogged === 0){
      setError("Identifiant ou mot de passe incorrect")
    }
    else if(isLogged === -1){
      setError("Erreur de connexion")}

    else{
      navigate('/admindashboard');
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <Typography variant="h3" component="h1" align='center' color="white" sx={{backgroundColor : '#489cb4', p : 2}}>
        Signature Checker
      </Typography>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >

          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Connexion
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="identifiant"
              label="identifiant"
              name="identifiant"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="mot de passe"
              label="mot de passe"
              type="password"
              id="mot de passe"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor : '#489cb4' }}
            >
              Se connecter
            </Button>

            <Typography variant="body2" color="red" align="center" sx={{ mt: 3 }}>
              {error}
            </Typography>
          </Box>
        </Box>

        <Copyright sx={{ mt: 8, mb: 4 }} />

      </Container>
    </ThemeProvider>
  );
}