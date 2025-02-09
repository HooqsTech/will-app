import { Box, Grid2 } from '@mui/material';
import * as React from 'react';
import Sidebar from '../components/Sidebar';
import { BrowserRouter, Route, Routes } from 'react-router';
import BasicDetails from './BasicDetails';
import AssetDetails from './AssetDetails';


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
                            <Route path="/personal_details" element={<BasicDetails />} />
                            <Route path="/asset-details" element={<AssetDetails />} />
                        </Routes>
                    </Box>
                </Grid2>
            </Grid2>
        </BrowserRouter>
    )
}

export default YourWill;