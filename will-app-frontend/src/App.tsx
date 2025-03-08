import { useEffect } from "react"
import { useSetRecoilState } from "recoil"
import { getUser } from "./api/user"
import { addressDetailsState } from "./atoms/AddressDetailsState"
import { bankDetailsState, IBankDetailsState } from "./atoms/BankDetailsState"
import { bondsState, IBondState } from "./atoms/BondsState"
import { businessesState, IBusinessState } from "./atoms/BusinessesState"
import { customAssetsState, ICustomAssetState } from "./atoms/CustomAssets"
import { debenturesState, IDebentureState } from "./atoms/DebenturesState"
import { dematAccountsState, IDematAccountState } from "./atoms/DematAccountsState"
import { digitalAssetsState, IDigitalAssetState } from "./atoms/DigitalAssetsState"
import { educationLoansState, IEducationLoanState } from "./atoms/EducationsLoanState"
import { escopsState, IEscopState } from "./atoms/EscopsState"
import { fixedDepositsState, IFixedDepositState } from "./atoms/FixedDepositState"
import { homeLoansState, IHomeLoanState } from "./atoms/HomeLoansState"
import { IInsurancePolicyState, insurancePoliciesState } from "./atoms/InsurancePoliciesState"
import { IIntellectualPropertyState, intellectualPropertiesState } from "./atoms/IntellectualPropertiesState"
import { IJewelleryState, jewelleriesState } from "./atoms/JewelleriesState"
import { IMutualFundState, mutualFundsState } from "./atoms/MutualFundsState"
import { IPensionAccountState, pensionAccountsState } from "./atoms/PensionAccountsState"
import { personalDetailsState } from "./atoms/PersonalDetailsState"
import { IPersonalLoanState, personalLoansState } from "./atoms/PersonalLoansState"
import { IPropertiesState, propertiesState } from "./atoms/PropertiesState"
import { IProvidentFundState, providentFundsState } from "./atoms/ProvidentFundsState"
import { getRouteDataFromSelectedAssets, routesState } from "./atoms/RouteState"
import { ISafetyDepositBoxState, safetyDepositBoxesState } from "./atoms/SafetyDepositBoxesState"
import { ISelectedAssetsState, selectedAssetsState } from "./atoms/SelectedAssetsState"
import { userState } from "./atoms/UserDetailsState"
import { bankDetailsValidationState, emptyBankAccountValidationState } from "./atoms/validationStates/BankDetailsValidationState"
import { bondsValidationState, emptyBondValidationState } from "./atoms/validationStates/BondDetailsValidationState"
import { businessesValidationState, emptyBusinessesValidationState } from "./atoms/validationStates/BusinessesValidationState"
import { customAssetsValidationState, emptyCustomAssetValidationState } from "./atoms/validationStates/CustomAssetsValidationState"
import { debenturesValidationState, emptyDebentureValidationState } from "./atoms/validationStates/DebentureValidationState"
import { dematAccountValidationState, emptyDematAccountsValidationState } from "./atoms/validationStates/DematAccountValidationState"
import { digitalAssetsValidationState, emptyDigitalAssetValidationState } from "./atoms/validationStates/DigitalAssetValidationState"
import { educationLoanValidationState, emptyEducationLoanValidationState } from "./atoms/validationStates/EducationLoanValidationState"
import { emptyEscopValidationState, escopsValidationState } from "./atoms/validationStates/EscopsDetailsValidationState"
import { emptyFixedDepositsValidationState, fixedDepositsValidationState } from "./atoms/validationStates/FixedDepositValidationState"
import { emptyHomeLoanValidationState, homeLoanValidationState } from "./atoms/validationStates/HomeLoanValidationState"
import { emptyInsurancePoliciesValidationState, insurancePoliciesValidationState } from "./atoms/validationStates/InsurancePoliciesValidationState"
import { emptyIntellectualPropertyValidationState, intellectualPropertyValidationState } from "./atoms/validationStates/IntellectualPropertiesValidationState"
import { emptyJewelleryValidationState, jewelleriesValidationState } from "./atoms/validationStates/JewelleriesValidationState"
import { emptyMutualFundsValidationState, mutualFundValidationState } from "./atoms/validationStates/MutualFundsValidationState"
import { emptyPensionAccountValidationState, pensionAccountValidationState } from "./atoms/validationStates/PensionAccountValidationState"
import { emptyPersonalLoanValidationState, personalLoanValidationState } from "./atoms/validationStates/PersonalLoanValidationState"
import { emptyPropertyValidationState, propertiesValidationState } from "./atoms/validationStates/PropertiesValidationState"
import { emptyProvidentFundValidationState, providentFundValidationState } from "./atoms/validationStates/ProvidentValidationState"
import { emptySafetyDepositBoxesValidationState, safetyDepositBoxesValidationState } from "./atoms/validationStates/SafetyDepositBoxesValidationState"
import { emptyVehicleloanValidationState, vehicleLoanValdationState } from "./atoms/validationStates/VehicleLoanValidationState"
import { emptyVehicleValidationState, vehiclesValidationState } from "./atoms/validationStates/VehicleValidationState"
import { IVehicleLoanState, vehicleLoansState } from "./atoms/VehicleLoansState"
import { IVehicleState, vehiclesState } from "./atoms/VehiclesState"
import Header from "./components/Header"
import { ASSET_SUBTYPES } from "./constants"
import YourWill from "./pages/YourWill"


