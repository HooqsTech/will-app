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
import LiabilitiesPage from './LiabilitiesPage';
import { ROUTE_PATHS } from '../constants';

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
                        <Route path={ROUTE_PATHS.ABOUT_YOU} element={<AboutYouPage />} />
                        <Route path={ROUTE_PATHS.PERSONAL_DETAILS} element={<PersonalDetailsPage />} />
                        <Route path={ROUTE_PATHS.ADDRESS_DETAILS} element={<AddressDetailsPage />} />

                        {/* ASSETS START */}
                        <Route path={ROUTE_PATHS.ASSETS} element={<AssetsPage />} />
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.PROPERTIES) && <Route path={ROUTE_PATHS.PROPERTIES} element={<PropertiesPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.BANK_ACCOUNTS) && <Route path={ROUTE_PATHS.BANK_ACCOUNTS} element={<BankAccountsPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.FIXED_DEPOSITS) && <Route path={ROUTE_PATHS.FIXED_DEPOSITS} element={<FixedDepositsPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.INSURANCE_POLICIES) && <Route path={ROUTE_PATHS.INSURANCE_POLICIES} element={<InsurancePoliciesPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.SAFE_DEPOSIT_BOXES) && <Route path={ROUTE_PATHS.SAFE_DEPOSIT_BOXES} element={<SafetyDepositBoxesPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.DEMAT_ACCOUNTS) && <Route path={ROUTE_PATHS.DEMAT_ACCOUNTS} element={<DematAccountPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.MUTUAL_FUNDS) && <Route path={ROUTE_PATHS.MUTUAL_FUNDS} element={<MutualFundsPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.PROVIDENT_FUND) && <Route path={ROUTE_PATHS.PROVIDENT_FUND} element={<ProvidentFundpage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.PENSION_ACCOUNTS) && <Route path={ROUTE_PATHS.PENSION_ACCOUNTS} element={<PensionAccountPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.CUSTOM_ASSETS) && <Route path={ROUTE_PATHS.CUSTOM_ASSETS} element={<CustomAssetsPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.INTELLECTUAL_PROPERTY) && <Route path={ROUTE_PATHS.INTELLECTUAL_PROPERTY} element={<IntellectualPropertiesPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.DIGITAL_ASSETS) && <Route path={ROUTE_PATHS.DIGITAL_ASSETS} element={<DigitalAssetsPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.JEWELLERIES) && <Route path={ROUTE_PATHS.JEWELLERIES} element={<JewelleriesPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.VEHICLES) && <Route path={ROUTE_PATHS.VEHICLES} element={<VehiclesPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.DEBENTURES) && <Route path={ROUTE_PATHS.DEBENTURES} element={<DebenturesPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.ESCOPS) && <Route path={ROUTE_PATHS.ESCOPS} element={<EscopsPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.OTHER_INVESTMENTS) && <Route path={ROUTE_PATHS.OTHER_INVESTMENTS} element={<OtherInvestmentPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.BONDS) && <Route path={ROUTE_PATHS.BONDS} element={<BondsPage />} />}
                        {routeState.find(s => s.currentPath == ROUTE_PATHS.BUSINESS) && <Route path={ROUTE_PATHS.BUSINESS} element={<BusinessesPage />} />}
                        {/* ASSETS END */}

                        {/* LIABILITIES START */}
                        <Route path={ROUTE_PATHS.LIABILITIES} element={<LiabilitiesPage />} />
                        {routeState.find(s => s.currentPath === ROUTE_PATHS.HOME_LOANS) && <Route path={ROUTE_PATHS.HOME_LOANS} element={<HomeLoanPage />} />}
                        {routeState.find(s => s.currentPath === ROUTE_PATHS.PERSONAL_LOANS) && <Route path={ROUTE_PATHS.PERSONAL_LOANS} element={<PersonalLoanPage />} />}
                        {routeState.find(s => s.currentPath === ROUTE_PATHS.VEHICLE_LOANS) && <Route path={ROUTE_PATHS.VEHICLE_LOANS} element={<VechicleLoanPage />} />}
                        {routeState.find(s => s.currentPath === ROUTE_PATHS.EDUCATION_LOANS) && <Route path={ROUTE_PATHS.EDUCATION_LOANS} element={<EducationLoanPage />} />}
                        {routeState.find(s => s.currentPath === ROUTE_PATHS.OTHER_LIABILITIES) && <Route path={ROUTE_PATHS.OTHER_LIABILITIES} element={<OtherLiabilityPage />} />}
                        {/* LIABILITIES END */}

                        <Route path={ROUTE_PATHS.BENEFICIARIES} element={<BeneficiariesPage />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default YourWill;