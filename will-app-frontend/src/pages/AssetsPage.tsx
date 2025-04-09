import { useState } from "react";
import { useNavigate } from "react-router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Swal from "sweetalert2";
import { addSelectedAssetsAsync } from "../api/asset";
import { getRouteDataFromSelectedAssets, routesState } from "../atoms/RouteState";
import { ISelectedAssetsState, selectedAssetsState } from "../atoms/SelectedAssetsState";
import { userState } from "../atoms/UserDetailsState";
import CheckboxContainer from "../components/CheckboxContainer";
import CustomAccordion from "../components/CustomAccordion";
import NextButton from "../components/NextButton";
import { ROUTE_PATHS } from "../constants";
import { IPropertiesState, propertiesState } from "../atoms/PropertiesState";
import { bankDetailsState, IBankDetailsState } from "../atoms/BankDetailsState";
import { fixedDepositsState, IFixedDepositState } from "../atoms/FixedDepositState";
import { IInsurancePolicyState, insurancePoliciesState } from "../atoms/InsurancePoliciesState";
import { ISafetyDepositBoxState, safetyDepositBoxesState } from "../atoms/SafetyDepositBoxesState";
import { dematAccountsState, IDematAccountState } from "../atoms/DematAccountsState";
import { IMutualFundState, mutualFundsState } from "../atoms/MutualFundsState";
import { IProvidentFundState, providentFundsState } from "../atoms/ProvidentFundsState";
import { IPensionAccountState, pensionAccountsState } from "../atoms/PensionAccountsState";
import { businessesState, IBusinessState } from "../atoms/BusinessesState";
import { bondsState, IBondState } from "../atoms/BondsState";
import { debenturesState, IDebentureState } from "../atoms/DebenturesState";
import { escopsState, IEscopState } from "../atoms/EscopsState";
import { IOtherInvestmentState, otherInvestmentState } from "../atoms/OtherInvestmentsState";
import { IJewelleryState, jewelleriesState } from "../atoms/JewelleriesState";
import { digitalAssetsState, IDigitalAssetState } from "../atoms/DigitalAssetsState";
import { IIntellectualPropertyState, intellectualPropertiesState } from "../atoms/IntellectualPropertiesState";
import { customAssetsState, ICustomAssetState } from "../atoms/CustomAssets";
import { IPetState, petsState } from "../atoms/petsState";
import { IVehicleState, vehiclesState } from "../atoms/VehiclesState";
import { artWorksState, IArtWorkState } from "../atoms/ArtWorksState";

