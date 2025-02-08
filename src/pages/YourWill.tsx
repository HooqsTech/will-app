import { Box, Grid2, Paper, styled } from '@mui/material';
import * as React from 'react';
import Sidebar from '../components/Sidebar';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

const YourWill: React.FC = () => {
return(
    <Grid2 container sx={{ height: "100vh" }}>
        <Grid2 size={3}>
            <Box sx={{ height: '100%', padding:'5%', bgcolor: "lightblue"}}>
                <Sidebar />
            </Box>
        </Grid2>
        <Grid2 size={9}>
            <Box sx={{ height: '100%', padding:'5%', bgcolor: "white"}}>
                <Item>size=4</Item>
            </Box>
        </Grid2>
    </Grid2>
    
)}

export default YourWill;