import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Paper } from '@mui/material';



export default function AdminSettings() {


  const [activeStep, setActiveStep] = React.useState(0);
  const [identifiant, setIdentifiant] = React.useState("")
  const [mdp, setMdp] = React.useState("")
  const [error, setError] = React.useState('');
  const [steps, setSteps] = React.useState(["Action", "Informations de l'administrateur"]);
  const [action, setAction] = React.useState('');



  const addAdmin = async () => {
    await fetch("http://localhost:8080/api/utilisateur", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + window.btoa("admin:admin")
      },
      body: JSON.stringify(
        {
          "nomUser": identifiant,
          "pswUser" : mdp,
          "roleUser" : true
        }
      )
    }).then((response) => {
      if (response.status === 409){
        throw new Error('Admin already exists');
      }
      else if (!response.ok) {
        throw new Error('Failed to delete Admin');
  }})
  }

  const  deleteAdmin = async () => {
    await fetch(`http://localhost:8080/api/utilisateur/${encodeURIComponent(identifiant)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + window.btoa('admin:admin'),
      },
    }).then((response) => {
      if (response.status === 404){
        throw new Error('Admin not found');
      }
      else if (!response.ok) {
        throw new Error('Failed to delete admin');
  }})
}


    const step1 = (
      <Box sx={{ margin: '5rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Typography variant='h4' align='center'  >Je souhaite : </Typography>
        <Button color="success" variant='outlined' sx={{ mt: 2 }} onClick={() => {handleNext(); setAction("Ajouter"); }}>Ajouter un administrateur</Button>
        <Button color="error" variant='outlined' sx={{ mt: 2 }} onClick={() => {handleNext(); setAction("Supprimer") }}>supprimer un administrateur</Button>

      </Box>
    )

    const step2 =
      action === "Ajouter" ?
      (
        <Box sx={{ m: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

          <TextField id="identifiant" value={identifiant} label="Identifiant" onChange={(e) => { setIdentifiant(e.target.value); setError("") }} variant="outlined" sx={{ mb: 2 }} />
          <TextField id="mdp" value={mdp} label="Mot de passe" onChange={(e) => { setMdp(e.target.value); setError("") }} variant="outlined" />
          <Typography sx={{ color: 'red', fontWeight: "bold", mt: 3 }}>
            {error}
          </Typography>
        </Box>

      ) : 
      (
        <Box sx={{ m: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

        <TextField id="identifiant" value={identifiant} label="Identifiant" onChange={(e) => { setIdentifiant(e.target.value); setError("") }} variant="outlined" sx={{ mb: 2 }} />
        <Typography sx={{ color: 'red', fontWeight: "bold", mt: 3 }}>
          {error}
        </Typography>
      </Box>
      )
      const  handleNext =  async () => {

      let requestError = false
      if (activeStep === 1 && (identifiant === "" || mdp === "") && action === "Ajouter") {
        setError("Veuillez remplir tous les champs")
        return
      }
      else if (activeStep === 1 && identifiant === "" && action === "Supprimer") {
        setError("Veuillez remplir tous les champs")
        return
      }

      //Ajouter un enseignant
      if (action === "Ajouter" && activeStep === steps.length - 1) {
        try {
          await addAdmin()
        }
        catch (e) {
          if(e.message === "Admin already exists"){
            requestError = true;
            setError("Cet administrateur existe déjà.");
          }
          else{
            setError("Une erreur est survenue. L'action a échoué")
          }
        }
      }

      //supprimer enseignant
      else if (action === "Supprimer" && activeStep === steps.length - 1) {
        try {
          await deleteAdmin()
        }
        catch (e) {
          requestError = true;
          if(e.message === "Admin not found"){
            setError("Cet administrateur n'existe pas. Veuillez verifier les informations saisies.");
          }
          else{
            setError("Une erreur est survenue. L'action a échoué")
          }
        }
      }

      if (requestError) return

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      if (activeStep === 1) {
        setIdentifiant("")
        setMdp("")
      }
      setError("")
    };


  

    return (
      <Box sx={{ width: '100%' }}>
        <Paper elevation={6} sx={{ p: 2 }}>

          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ m: 3 }} variant='body1' >
                Administrateur {action === 'Ajouter' ? 'ajouté' : "supprimé"} avec succès
              </Typography>
              <Button onClick={() => { setActiveStep(0); setError(""); setIdentifiant(""); setMdp(""); }}>
                Reinitialiser le formulaire
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep === 0 ? step1 : step2}
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                {activeStep === 0 ?
                  ''
                  :
                  <>
                    <Button
                      color="inherit"
                      onClick={handleBack}
                    >
                      Précedent
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                  </>
                }

                {activeStep === 0 ? null :
                  <Button onClick={handleNext} variant='outlined' color={action === "Ajouter" ? "success" : action === "Supprimer" ? "error" : "primary"}>
                    {activeStep === 0 ? '' : activeStep === steps.length - 1 ? action : 'Suivant'}
                  </Button>}
              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Box>
    );
  }
