import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Paper } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';




export default function PromotionSettings() {


  const [activeStep, setActiveStep] = React.useState(0);
  const [nom, setNom] = React.useState("")
  const [error, setError] = React.useState('');
  const [steps, setSteps] = React.useState(["Action", "Informations de promotion"]);
  const [action, setAction] = React.useState('');



  const addPromotion = async () => {
    await fetch("http://localhost:8080/api/promotion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + window.btoa("admin:admin")
      },
      body: JSON.stringify(
        {
          "nomPromo": nom,
        }
      )
    })
  }

  const  deletePromotion = async () => {
    await fetch(`http://localhost:8080/api/promotion/${encodeURIComponent(nom)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + window.btoa('admin:admin'),
      },
    }).then((response) => {
      if (response.status === 404){
        throw new Error('Promotion not found');
      }
      else if (!response.ok) {
        throw new Error('Failed to delete promotion');
  }})
}



    const step1 = (
      <Box sx={{ margin: '5rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Typography variant='h4' align='center'  >Je souhaite : </Typography>
        <Button color="success" variant='outlined' sx={{ mt: 2 }} onClick={() => {handleNext(); setAction("Ajouter"); }}>Ajouter une promotion</Button>
        <Button color="error" variant='outlined' sx={{ mt: 2 }} onClick={() => {handleNext(); setAction("Supprimer") }}>supprimer une promotion</Button>

      </Box>
    )

    const step2 =
      (
        <Box sx={{ m: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <TextField id="nom" value={nom} label="Nom de la promotion" onChange={(e) => { setNom(e.target.value); setError("") }} variant="outlined" sx={{ mb: 2 }} />
          <Typography sx={{ color: 'red', fontWeight: "bold", mt: 3 }}>
            {error}
          </Typography>
        </Box>

      )
      const  handleNext =  async () => {

      let requestError = false
      if (activeStep === 1 && (nom === "")){
        setError("Veuillez remplir tous les champs")
        return
      }

      if (action === "Ajouter" && activeStep === steps.length - 1) {
        try {
          await addPromotion()
        }
        catch (e) {
          requestError = true;
          setError("Une erreur est survenue. L'action a échoué")
        }
      }

      else if (action === "Supprimer" && activeStep === steps.length - 1) {
        try {
          await deletePromotion()
        }
        catch (e) {
          requestError = true;
          if(e.message === "Promotion not found"){
            setError("Cette promotion n'existe pas. Veuillez verifier les informations saisies.");
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
        setNom("")
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
                Enseignant {action === 'Ajouter' ? 'ajouté' : "supprimé"} avec succès
              </Typography>
              <Button onClick={() => { setActiveStep(0); setError(""); setNom(""); }}>
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