const AssetsPage = () => {
    const [selectedAssets, setSelectedAssets] = useRecoilState(selectedAssetsState);
    const user = useRecoilValue(userState);
    const [loading, setLoading] = useState<boolean>(false);
    const setRouteState = useSetRecoilState(routesState);
    const navigate = useNavigate();

    const propertiesStateValue = useRecoilValue<IPropertiesState[]>(propertiesState);
    const bankDetailsStateValue = useRecoilValue<IBankDetailsState[]>(bankDetailsState);
    const fixedDepositsStateValue = useRecoilValue<IFixedDepositState[]>(fixedDepositsState);
    const insurancePoliciesStateValue = useRecoilValue<IInsurancePolicyState[]>(insurancePoliciesState);
    const safetyDepositBoxesStateValue = useRecoilValue<ISafetyDepositBoxState[]>(safetyDepositBoxesState);
    const dematAccountsStateValue = useRecoilValue<IDematAccountState[]>(dematAccountsState);
    const mutualFundsStateValue = useRecoilValue<IMutualFundState[]>(mutualFundsState);
    const providentFundsStateValue = useRecoilValue<IProvidentFundState[]>(providentFundsState);
    const pensionAccountsStateValue = useRecoilValue<IPensionAccountState[]>(pensionAccountsState);
    const businessesStateValue = useRecoilValue<IBusinessState[]>(businessesState);
    const bondsStateValue = useRecoilValue<IBondState[]>(bondsState);
    const debenturesStateValue = useRecoilValue<IDebentureState[]>(debenturesState);
    const escopsStateValue = useRecoilValue<IEscopState[]>(escopsState);
    const otherInvestmentStateValue = useRecoilValue<IOtherInvestmentState[]>(otherInvestmentState);
    const vehiclesStateValue = useRecoilValue<IVehicleState[]>(vehiclesState);
    const jewelleriesStateValue = useRecoilValue<IJewelleryState[]>(jewelleriesState);
    const digitalAssetsStateValue = useRecoilValue<IDigitalAssetState[]>(digitalAssetsState);
    const intellectualPropertiesStateValue = useRecoilValue<IIntellectualPropertyState[]>(intellectualPropertiesState);
    const customAssetsStateValue = useRecoilValue<ICustomAssetState[]>(customAssetsState);
    const petsStateValue = useRecoilValue<IPetState[]>(petsState);
    const artWorksStateValue = useRecoilValue<IArtWorkState[]>(artWorksState);


    const handleChange = (key: keyof ISelectedAssetsState) => {
        setSelectedAssets((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    }

    const validate = () => {
        const keysToIgnore = new Set<keyof ISelectedAssetsState>(["homeLoans", "personalLoans", "vehicleLoans", "educationLoans", "otherLiabilities"]);

        let isValid = Object.entries(selectedAssets)
            .filter(([key]) => !keysToIgnore.has(key as keyof ISelectedAssetsState))
            .some(([, value]) => value);

        if (isValid !== true) {
            return false;
        }
        return true;
    }

    const handleOnClick = async () => {
        if (!validate()) {
            return Swal.fire({
                title: "Please select at least one asset!",
                confirmButtonText: "Okay",
                confirmButtonColor: "var(--color-will-green)",
            });
        }

        // SAVE PERSONAL DETAILS
        setLoading(true);
        const result = await addSelectedAssetsAsync(selectedAssets, user.userId);
        setLoading(false);

        const routeData = getRouteDataFromSelectedAssets(selectedAssets);
        setRouteState(routeData);

        // NAVIGATE TO FIRST ASSET SUB PAGE
        if (result.bankAccounts === selectedAssets.bankAccounts) {
            navigate(ROUTE_PATHS.YOUR_WILL + routeData[0].currentPath);
        }
    }

    return (
        <div className="w-xl h-full">
            <div>
                <CustomAccordion defaultExpanded label="Immovable Assets">
                    <CheckboxContainer disabled={propertiesStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.properties} label="Properties" onChange={() => handleChange("properties")} />
                </CustomAccordion>
                <CustomAccordion defaultExpanded label="Financial Assets">
                    <div className="flex flex-col gap-2">
                        <CheckboxContainer disabled={bankDetailsStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.bankAccounts} label="Bank Accounts" onChange={() => handleChange("bankAccounts")} />
                        <CheckboxContainer disabled={fixedDepositsStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.fixedDeposits} label="Fixed Deposits" onChange={() => handleChange("fixedDeposits")} />
                        <CheckboxContainer disabled={insurancePoliciesStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.insurancePolicies} label="Insurance Policies" onChange={() => handleChange("insurancePolicies")} />
                        <CheckboxContainer disabled={safetyDepositBoxesStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.safetyDepositBoxes} label="Safety Deposit Boxes/Lockers" onChange={() => handleChange("safetyDepositBoxes")} />
                        <CheckboxContainer disabled={dematAccountsStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.dematAccounts} label="DEMAT accounts" onChange={() => handleChange("dematAccounts")} />
                        <CheckboxContainer disabled={mutualFundsStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.mutualFunds} label="Mutual Funds" onChange={() => handleChange("mutualFunds")} />
                        <CheckboxContainer disabled={providentFundsStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.providentFunds} label="Provident Funds" onChange={() => handleChange("providentFunds")} />
                        <CheckboxContainer disabled={pensionAccountsStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.pensionAccounts} label="Pension Accounts" onChange={() => handleChange("pensionAccounts")} />
                    </div>
                </CustomAccordion>
                <CustomAccordion defaultExpanded label="Business Assets">
                    <div className="flex flex-col gap-2">
                        <CheckboxContainer disabled={businessesStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.businesses} label="Businesses" onChange={() => handleChange("businesses")} />
                        <CheckboxContainer disabled={bondsStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.bonds} label="Bonds" onChange={() => handleChange("bonds")} />
                        <CheckboxContainer disabled={debenturesStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.debentures} label="Debentures" onChange={() => handleChange("debentures")} />
                        <CheckboxContainer disabled={escopsStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.esops} label="ESOPs" onChange={() => handleChange("esops")} />
                        <CheckboxContainer disabled={otherInvestmentStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.otherInvestments} label="Other investments" onChange={() => handleChange("otherInvestments")} />
                    </div>
                </CustomAccordion>
                <CustomAccordion defaultExpanded label="Other Assets">
                    <div className="flex flex-col gap-2">
                        <CheckboxContainer disabled={vehiclesStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.vehicles} label="Vehicles" onChange={() => handleChange("vehicles")} />
                        <CheckboxContainer disabled={jewelleriesStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.jewellery} label="Jewellery" onChange={() => handleChange("jewellery")} />
                        <CheckboxContainer disabled={digitalAssetsStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.digitalAssets} label="Digital Assets" onChange={() => handleChange("digitalAssets")} />
                        <CheckboxContainer disabled={intellectualPropertiesStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.intellectualProperties} label="Intellectual Properties" onChange={() => handleChange("intellectualProperties")} />
                        <CheckboxContainer disabled={customAssetsStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.customAssets} label="Custom Assets" onChange={() => handleChange("customAssets")} />
                        <CheckboxContainer disabled={petsStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.pets} label="Pets" onChange={() => handleChange("pets")} />
                        <CheckboxContainer disabled={artWorksStateValue.filter(s => s.id != "").length > 0} checked={selectedAssets?.artWorks} label="Art Works" onChange={() => handleChange("artWorks")} />
                    </div>
                </CustomAccordion>
            </div>
            <NextButton loading={loading} onClick={handleOnClick} />
        </div>
    )
}

export default AssetsPage