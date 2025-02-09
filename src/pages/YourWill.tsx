import { Box, Grid2 } from '@mui/material';
import * as React from 'react';
import Sidebar from '../components/Sidebar';


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
                
            </Box>
        </Grid2>
    </Grid2>
    
)}

export default YourWill;