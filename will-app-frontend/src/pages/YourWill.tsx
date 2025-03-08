import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import Sidebar2 from '../components/Sidebar2';
import AboutYouPage from './AboutYouPage';
import AddressDetailsPage from './AddressDetailsPage';
import AssetsPage from './AssetsPage';
import BankAccountsPage from './BankAccountsPage';
import BeneficiariesPage from './BeneficiariesPage';
import BondsPage from './BondsPage';
import BusinessesPage from './BusinessesPage';
import CustomAssetsPage from './CustomAssetsPage';
import DebenturesPage from './DebenturesPage';
import DematAccountPage from './DematAccountPage';
import DigitalAssetsPage from './DigitalAssetsPage';
import EscopsPage from './EscopsPage';
import FixedDepositsPage from './FixedDepositsPage';
import InsurancePoliciesPage from './InsurancePoliciesPage';
import IntellectualPropertiesPage from './IntellectualPropertiesPage';
import JewelleriesPage from './JewelleriesPage';
import MutualFundsPage from './MutualFundsPage';
import PensionAccountPage from './PensionAccountPage';
import PersonalDetailsPage from './PersonalDetailsPage';
import PropertiesPage from './PropertiesPage';
import ProvidentFundpage from './ProvidentFundPage';
import SafetyDepositBoxesPage from './SafetyDepositBoxesPage';
import VehiclesPage from './VehiclesPage';
import HomeLoanPage from './HomeLoanPage';
import PersonalLoanPage from './PersonalLoanPage';
import EducationLoanPage from './EducationLoanPage';
import VechicleLoanPage from './VehicleLoanPage';
import OtherLiabilityPage from './OtherLiabilityPage';
import OtherInvestmentPage from './OtherInvestmentPage';
import { routesState } from '../atoms/RouteState';
import { useRecoilValue } from 'recoil';

const YourWill: React.FC = () => {
    const routeState = useRecoilValue(routesState);
    return (
        <BrowserRouter>
            <div className='grid grid-cols-12 w-full m-auto'>
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
                        {routeState.find(s => s.currentPath == "/properties") && <Route path="/properties" element={<PropertiesPage />} />}
                        {routeState.find(s => s.currentPath == "/bank_accounts") && <Route path="/bank_accounts" element={<BankAccountsPage />} />}
                        {routeState.find(s => s.currentPath == "/fixed_deposits") && <Route path="/fixed_deposits" element={<FixedDepositsPage />} />}
                        {routeState.find(s => s.currentPath == "/insurance_policies") && <Route path="/insurance_policies" element={<InsurancePoliciesPage />} />}
                        {routeState.find(s => s.currentPath == "/safe_deposit_boxes") && <Route path="/safe_deposit_boxes" element={<SafetyDepositBoxesPage />} />}
                        {routeState.find(s => s.currentPath == "/demat_accounts") && <Route path="/demat_accounts" element={<DematAccountPage />} />}
                        {routeState.find(s => s.currentPath == "/mutual_funds") && <Route path="/mutual_funds" element={<MutualFundsPage />} />}
                        {routeState.find(s => s.currentPath == "/provident_fund") && <Route path="/provident_fund" element={<ProvidentFundpage />} />}
                        {routeState.find(s => s.currentPath == "/pension_accounts") && <Route path="/pension_accounts" element={<PensionAccountPage />} />}
                        {routeState.find(s => s.currentPath == "/custom_assets") && <Route path="/custom_assets" element={<CustomAssetsPage />} />}
                        {routeState.find(s => s.currentPath == "/intellectual_property") && <Route path="/intellectual_property" element={<IntellectualPropertiesPage />} />}
                        {routeState.find(s => s.currentPath == "/digital_assets") && <Route path="/digital_assets" element={<DigitalAssetsPage />} />}
                        {routeState.find(s => s.currentPath == "/jewelry") && <Route path="/jewelry" element={<JewelleriesPage />} />}
                        {routeState.find(s => s.currentPath == "/vehicles") && <Route path="/vehicles" element={<VehiclesPage />} />}
                        {routeState.find(s => s.currentPath == "/debentures") && <Route path="/debentures" element={<DebenturesPage />} />}
                        {routeState.find(s => s.currentPath == "/esops") && <Route path="/esops" element={<EscopsPage />} />}
                        {routeState.find(s => s.currentPath == "/other_investments") && <Route path="/other_investments" element={<OtherInvestmentPage />} />}
                        {routeState.find(s => s.currentPath == "/bonds") && <Route path="/bonds" element={<BondsPage />} />}
                        {routeState.find(s => s.currentPath == "/business") && <Route path="/business" element={<BusinessesPage />} />}
                        <Route path="/beneficiaries" element={<BeneficiariesPage />} />
                        <Route path="/home_loans" element={<HomeLoanPage />} />
                        <Route path="/personal_loans" element={<PersonalLoanPage />} />
                        <Route path="/education_loans" element={<EducationLoanPage />} />
                        <Route path="/vehicle_loans" element={<VechicleLoanPage />} />
                        <Route path="/other_liabilities" element={<OtherLiabilityPage />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default YourWill;