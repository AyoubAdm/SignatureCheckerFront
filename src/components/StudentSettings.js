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


  const [activeStep, setActiveStep] = React.useState(0);
  const [nom, setNom] = React.useState("")
  const [prenom, setPrenom] = React.useState("")
  const [civility, setCivility] = React.useState('');
  const [td, setTd] = React.useState("")
  const [tp, setTp] = React.useState("")
  const [promotions, setPromotions] = React.useState([]);
  const [promo, setPromo] = React.useState('');
  const [newPromo, setNewPromo] = React.useState('');
  const [error, setError] = React.useState('');
  const [steps, setSteps] = React.useState(["Action", "Informations de l'étudiant"]);
  const [action, setAction] = React.useState('');

  React.useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/promotion', {
          method: 'GET',
          headers: {
            Authorization: 'Basic ' + window.btoa('admin:admin'),
          },
        });

        const promotionsData = await response.json();
        setPromotions(promotionsData);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
      }
    };
    fetchPromotions();
  }, []);


  const addStudent = async () => {
    await fetch("http://localhost:8080/api/etudiants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + window.btoa("admin:admin")
      },
      body: JSON.stringify(
        {
          "nomEtu": nom.toUpperCase() + " " + prenom.toUpperCase(),
          "td": td,
          "tp": tp,
          "promo": promo
        }
      )
    })
  }

  const  deleteStudent = async () => {
    await fetch(`http://localhost:8080/api/etudiants/${encodeURIComponent(nom.toUpperCase() + " " + prenom.toUpperCase())}/${encodeURIComponent(promo)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + window.btoa('admin:admin'),
      },
    }).then((response) => {
      if (response.status === 404){
        throw new Error('Student not found');
      }
      else if (!response.ok) {
        throw new Error('Failed to delete student');
  }})
}

const modifyStudent = async () => {
  const response = await fetch(`http://localhost:8080/api/etudiants/${encodeURIComponent(nom.toUpperCase() + " " + prenom.toUpperCase())}/${encodeURIComponent(promo)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + window.btoa('admin:admin'),
    },
    body: JSON.stringify({
      'td': td,
      'tp': tp,
      'promo': newPromo
    })
  });
  if (response.status === 404){
    throw new Error('Student not found');
  }
  else if (!response.ok) {
    throw new Error('Failed to modify student');
  }
}

    const handleChangeCivility = (event) => {
      setCivility(event.target.value);
    };

    const handleChangePromo = (event) => {
      setPromo(event.target.value);
    };

    const handleChangeNewPromo = (event) => {
      setNewPromo(event.target.value);
    };

    const step1 = (
      <Box sx={{ margin: '5rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Typography variant='h4' align='center'  >Je souhaite : </Typography>
        <Button color="success" variant='outlined' sx={{ mt: 2 }} onClick={() => { setSteps(["Action", "Informations de l'étudiant", "Groupe TD/TP"]); setActiveStep(1); setAction("Ajouter"); }}>Ajouter un étudiant</Button>
        <Button color="primary" variant='outlined' sx={{ mt: 2 }} onClick={() => { setSteps(["Action", "Informations de l'etudiant", "Modifier TD/TP", "Modifier promotion"]); setActiveStep(1); setAction("Modifier") }}>Modifier un étudiant</Button>
        <Button color="error" variant='outlined' sx={{ mt: 2 }} onClick={() => { setSteps(["Action", "Informations de l'etudiant"]); setActiveStep(1); setAction("Supprimer") }}>supprimer un étudiant</Button>

      </Box>
    )

    const step2 =
      (
        <Box sx={{ m: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <FormControl sx={{ mb: 2, width: "120px" }}>
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
          <TextField id="nom" value={nom} label="Nom de l'étudiant" onChange={(e) => { setNom(e.target.value); setError("") }} variant="outlined" sx={{ mb: 2 }} />
          <TextField id="prenom" value={prenom} label="Prenom de l'étudiant" onChange={(e) => { setPrenom(e.target.value); setError("") }} variant="outlined" />
          <FormControl sx={{ mt: 2, width: "212px" }}>
            <InputLabel id="promo">Promotion</InputLabel>
            <Select
              labelId="promo"
              id="promo"
              value={promo}
              label="promo"
              onChange={handleChangePromo}
            >
              {promotions.map((promo) => (
                <MenuItem key={promo.nomPromo} value={promo.nomPromo}>{promo.nomPromo}</MenuItem>))}
            </Select>
          </FormControl>
          <Typography sx={{ color: 'red', fontWeight: "bold", mt: 3 }}>
            {error}
          </Typography>
        </Box>

      )
    const step3 = action === "Ajouter" ? (
      <Box sx={{ margin: '5rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <TextField id="TD" value={td} label="Groupe de TD" onChange={e => setTd(e.target.value)} variant="outlined" sx={{ mb: 2 }} />
        <TextField id="TP" value={tp} label="Groupe de TP" onChange={e => setTp(e.target.value)} variant="outlined" sx={{ mb: 2 }} />
        <Typography variant='subtitle2' sx={{ mb: 2 }}>Si l'étudiant n'a pas de groupe de TD ou TP, laissez vide</Typography>
        <Typography sx={{ color: 'red', fontWeight: "bold", mt: 3 }}>
          {error}
        </Typography>
      </Box>)
      :
      (<Box sx={{ margin: '5rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Typography sx={{ mb: 2 }}>Modifier le groupe de TP ou TD</Typography>
        <TextField id="TD" value={td} label="Nouveau groupe de TD" onChange={e => setTd(e.target.value)} variant="outlined" sx={{ mb: 2 }} />
        <TextField id="TP" value={tp} label="Nouveau groupe de TP" onChange={e => setTp(e.target.value)} variant="outlined" sx={{ mb: 2 }} />
        <Typography variant='subtitle2' sx={{ mb: 2 }}>Si le groupe de TD ou TP de l'étudiant ne change pas, laissez vide</Typography>
        <Typography sx={{ color: 'red', fontWeight: "bold", mt: 3 }}>
          {error}
        </Typography>
      </Box>)


    const step4 = (<div style={{ margin: "0 auto", width: "50%", textAlign: "center", padding: "4rem" }} >
      <Typography sx={{ mb: 2 }}>Modifier la promotion</Typography>
      <FormControl sx={{ width: "200px" }}>
        <InputLabel id="Newpromo">Nouvelle Promotion</InputLabel>
        <Select
          labelId="Newpromo"
          id="Newpromo"
          value={newPromo}
          label="Newpromo"
          onChange={handleChangeNewPromo}
        >
          {promotions.map(promo => (
            <MenuItem key={promo.nomPromo} value={promo.nomPromo}>{promo.nomPromo}</MenuItem>))}
        </Select>
      </FormControl>
      <Typography variant='subtitle2' sx={{ m: 2 }}>Si la promotion de l'étudiant ne change pas, laissez vide ou selectionnez sa promotion actuelle</Typography>
      <Typography sx={{ color: 'red', fontWeight: "bold", mt: 3 }}>
        {error}
      </Typography>


    </div>)
    const  handleNext =  async () => {

      let requestError = false
      if (activeStep === 1 && (nom === "" || prenom === "" || civility === "" || promo === undefined)) {
        setError("Veuillez remplir tous les champs")
        return
      }

      //Ajouter un étudiant
      if (action === "Ajouter" && activeStep === steps.length - 1) {
        try {
          await addStudent()
        }
        catch (e) {
          requestError = true;
          setError("Une erreur est survenue. L'action a échoué")
        }
      }

      //Modifier  un étudiant
      else if (action === "Modifier" && activeStep === steps.length - 1) {
        try {
          await modifyStudent()
        }
        catch (e) {
          requestError = true;
          if(e.message === "Student not found"){
            setError("Cet étudiant n'existe pas. Veuillez verifier les informations saisies.");
          }
          else{
            setError("Une erreur est survenue. L'action a échoué")
          }
        }
      }


      //supprimer etudiant
      else if (action === "Supprimer" && activeStep === steps.length - 1) {
        try {
          await deleteStudent()
        }
        catch (e) {
          requestError = true;
          if(e.message === "Student not found"){
            setError("Cet étudiant n'existe pas. Veuillez verifier les informations saisies.");
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
        setSteps(["Action", "Informations de l'étudiant"])
        setPromo('')
        setNewPromo('')
        setNom("")
        setPrenom("")
        setCivility('')
        setTd('')
        setTp('')

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
                Etudiant {action === 'Ajouter' ? 'ajouté' : action === "Supprimer" ? 'supprimé' : 'modifié'} avec succès
              </Typography>
              <Button onClick={() => { setActiveStep(0); setError(""); setNom(""); setCivility(''); setPrenom(""); setPromo(''); setNewPromo(''); setTd(""); setTp("") }}>
                Reinitialiser le formulaire
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep === 0 ? step1 : activeStep === 1 ? step2 : activeStep === 2 ? step3 : step4}
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