function App() {
  const setUser = useSetRecoilState(userState);
  const setPersonalDetails = useSetRecoilState(personalDetailsState);
  const setAddressDetails = useSetRecoilState(addressDetailsState);
  const setSelectedAssets = useSetRecoilState(selectedAssetsState);

  // PROPERTIES
  const setProperties = useSetRecoilState(propertiesState);
  const setPropertiesValidationState = useSetRecoilState(propertiesValidationState);

  // BANK ACCOUNTS
  const setBankAccounts = useSetRecoilState(bankDetailsState);
  const setBankAccountsValidationState = useSetRecoilState(bankDetailsValidationState);

  // FIXED DEPOSITS
  const setFixedDeposits = useSetRecoilState(fixedDepositsState);
  const setFixedDepositsValidationState = useSetRecoilState(fixedDepositsValidationState);

  // INSURANCE POLICIES
  const setInsurancePolicies = useSetRecoilState(insurancePoliciesState);
  const setInsurancePoliciesValidationState = useSetRecoilState(insurancePoliciesValidationState);

  // SAFETY DEPOSIT BOXES
  const setSafetyDepositBoxes = useSetRecoilState(safetyDepositBoxesState);
  const setSafetyDepositBoxesValidationState = useSetRecoilState(safetyDepositBoxesValidationState);

  // DEMAT ACCOUNTS
  const setDematAccounts = useSetRecoilState(dematAccountsState);
  const setDematAccountsValidationState = useSetRecoilState(dematAccountValidationState);

  // MUTUAL FUNDS
  const setMutualFunds = useSetRecoilState(mutualFundsState);
  const setMutualFundsValidationState = useSetRecoilState(mutualFundValidationState);

  // PROVIDENT FUNDS
  const setProvidentFunds = useSetRecoilState(providentFundsState);
  const setProvidentFundsValidationState = useSetRecoilState(providentFundValidationState);

  // PROVIDENT FUNDS
  const setPensionAccounts = useSetRecoilState(pensionAccountsState);
  const setPensionAccountsValidationState = useSetRecoilState(pensionAccountValidationState);

  // BUSINESSES 
  const setBusinessses = useSetRecoilState(businessesState);
  const setBusinesssesValidationState = useSetRecoilState(businessesValidationState);

  // BONDS 
  const setBonds = useSetRecoilState(bondsState);
  const setBondsValidationState = useSetRecoilState(bondsValidationState);

  // DEBENTURES 
  const setDebentures = useSetRecoilState(debenturesState);
  const setDebenturesValidationState = useSetRecoilState(debenturesValidationState);

  // ESCOPS 
  const setEscops = useSetRecoilState(escopsState);
  const setEscopsValidationState = useSetRecoilState(escopsValidationState);

  // JEWELLERIES 
  const setJewelleries = useSetRecoilState(jewelleriesState);
  const setJewelleriesValidationState = useSetRecoilState(jewelleriesValidationState);

  // VEHICLES 
  const setVehicles = useSetRecoilState(vehiclesState);
  const setVehiclesValidationState = useSetRecoilState(vehiclesValidationState);

  // DIGITAL ASSETS 
  const setDigitalAssets = useSetRecoilState(digitalAssetsState);
  const setDigitalAssetsValidationState = useSetRecoilState(digitalAssetsValidationState);

  // INTELLECTUAL PROPERTIES 
  const setIntellectualProperties = useSetRecoilState(intellectualPropertiesState);
  const setIntellectualPropertiesValidationState = useSetRecoilState(intellectualPropertyValidationState);

  // CUSTOM ASSETS
  const setCustomAssets = useSetRecoilState(customAssetsState);
  const setCustomAssetsValidationState = useSetRecoilState(customAssetsValidationState);

  // HOME LOANS
  const setHomeLoans = useSetRecoilState(homeLoansState);
  const setHomeLoansValidationState = useSetRecoilState(homeLoanValidationState);

  // PERSONAL LOANS
  const setPersonalLoans = useSetRecoilState(personalLoansState);
  const setPersonalLoansValidationState = useSetRecoilState(personalLoanValidationState);

  // VEHICLE LOANS
  const setVehicleLoans = useSetRecoilState(vehicleLoansState);
  const setVehicleLoansValidationState = useSetRecoilState(vehicleLoanValdationState);

  // EDUCATION LOANS
  const setEducationLoans = useSetRecoilState(educationLoansState);
  const setEducationLoansValidationState = useSetRecoilState(educationLoanValidationState);

  const setRouteState = useSetRecoilState(routesState);

  useEffect(() => {
    getUserAndSetState();
  }, [])

  const getUserAndSetState = async () => {
    const user = await getUser("9876543211");

    setUser({
      userId: user.userId
    })

    setPersonalDetails(user.personalDetails);
    setAddressDetails(user.addressDetails);

    if (user.selectedAssets) {
      setSelectedAssets(user.selectedAssets);
    }

    if (user.assets) {
      // SET PROPERTIES
      var properties: IPropertiesState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.PROPERTIES).map((s) => ({ ...s.data, id: s.id }));
      if (properties.length > 0) {
        setProperties(properties)
        setPropertiesValidationState(properties.map(_ => ({ ...emptyPropertyValidationState })))
      }

      // SET BANK ACCOUNTS
      var bankAccounts: IBankDetailsState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.BANK_ACCOUNTS).map((s) => ({ ...s.data, id: s.id }));
      if (bankAccounts.length > 0) {
        setBankAccounts(bankAccounts)
        setBankAccountsValidationState(bankAccounts.map(_ => ({ ...emptyBankAccountValidationState })))
      }

      // SET BANK ACCOUNTS
      var fixedDeposits: IFixedDepositState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.FIXED_DEPOSITS).map((s) => ({ ...s.data, id: s.id }));
      if (fixedDeposits.length > 0) {
        setFixedDeposits(fixedDeposits)
        setFixedDepositsValidationState(fixedDeposits.map(_ => ({ ...emptyFixedDepositsValidationState })))
      }

      // SET INSURANCE POLICIES
      var insurancePolicies: IInsurancePolicyState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.INSURANCE_POLICIES).map((s) => ({ ...s.data, id: s.id }));
      if (insurancePolicies.length > 0) {
        setInsurancePolicies(insurancePolicies)
        setInsurancePoliciesValidationState(insurancePolicies.map(_ => ({ ...emptyInsurancePoliciesValidationState })))
      }

      // SET SAFETY DEPOSIT BOXES
      var safetyBoxes: ISafetyDepositBoxState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.SAFETY_DEPOSIT_BOXES).map((s) => ({ ...s.data, id: s.id }));
      if (safetyBoxes.length > 0) {
        setSafetyDepositBoxes(safetyBoxes)
        setSafetyDepositBoxesValidationState(safetyBoxes.map(_ => ({ ...emptySafetyDepositBoxesValidationState })))
      }

      // SET DEMAT ACCOUNTS
      var dematAccounts: IDematAccountState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.DEMAT_ACCOUNTS).map((s) => ({ ...s.data, id: s.id }));
      if (dematAccounts.length > 0) {
        setDematAccounts(dematAccounts)
        setDematAccountsValidationState(dematAccounts.map(_ => ({ ...emptyDematAccountsValidationState })))
      }

      // SET MUTUAL FUNDS
      var mutualFunds: IMutualFundState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.MUTUAL_FUNDS).map((s) => ({ ...s.data, id: s.id }));
      if (mutualFunds.length > 0) {
        setMutualFunds(mutualFunds)
        setMutualFundsValidationState(mutualFunds.map(_ => ({ ...emptyMutualFundsValidationState })))
      }

      // SET MUTUAL FUNDS
      var providentFunds: IProvidentFundState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.PROVIDENT_FUNDS).map((s) => ({ ...s.data, id: s.id }));
      if (providentFunds.length > 0) {
        setProvidentFunds(providentFunds)
        setProvidentFundsValidationState(providentFunds.map(_ => ({ ...emptyProvidentFundValidationState })))
      }

      // SET MUTUAL FUNDS
      var pensionAccounts: IPensionAccountState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.PENSION_ACCOUNTS).map((s) => ({ ...s.data, id: s.id }));
      if (pensionAccounts.length > 0) {
        setPensionAccounts(pensionAccounts)
        setPensionAccountsValidationState(pensionAccounts.map(_ => ({ ...emptyPensionAccountValidationState })))
      }

      // SET BUSINESSES
      var businesses: IBusinessState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.BUSINESSES).map((s) => ({ ...s.data, id: s.id }));
      if (businesses.length > 0) {
        setBusinessses(businesses)
        setBusinesssesValidationState(businesses.map(_ => ({ ...emptyBusinessesValidationState })))
      }

      // SET BONDS
      var bonds: IBondState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.BONDS).map((s) => ({ ...s.data, id: s.id }));
      if (bonds.length > 0) {
        setBonds(bonds)
        setBondsValidationState(bonds.map(_ => ({ ...emptyBondValidationState })))
      }

      // SET DEBENTURES
      var debentures: IDebentureState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.DEBENTURES).map((s) => ({ ...s.data, id: s.id }));
      if (debentures.length > 0) {
        setDebentures(debentures)
        setDebenturesValidationState(debentures.map(_ => ({ ...emptyDebentureValidationState })))
      }

      // SET ESCOPS
      var escops: IEscopState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.ESCOPS).map((s) => ({ ...s.data, id: s.id }));
      if (escops.length > 0) {
        setEscops(escops)
        setEscopsValidationState(escops.map(_ => ({ ...emptyEscopValidationState })))
      }

      // SET VEHICLES
      var vehicles: IVehicleState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.VEHICLES).map((s) => ({ ...s.data, id: s.id }));
      if (vehicles.length > 0) {
        setVehicles(vehicles)
        setVehiclesValidationState(vehicles.map(_ => ({ ...emptyVehicleValidationState })))
      }

      // SET JEWELLERIES
      var jewelleries: IJewelleryState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.JEWELLERIES).map((s) => ({ ...s.data, id: s.id }));
      if (jewelleries.length > 0) {
        setJewelleries(jewelleries)
        setJewelleriesValidationState(jewelleries.map(_ => ({ ...emptyJewelleryValidationState })))
      }

      // SET DIGITAL ASSETS
      var digitalAssets: IDigitalAssetState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.DIGITAL_ASSETS).map((s) => ({ ...s.data, id: s.id }));
      if (digitalAssets.length > 0) {
        setDigitalAssets(digitalAssets)
        setDigitalAssetsValidationState(digitalAssets.map(_ => ({ ...emptyDigitalAssetValidationState })))
      }

      // SET INTELLECTUAL PROPERTIES
      var intellectualProperties: IIntellectualPropertyState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.INTELLECTUAL_PROPERTY).map((s) => ({ ...s.data, id: s.id }));
      if (intellectualProperties.length > 0) {
        setIntellectualProperties(intellectualProperties)
        setIntellectualPropertiesValidationState(intellectualProperties.map(_ => ({ ...emptyIntellectualPropertyValidationState })))
      }

      // SET CUSTOM ASSETS
      var customAssets: ICustomAssetState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.CUSTOM_ASSETS).map((s) => ({ ...s.data, id: s.id }));
      if (customAssets.length > 0) {
        setCustomAssets(customAssets)
        setCustomAssetsValidationState(customAssets.map(_ => ({ ...emptyCustomAssetValidationState })))
      }

      // SET HOME LOANS
      var homeLoans: IHomeLoanState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.HOME_LOAN).map((s) => ({ ...s.data, id: s.id }));
      if (homeLoans.length > 0) {
        setHomeLoans(homeLoans)
        setHomeLoansValidationState(customAssets.map(_ => ({ ...emptyHomeLoanValidationState })))
      }

      // SET PERSONAL LOANS
      var personalLoans: IPersonalLoanState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.PERSONAL_LOAN).map((s) => ({ ...s.data, id: s.id }));
      if (personalLoans.length > 0) {
        setPersonalLoans(personalLoans)
        setPersonalLoansValidationState(customAssets.map(_ => ({ ...emptyPersonalLoanValidationState })))
      }

      // SET VEHICLE LOANS
      var vehcileLoans: IVehicleLoanState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.VECHICLE_LOAN).map((s) => ({ ...s.data, id: s.id }));
      if (vehcileLoans.length > 0) {
        setVehicleLoans(vehcileLoans)
        setVehicleLoansValidationState(customAssets.map(_ => ({ ...emptyVehicleloanValidationState })))
      }

      // SET EDUCATION LOANS
      var educationLoans: IEducationLoanState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.EDUCATION_LOAN).map((s) => ({ ...s.data, id: s.id }));
      if (educationLoans.length > 0) {
        setEducationLoans(educationLoans)
        setEducationLoansValidationState(customAssets.map(_ => ({ ...emptyEducationLoanValidationState })))
      }
    }

    // DYNAMIC ROUTE MAPPING
    generateRouteDataFromSelectedAssets(user.selectedAssets);
  }

  const generateRouteDataFromSelectedAssets = (selectedAssets: ISelectedAssetsState) => {
    const routeData = getRouteDataFromSelectedAssets(selectedAssets)
    setRouteState(routeData);
  }

  return (
    <div className="font-[frank] w-full">
      <Header />
      <YourWill />
    </div>
  )
}

export default App
