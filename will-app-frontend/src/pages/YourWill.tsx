import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import PersonalDetailsPage from './PersonalDetailsPage';
import AddressDetailsPage from './AddressDetailsPage';
import Sidebar2 from '../components/Sidebar2';
import PropertiesPage from './PropertiesPage';
import IntellectualProperties from './IntellectualProperties';
import DigitalAssets from './DigitalAssets';
import Jewelleries from './Jewelleries';
import Vehicles from './Vehicles';
import Escops from './Escops';
import Debentures from './Debentures';
import Bonds from './Bonds';
import BusinessesPage from './BusinessesPage';
import FixedDepositAsset from './FixedDepositAsset';
import InsurancePolicyAsset from './InsurancePolicyAsset';
import SafetyDepositAsset from './SafetyDepositAsset';
import DematAccountPage from './DematAccountPage';
import MutualFundsPage from './MutualFundsPage';
import PensionAccountPage from './PensionAccountPage';
import BeneficiariesPage from './BeneficiariesDetails';
import AboutYouPage from './AboutYouPage';
import CustomAssets from './CustomAssets';
import AssetsPage from './AssetsPage';
import BankAccountsPage from './BankAccountsPage';
import ProvidentFundpage from './ProvidentFundPage';

const YourWill: React.FC = () => {
    return (
        <BrowserRouter>
            <div className='grid grid-cols-12 w-5xl m-auto'>
                <div className='bg-[#265e55] col-span-3'>
                    <div className='top-14 min-h-screen sticky'>
                        <Sidebar2 />
                    </div>
                </div>
                <div className='h-full overflow-hidden flex flex-col col-span-9 items-center p-10 justify-center'>
                    <Routes>
                        <Route path="/about_you" element={<AboutYouPage />} />
                        <Route path="/personal_details" element={<PersonalDetailsPage />} />
                        <Route path="/address_details" element={<AddressDetailsPage />} />
                        <Route path="/assets" element={<AssetsPage />} />
                        <Route path="/properties" element={<PropertiesPage />} />
                        <Route path="/bank_accounts" element={<BankAccountsPage />} />
                        <Route path="/fixed_deposits" element={<FixedDepositAsset />} />
                        <Route path="/insurance_policies" element={<InsurancePolicyAsset />} />
                        <Route path="/safe_deposit_boxes" element={<SafetyDepositAsset />} />
                        <Route path="/demat_accounts" element={<DematAccountPage />} />
                        <Route path="/mutual_funds" element={<MutualFundsPage />} />
                        <Route path="/provident_fund" element={<ProvidentFundpage />} />
                        <Route path="/pension_accounts" element={<PensionAccountPage />} />
                        <Route path="/custom_assets" element={<CustomAssets />} />
                        <Route path="/intellectual_property" element={<IntellectualProperties />} />
                        <Route path="/digital_assets" element={<DigitalAssets />} />
                        <Route path="/jewelry" element={<Jewelleries />} />
                        <Route path="/vehicles" element={<Vehicles />} />
                        <Route path="/esops" element={<Escops />} />
                        <Route path="/debentures" element={<Debentures />} />
                        <Route path="/bonds" element={<Bonds />} />
                        <Route path="/business" element={<BusinessesPage />} />
                        <Route path="/beneficiaries" element={<BeneficiariesPage />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default YourWill;