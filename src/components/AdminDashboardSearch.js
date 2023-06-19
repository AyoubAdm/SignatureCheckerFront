import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AdminDashboardSearchStudent from './AdminDashboardSearchStudent';
import AdminDashboardSearchTeacher from './AdminDashboardSearchTeacher';
import AdminDashboardSearchMatiere from './AdminDashboardSearchMatiere';
import AdminDashboardSearchPromo from './AdminDashboardSearchPromo';
import PromoPage from './PromoPage';

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

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Etudiants" {...a11yProps(0)} />
          <Tab label="Matieres" {...a11yProps(1)} />
          <Tab label="Absences" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AdminDashboardSearchStudent />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AdminDashboardSearchMatiere />
      </TabPanel>
      <TabPanel value={value} index={2}>
      < PromoPage />
      </TabPanel>
    </Box>
  );
}