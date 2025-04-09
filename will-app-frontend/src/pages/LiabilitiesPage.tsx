import CustomAccordion from '../components/CustomAccordion'
import CheckboxContainer from '../components/CheckboxContainer'
import NextButton from '../components/NextButton'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ISelectedAssetsState, selectedAssetsState } from '../atoms/SelectedAssetsState';
import { useState } from 'react';
import { addSelectedAssetsAsync } from '../api/asset';
import { userState } from '../atoms/UserDetailsState';
import { getRouteDataFromSelectedAssets, routesState } from '../atoms/RouteState';
import { useNavigate } from 'react-router';
import { ASSET_TYPES, ROUTE_PATHS } from '../constants';
import Swal from 'sweetalert2';
import { homeLoansState, IHomeLoanState } from '../atoms/HomeLoansState';
import { IPersonalLoanState, personalLoansState } from '../atoms/PersonalLoansState';
import { IVehicleLoanState, vehicleLoansState } from '../atoms/VehicleLoansState';
import { educationLoansState, IEducationLoanState } from '../atoms/EducationsLoanState';
import { IOtherLiabilityState, otherLiabilitiesState } from '../atoms/OtherLiabilitiesState';

const LiabilitiesPage = () => {
    const [selectedAssets, setSelectedAssets] = useRecoilState(selectedAssetsState);
    const [loading, setLoading] = useState<boolean>(false);
    const user = useRecoilValue(userState);
    const setRouteState = useSetRecoilState(routesState);
    const navigate = useNavigate();
    const homeLoanState = useRecoilValue<IHomeLoanState[]>(homeLoansState);
    const personalLoanState = useRecoilValue<IPersonalLoanState[]>(personalLoansState);
    const vehicleLoanState = useRecoilValue<IVehicleLoanState[]>(vehicleLoansState);
    const educationLoanState = useRecoilValue<IEducationLoanState[]>(educationLoansState);
    const otherLiablitiesState = useRecoilValue<IOtherLiabilityState[]>(otherLiabilitiesState);

    const handleChange = (key: keyof ISelectedAssetsState) => {
        setSelectedAssets((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    }

    const handleOnClick = async () => {
        setLoading(true);
        const result = await addSelectedAssetsAsync(selectedAssets, user.userId);
        setLoading(false);

        const routeData = getRouteDataFromSelectedAssets(selectedAssets);
        setRouteState(routeData);

        if (result.bankAccounts === selectedAssets.bankAccounts) {
            navigate(ROUTE_PATHS.YOUR_WILL + (routeData.find(s => s.type === ASSET_TYPES.LIABILITIES)?.currentPath ?? ROUTE_PATHS.BENEFICIARIES));
        }

        var liabilityPath = routeData.find(s => s.type === ASSET_TYPES.LIABILITIES)?.currentPath;

        if (!liabilityPath) {
            Swal.fire({
                title: "Are you sure Proceed to Beneficiaries",
                text: "Ready to move to Beneficiaries Section? Click No to add more Liabilities",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "var(--color-will-green)",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, go to Beneficiaries",
                cancelButtonText: "No",
                customClass: {
                    popup: "swal-sm",
                    title: "swal-title",
                    confirmButton: "swal-confirm-btn",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.BENEFICIARIES);
                }
                else {
                    navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.LIABILITIES)
                }
            });
        } else {
            navigate(ROUTE_PATHS.YOUR_WILL + liabilityPath);
        }

    }

    return (
        <div className="w-xl h-full">
            <div>
                <CustomAccordion defaultExpanded label="Liabilities">
                    <div className="flex flex-col gap-2">
                        <CheckboxContainer disabled={homeLoanState.filter(s=>s.id != "").length > 0} checked={selectedAssets?.homeLoans ?? false} label="Home Loans" onChange={() => handleChange("homeLoans")} />
                        <CheckboxContainer disabled={personalLoanState.filter(s=>s.id != "").length > 0} checked={selectedAssets?.personalLoans ?? false} label="Personal Loans" onChange={() => handleChange("personalLoans")} />
                        <CheckboxContainer disabled={vehicleLoanState.filter(s=>s.id != "").length > 0} checked={selectedAssets?.vehicleLoans ?? false} label="Vehicle Loans" onChange={() => handleChange("vehicleLoans")} />
                        <CheckboxContainer disabled={educationLoanState.filter(s=>s.id != "").length > 0} checked={selectedAssets?.educationLoans ?? false} label="Education Loans" onChange={() => handleChange("educationLoans")} />
                        <CheckboxContainer disabled={otherLiablitiesState.filter(s=>s.id != "").length > 0} checked={selectedAssets?.otherLiabilities ?? false} label="Other Liabilities" onChange={() => handleChange("otherLiabilities")} />
                    </div>
                </CustomAccordion>
            </div>
            <NextButton loading={loading} onClick={handleOnClick} />
        </div>
    )
}

export default LiabilitiesPage