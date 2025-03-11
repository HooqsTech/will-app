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

const LiabilitiesPage = () => {
    const [selectedAssets, setSelectedAssets] = useRecoilState(selectedAssetsState);
    const [loading, setLoading] = useState<boolean>(false);
    const user = useRecoilValue(userState);
    const setRouteState = useSetRecoilState(routesState);
    const navigate = useNavigate();

    const handleChange = (key: keyof ISelectedAssetsState) => {
        setSelectedAssets((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    }

    const handleOnClick = async () => {
        // SAVE PERSONAL DETAILS
        setLoading(true);
        const result = await addSelectedAssetsAsync(selectedAssets, user.userId);
        setLoading(false);

        const routeData = getRouteDataFromSelectedAssets(selectedAssets);
        setRouteState(routeData);

        // NAVIGATE TO ADDRESS DETAILS
        if (result.bankAccounts === selectedAssets.bankAccounts) {
            navigate(ROUTE_PATHS.YOUR_WILL + (routeData.find(s => s.type === ASSET_TYPES.LIABILITIES)?.currentPath ?? ""));
        }
    }

    return (
        <div className="w-xl h-full">
            <div>
                <CustomAccordion defaultExpanded label="Liabilities">
                    <div className="flex flex-col gap-2">
                        <CheckboxContainer checked={selectedAssets?.homeLoans ?? false} label="Home Loans" onChange={() => handleChange("homeLoans")} />
                        <CheckboxContainer checked={selectedAssets?.personalLoans ?? false} label="Personal Loans" onChange={() => handleChange("personalLoans")} />
                        <CheckboxContainer checked={selectedAssets?.vehicleLoans ?? false} label="Vehicle Loans" onChange={() => handleChange("vehicleLoans")} />
                        <CheckboxContainer checked={selectedAssets?.educationLoans ?? false} label="Education Loans" onChange={() => handleChange("educationLoans")} />
                        <CheckboxContainer checked={selectedAssets?.otherLiabilities ?? false} label="Other Liabilities" onChange={() => handleChange("otherLiabilities")} />
                    </div>
                </CustomAccordion>
            </div>
            <NextButton loading={loading} onClick={handleOnClick} />
        </div>
    )
}

export default LiabilitiesPage