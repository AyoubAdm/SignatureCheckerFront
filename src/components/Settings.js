import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import StudentSettings from './StudentSettings';
import TeacherSettings from './TeacherSettings';
import PromotionSettings from './PromotionSettings';
import AdminSettings from './AdminSettings';
import MatiereSettings from './MatiereSettings';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Settings() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
        <Typography variant='h4' align='center'>Paramètres</Typography>
        <Typography variant='body1' sx={{mt: 3, mb:3}}>Vous pouvez ici ajouter/modifier/supprimer un étudiant, un enseignant, une promotion, ainsi qu'une matiere.</Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Etudiants" {...a11yProps(0)} />
          <Tab label="Enseignants" {...a11yProps(1)} />
          <Tab label="Promotions" {...a11yProps(2)} />
          <Tab label="Matieres" {...a11yProps(3)} />
          <Tab label="Administrateurs" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <StudentSettings />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TeacherSettings />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PromotionSettings />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <MatiereSettings />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <AdminSettings />
      </TabPanel>
    </Box>
  );
}