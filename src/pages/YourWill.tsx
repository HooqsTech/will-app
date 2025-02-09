import { Box, Grid2 } from '@mui/material';
import * as React from 'react';
import Sidebar from '../components/Sidebar';
import { BrowserRouter, Route, Routes } from 'react-router';
import BasicDetails from './PersonalDetails';
import AssetDetails from './AssetDetails';
import PersonalDetails from './PersonalDetails';
import AddressDetails from './AddressDetails';


const YourWill: React.FC = () => {
    return (
        <BrowserRouter>
            <Grid2 container sx={{ height: "100vh" }}>
                <Grid2 size={3}>
                    <Box sx={{ height: '100%', padding: '5%', bgcolor: "lightblue" }}>
                        <Sidebar />
                    </Box>
                </Grid2>
                <Grid2 size={9}>
                    <Box sx={{ height: '100%', padding: '5%', bgcolor: "white" }}>
                        <Routes>
                            <Route path="/personal_details" element={<PersonalDetails />} />
                            <Route path="/address_details" element={<AddressDetails />} />
                        </Routes>
                    </Box>
                </Grid2>
            </Grid2>
        </BrowserRouter>
    )
}

export default YourWill;