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
import Escops from './Escops';
import Debentures from './Debentures';
import Bonds from './Bonds';
import Businesses from './Businesses';
import BankAccountAsset from './BankAccountAsset';
import FixedDepositAsset from './FixedDepositAsset';
import InsurancePolicyAsset from './InsurancePolicyAsset';
import SafetyDepositAsset from './SafetyDepositAsset';
import DematAccountAsset from './DematAccountAsset';
import MutualFundAsset from './MutualFundAsset';
import ProvidentFundAsset from './ProvidentFundAsset';
import PensionAccountAsset from './PensionAccountAsset';
import BeneficiariesPage from './BeneficiariesDetails';


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
                            <Route path="/bank_accounts" element={<BankAccountAsset />} />
                            <Route path="/fixed_deposits" element={<FixedDepositAsset />} />
                            <Route path="/insurance_policies" element={<InsurancePolicyAsset />} />
                            <Route path="/safe_deposit_boxes" element={<SafetyDepositAsset />} />
                            <Route path="/demat_accounts" element={<DematAccountAsset />} />
                            <Route path="/mutual_funds" element={<MutualFundAsset />} />
                            <Route path="/provident_fund" element={<ProvidentFundAsset />} />
                            <Route path="/pension_accounts" element={<PensionAccountAsset />} />
                            <Route path="/custom_assets" element={<CustomAssets />} />
                            <Route path="/intellectual_property" element={<IntellectualProperties />} />
                            <Route path="/digital_assets" element={<DigitalAssets />} />
                            <Route path="/jewelry" element={<Jewelleries />} />
                            <Route path="/vehicles" element={<Vehicles />} />
                            <Route path="/esops" element={<Escops />} />
                            <Route path="/debentures" element={<Debentures />} />
                            <Route path="/bonds" element={<Bonds />} />
                            <Route path="/business" element={<Businesses />} />
                            <Route path="/beneficiaries" element={<BeneficiariesPage />} />
                        </Routes>
                    </Box>
                </Grid2>
            </Grid2>
        </BrowserRouter>
    )
}

export default YourWill;