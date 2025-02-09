import { Box, Grid2 } from '@mui/material';
import * as React from 'react';
import Sidebar from '../components/Sidebar';
import { BrowserRouter, Route, Routes } from 'react-router';
import BasicDetails from './PersonalDetails';
import AssetDetails from './AssetDetails';
import PersonalDetails from './PersonalDetails';
import AddressDetails from './AddressDetails';
import Sidebar2 from '../components/Sidebar2';
import ImmovableAssets from './ImmovableAssets';
import CustomAssets from './CustomAssets';
import IntellectualProperties from './IntellectualProperties';
import DigitalAssets from './DigitalAssets';
import Jewelleries from './Jewelleries';
import Vehicles from './Vehicles';


const YourWill: React.FC = () => {
    return (
        <BrowserRouter>
            <Grid2 container sx={{ height: "100vh" }}>
                <Grid2 size={3}>
                    <Box sx={{ height: '100%', padding: '5%', bgcolor: "lightblue" }}>
                        <Sidebar2 />
                    </Box>
                </Grid2>
                <Grid2 size={9}>
                    <Box sx={{ height: '100%', padding: '5%', bgcolor: "white" }}>
                        <Routes>
                            <Route path="/personal_details" element={<PersonalDetails />} />
                            <Route path="/address_details" element={<AddressDetails />} />
                            <Route path="/immovable_assets" element={<ImmovableAssets />} />
                            <Route path="/custom_assets" element={<CustomAssets />} />
                            <Route path="/intellectual_property" element={<IntellectualProperties />} />
                            <Route path="/digital_assets" element={<DigitalAssets />} />
                            <Route path="/jewelry" element={<Jewelleries />} />
                            <Route path="/vehicles" element={<Vehicles />} />
                        </Routes>
                    </Box>
                </Grid2>
            </Grid2>
        </BrowserRouter>
    )
}

export default YourWill;