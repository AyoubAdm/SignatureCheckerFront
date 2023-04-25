import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Padding } from '@mui/icons-material';

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];



export default function HorizontalLinearStepper() {
    const promotions = [
        { "promo": "Master 1 Miage", "TDS": [1, 2, 3]},
        { "promo": "Master 2 MBDS", "TDS": [1, 2, 3]},
        { "promo": "Licence 3 Miage", "TDS": [1, 2, 3]},
        { "promo": "Master 2 Siris", "TDS": [1, 2, 3]} 
      ];
    
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [nom,setNom]=React.useState("")
  const [prenom,setPrenom]=React.useState("")
  const [email,setEmail]=React.useState("")
  const [chosenPromo, setChosenPromo] = React.useState();
  const [chosenTd, setChosenTd] = React.useState();

  const handlePromoChange = (e) => {
    const selectedPromo = promotions.find(promo => promo.promo === e.target.value);
    setChosenPromo(selectedPromo);
    setChosenTd(undefined);
  }


  function hello(){
    console.log(activeStep)
    console.log(nom)
    console.log(prenom)
    console.log(email)
    console.log(chosenPromo)
    console.log(chosenTd)
  }


     const step1 = (
      <Box sx={{ margin:'5rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <TextField id="nom" value={nom} label="Nom" onChange={(e) => setNom(e.target.value)} variant="outlined" sx={{ mb: 2 }} />
      <TextField id="prenom" value={prenom} label="Prenom" onChange={(e) => setPrenom(e.target.value)} variant="outlined" />
    </Box>
    
  )
    const step2 = ( 
    <Box sx={{ margin:'5rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
    <TextField id="email" value={email} label="Email" onChange={e=>setEmail(e.target.value)} variant="outlined" sx={{ mb: 2 }} />
      </Box>)

    const step3 = (<div style={{margin : "0 auto",width:"50%",textAlign:"center",padding:"4rem"}} className='searchBar'>
    <label htmlFor="promotion-select">Choississez une Promotion:</label>
    <select id="promotion-select" value={chosenPromo?.promo} onChange={handlePromoChange}>
      <option value="">--Choississez une Promotion--</option>
      {promotions.map(promo => (
        <option key={promo.promo} value={promo.promo}>{promo.promo}</option>
      ))}
    </select>
    {chosenPromo ? (      
      <div>
      <label htmlFor="promotion-select">Choississez un Groupe de TD:</label>
      <select id="td-select" value={chosenTd} onChange={(e) => setChosenTd(e.target.value)}>
        <option value="">--Choississez le groupe de TD--</option>
        {chosenPromo.TDS.map(td => (
          <option key={td} value={td}>TD {td}</option>
        ))}
      </select>
      </div>
    ) : null}
  </div>)
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
        {activeStep===0 ? step1 : (activeStep===1 ? step2 : step3)}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}