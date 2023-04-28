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




export default function StudentSettings() {
    const promotions = [
        { "promo": "Master 1 Miage", "TDS": [1, 2, 3]},
        { "promo": "Master 2 MBDS", "TDS": [1, 2, 3]},
        { "promo": "Licence 3 Miage", "TDS": [1, 2, 3]},
        { "promo": "Master 2 Siris", "TDS": [1, 2, 3]} 
      ];
    
  const [activeStep, setActiveStep] = React.useState(0);
  const [nom,setNom]=React.useState("")
  const [prenom,setPrenom]=React.useState("")
  const [civility, setcivility] = React.useState('');
  const [td,setTd]=React.useState("")
  const [tp,setTp]=React.useState("")
  const [promo, setPromo] = React.useState();
  const [error, setError] = React.useState('');
  const [steps, setSteps] = React.useState(["Action", "Fin"]);
  const [action, setAction] = React.useState('');
  

  const handleChangeCivility = (event) => {
    setcivility(event.target.value);
  };

  const handleChangePromo = (event) => {
    setPromo(event.target.value);
  };

      const step1 = (
      <Box sx={{ margin:'5rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Typography variant='h4' align='center'  >Je souhaite : </Typography>
        <Button color = "success" variant='outlined' sx={{mt : 2}} onClick={() => {setSteps(["Action", "Informations de l'étudiant", "Groupe TD/TP", "Promotion"]); setActiveStep(1); setAction("Ajouter");}}>Ajouter un étudiant</Button>
        <Button color = "primary" variant='outlined' sx={{mt : 2}} onClick={() =>{setSteps(["Action", "Informations de l'etudiant", "Modifier TD/TP", "Modifier promotion"]); setActiveStep(1); setAction("Modifier")} }>Modifier un étudiant</Button>
        <Button color = "error" variant='outlined' sx={{mt : 2}}  onClick={() =>{setSteps(["Action", "Informations de l'etudiant"]); setActiveStep(1); setAction("Supprimer")} }>supprimer un étudiant</Button>
      </Box>
      )

     const step2 = 
     (
      <Box sx={{ margin:'5rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <FormControl sx={{m : 3, width : "120px"}}>
      <InputLabel id="civility">Civilité</InputLabel>
        <Select
          labelId="civility"
          id="demo-simple-select"
          value={civility}
          label="Civilité"
          onChange={handleChangeCivility}
        >
          <MenuItem value={"M."}>M.</MenuItem>
          <MenuItem value={"Mme"}>Mme</MenuItem>
        </Select>
        </FormControl>
      <TextField id="nom" value={nom} label="Nom de l'étudiant" onChange={(e) => {setNom(e.target.value); setError("")}} variant="outlined" sx={{ mb: 2 }} />
      <TextField id="prenom" value={prenom} label="Prenom de l'étudiant" onChange={(e) => {setPrenom(e.target.value); setError("")}} variant="outlined" />
      <Typography  sx={{color : 'red', fontWeight : "bold", mt : 3}}>
        {error}
      </Typography>
    </Box>
    
     )
    const step3 = action === "Ajouter" ? ( 
    <Box sx={{ margin:'5rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
    <TextField id="TD" value={td} label="Groupe de TD" onChange={e=>setTd(e.target.value)} variant="outlined" sx={{ mb: 2 }} />
    <TextField id="TP" value={tp} label="Groupe de TP" onChange={e=>setTp(e.target.value)} variant="outlined" sx={{ mb: 2 }} />
    <Typography  variant='subtitle2' sx={{ mb: 2 }}>Si l'étudiant n'a pas de groupe de TD ou TP, laissez vide</Typography>
      </Box>)
      : 
      (<Box sx={{ margin:'5rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Typography   sx={{ mb: 2 }}>Modifier le groupe de TP ou TD</Typography>
        <TextField id="TD" value={td} label="Nouveau groupe de TD" onChange={e=>setTd(e.target.value)} variant="outlined" sx={{ mb: 2 }} />
        <TextField id="TP" value={tp} label="Nouveau groupe de TP" onChange={e=>setTp(e.target.value)} variant="outlined" sx={{ mb: 2 }} />
        <Typography   variant='subtitle2' sx={{ mb: 2 }}>Si le groupe de TD ou TP de l'étudiant ne change pas, laissez vide</Typography>
      </Box>)


    const step4 = action==="Ajouter" ?  (<div style={{margin : "0 auto",width:"50%",textAlign:"center",padding:"4rem"}} >
            <FormControl sx={{m : 3, width : "180px"}}>
      <InputLabel id="promo">Promotion</InputLabel>
        <Select
          labelId="promo"
          id="demo-simple-select"
          value={promo}
          label="promo"
          onChange={handleChangePromo}
        >
          {promotions.map(promo => (
            <MenuItem key={promo.promo} value={promo.promo}>{promo.promo}</MenuItem>))}
        </Select>
        </FormControl>
        <Typography   sx={{color : 'red', fontWeight : "bold", mt : 3}}>
        {error}
      </Typography>
        

  </div>) :
  (<div style={{margin : "0 auto",width:"50%",textAlign:"center",padding:"4rem"}} >
    <Typography >
      Modifier la promotion de l'étudiant
    </Typography>
  <FormControl sx={{m : 3, width : "180px"}}>
<InputLabel id="promo">Promotion</InputLabel>
<Select
labelId="promo"
id="demo-simple-select"
value={promo}
label="promo"
onChange={handleChangePromo}
>
{promotions.map(promo => (
  <MenuItem key={promo.promo} value={promo.promo}>{promo.promo}</MenuItem>))}
</Select>
</FormControl>
<Typography   variant='subtitle2' sx={{ mb: 2 }}>Si la promotion de l'étudiant ne change pas, laissez vide</Typography>


</div>)

  const handleNext = () => {
    
          if (activeStep === 1 && (nom==="" || prenom==="" || civility==="")) {
            setError("Veuillez remplir tous les champs")
            return
          }

    if (action === "Ajouter"){

      if(activeStep === 3 && promo === undefined){
        setError("Veuillez choisir une promotion")
        return
      }
    };
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }
    
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (activeStep === 1 ){
      setSteps(["Action", "Fin"])
    }
  };




  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={6} sx={{p: 2}}>

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
          <Typography  sx={{ m: 3}} variant='body1' >
            Etudiant {action === 'Ajouter' ? 'ajouté' : action === "Supprimer" ? 'supprimé' : 'modifié'} avec succès
          </Typography>
        <Button onClick={()=> {setActiveStep(0); setError(""); setNom(""); setPrenom(""); setPromo(""); setTd(""); setTp("")}}>
          Reinitialiser le formulaire
        </Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
        {activeStep===0 ? step1 : activeStep===1 ? step2 : activeStep===2 ? step3 : step4}
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


            <Button onClick={handleNext} variant='outlined' color = {action === "Ajouter" ? "success" : action ==="Supprimer" ? "error" : "primary"}>
              {activeStep===0 ? '' : activeStep === steps.length - 1 ? action : 'Suivant'}
            </Button>
          </Box>
        </React.Fragment>
      )}
      </Paper>
    </Box>
  );
}