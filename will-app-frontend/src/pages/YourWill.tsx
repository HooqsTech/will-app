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

const YourWill: React.FC = () => {
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
                        <Route path="/properties" element={<PropertiesPage />} />
                        <Route path="/bank_accounts" element={<BankAccountsPage />} />
                        <Route path="/fixed_deposits" element={<FixedDepositsPage />} />
                        <Route path="/insurance_policies" element={<InsurancePoliciesPage />} />
                        <Route path="/safe_deposit_boxes" element={<SafetyDepositBoxesPage />} />
                        <Route path="/demat_accounts" element={<DematAccountPage />} />
                        <Route path="/mutual_funds" element={<MutualFundsPage />} />
                        <Route path="/provident_fund" element={<ProvidentFundpage />} />
                        <Route path="/pension_accounts" element={<PensionAccountPage />} />
                        <Route path="/custom_assets" element={<CustomAssetsPage />} />
                        <Route path="/intellectual_property" element={<IntellectualPropertiesPage />} />
                        <Route path="/digital_assets" element={<DigitalAssetsPage />} />
                        <Route path="/jewelry" element={<JewelleriesPage />} />
                        <Route path="/vehicles" element={<VehiclesPage />} />
                        <Route path="/esops" element={<EscopsPage />} />
                        <Route path="/debentures" element={<DebenturesPage />} />
                        <Route path="/bonds" element={<BondsPage />} />
                        <Route path="/business" element={<BusinessesPage />} />
                        <Route path="/beneficiaries" element={<BeneficiariesPage />} />
                        <Route path="/home_loans" element={<HomeLoanPage />} />
                        <Route path="/personal_loans" element={<PersonalLoanPage />} />
                        <Route path="/education_loans" element={<EducationLoanPage />} />
                        <Route path="/vehicle_loans" element={<VechicleLoanPage />} />
                        <Route path="/other_liabilities" element={<OtherLiabilityPage />} />
                        <Route path="/other_investments" element={<OtherInvestmentPage />} /> 
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default YourWill;