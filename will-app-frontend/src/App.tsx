import YourWill from "./pages/YourWill"
import { useEffect } from "react"
import { getUser } from "./api/user"
import { useSetRecoilState } from "recoil"
import { userState } from "./atoms/UserDetailsState"
import { personalDetailsState } from "./atoms/PersonalDetailsState"
import { addressDetailsState } from "./atoms/AddressDetailsState"
import { assetRoutesMap, ISelectedAssetsState, selectedAssetsState } from "./atoms/SelectedAssetsState"
import { routesState } from "./atoms/RouteState"
import { IPropertiesState, propertiesState } from "./atoms/PropertiesState"
import { ASSET_SUBTYPES } from "./constants"
import { emptyPropertyValidationState, propertiesValidationState } from "./atoms/validationStates/PropertiesValidationState"
import Header from "./components/Header"
import { bankDetailsState, IBankDetailsState } from "./atoms/BankDetailsState"
import { bankDetailsValidationState, emptyBankAccountValidationState } from "./atoms/validationStates/BankDetailsValidationState"
import { fixedDepositsState, IFixedDepositState } from "./atoms/FixedDepositState"
import { emptyFixedDepositsValidationState, fixedDepositsValidationState } from "./atoms/validationStates/FixedDepositValidationState"
import { IInsurancePolicyState, insurancePoliciesState } from "./atoms/InsurancePoliciesState"
import { emptyInsurancePoliciesValidationState, insurancePoliciesValidationState } from "./atoms/validationStates/InsurancePoliciesValidationState"
import { ISafetyDepositBoxState, safetyDepositBoxesState } from "./atoms/SafetyDepositBoxesState"
import { emptySafetyDepositBoxesValidationState, safetyDepositBoxesValidationState } from "./atoms/validationStates/SafetyDepositBoxesValidationState"
import { dematAccountsState, IDematAccountState } from "./atoms/DematAccountsState"
import { dematAccountValidationState, emptyDematAccountsValidationState } from "./atoms/validationStates/DematAccountValidationState"
import { IMutualFundState, mutualFundsState } from "./atoms/MutualFundsState"
import { emptyMutualFundsValidationState, mutualFundValidationState } from "./atoms/validationStates/MutualFundsValidationState"


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
        setPropertiesValidationState(properties.map(_ => ({...emptyPropertyValidationState})))
      }

      // SET BANK ACCOUNTS
      var bankAccounts: IBankDetailsState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.BANK_ACCOUNTS).map((s) => ({ ...s.data, id: s.id }));
      if (bankAccounts.length > 0) {
        setBankAccounts(bankAccounts)
        setBankAccountsValidationState(bankAccounts.map(_ => ({...emptyBankAccountValidationState})))
      }

      // SET BANK ACCOUNTS
      var fixedDeposits: IFixedDepositState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.FIXED_DEPOSITS).map((s) => ({ ...s.data, id: s.id }));
      if (fixedDeposits.length > 0) {
        setFixedDeposits(fixedDeposits)
        setFixedDepositsValidationState(properties.map(_ => ({...emptyFixedDepositsValidationState})))
      }

      // SET INSURANCE POLICIES
      var insurancePolicies: IInsurancePolicyState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.INSURANCE_POLICIES).map((s) => ({ ...s.data, id: s.id }));
      if (insurancePolicies.length > 0) {
        setInsurancePolicies(insurancePolicies)
        setInsurancePoliciesValidationState(properties.map(_ => ({...emptyInsurancePoliciesValidationState})))
      }

      // SET SAFETY DEPOSIT BOXES
      var safetyBoxes: ISafetyDepositBoxState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.SAFETY_DEPOSIT_BOXES).map((s) => ({ ...s.data, id: s.id }));
      if (safetyBoxes.length > 0) {
        setSafetyDepositBoxes(safetyBoxes)
        setSafetyDepositBoxesValidationState(properties.map(_ => ({...emptySafetyDepositBoxesValidationState})))
      }

      // SET DEMAT ACCOUNTS
      var dematAccounts: IDematAccountState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.DEMAT_ACCOUNTS).map((s) => ({ ...s.data, id: s.id }));
      if (dematAccounts.length > 0) {
        setDematAccounts(dematAccounts)
        setDematAccountsValidationState(properties.map(_ => ({...emptyDematAccountsValidationState})))
      }

      // SET MUTUAL FUNDS
      var mutualFunds: IMutualFundState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.MUTUAL_FUNDS).map((s) => ({ ...s.data, id: s.id }));
      if (mutualFunds.length > 0) {
        setMutualFunds(mutualFunds)
        setMutualFundsValidationState(properties.map(_ => ({...emptyMutualFundsValidationState})))
      }
    }

    // DYNAMIC ROUTE MAPPING
    generateRouteDataFromSelectedAssets(user.selectedAssets);
  }

  const generateRouteDataFromSelectedAssets = (selectedAssets: ISelectedAssetsState) => {
    const selectedKeys = Object.entries(selectedAssets)
      .filter(([_, value]) => value === true)
      .map(([key]) => key as keyof ISelectedAssetsState)

    const selectedPaths = selectedKeys.map((key) => assetRoutesMap[key]).sort((a, b) => a.order - b.order);

    const routeData = selectedPaths.map((path, index) => ({
      currentPath: path.routePath,
      nextPath: selectedPaths[index + 1]?.routePath || "/", // Last route leads to summary
    }));

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
