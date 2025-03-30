import { useRecoilState, useRecoilValue } from "recoil";
import { willDistributionState, IWillDistributionState } from "../atoms/WillDistributionState";
import CustomSelectBar from "../components/CustomSelectBar";
import NextButton from "../components/NextButton";
import { routesState } from "../atoms/RouteState";
import { useLocation, useNavigate } from "react-router";
import { upsertWillDistribution } from "../api/assetDistribution";
import { userState } from '../atoms/UserDetailsState';
import { ROUTE_PATHS } from "../constants";
import Swal from "sweetalert2";
import { AssetDistributionPercentState } from "../atoms/AssetDistributionPercentState";
import { AssetDistributionSingleState } from "../atoms/AssetDistributionSingleState";
import { AssetDistributionSpecificState } from "../atoms/AssetDistributionSpecificState";

const AssetDistributionSelectionPage = () => {
    const [distribution, setDistribution] = useRecoilState(willDistributionState);
    const [_, setAssetDistributionPercent] = useRecoilState(AssetDistributionPercentState);
    const [__, setAssetDistributionSingle] = useRecoilState(AssetDistributionSingleState);
    const [___, setAssetDistributionSpecific] = useRecoilState(AssetDistributionSpecificState);
    const routeState = useRecoilValue(routesState);
    const navigate = useNavigate();
    const location = useLocation();
    const user = useRecoilValue(userState);

    const options = [
        { value: "Single", label: "Leave everything to a single beneficiary" },
        { value: "Specific", label: "Assign certain assets to certain beneficiaries and divide the rest" },
        { value: "Percentage", label: "Divide my assets by percentage among the beneficiaries" },
    ];

    // Handle Distribution Type Change
    const handleSelectChange = (value: string) => {
        if (value !== null && value !== distribution.distributionType) {
            Swal.fire({
                title: "Confirm Edit",
                text: "Are you sure you want to change the distribution type?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "var(--color-will-green)",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                customClass: {
                    popup: "swal-sm",
                    title: "swal-title",
                    confirmButton: "swal-confirm-btn",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    if (["Single", "Specific", "Percentage"].includes(value)) {
                        setDistribution((prevState) => ({
                            ...prevState,
                            distributionType: value as "Single" | "Specific" | "Percentage"
                        }));
                    }
                }
            });
        }
    };

    // Save Will Distribution Data
    const saveWillDistributionAsync = async (will: IWillDistributionState) => {
        const data = {
            userId: user.userId,
            id: will.id,
            distributionType: will.distributionType,
            residuaryDistributionType: will.residuaryDistributionType,
            fallbackRule: will.fallbackRule
        };

        const upsertedWillDistribution = await upsertWillDistribution(data);

        setDistribution((prevState) => ({
            ...prevState,
            id: upsertedWillDistribution.id
        }));
    };

    // Handle Next Button Click
    const handleNextClick = async () => {
        if (!distribution.distributionType) {
            Swal.fire({
                      title: "Select Distribution Type",
                      text: "Please select a distribution type before proceeding.",
                      icon: "warning",
                      confirmButtonColor: "var(--color-will-green)",
                      customClass: {
                        popup: "swal-sm",
                        title: "swal-title",
                        confirmButton: "swal-confirm-btn",
                      },
                    });
            return;
        }

        await saveWillDistributionAsync(distribution);

        const routeValue = routeState.find(s => s.currentPath === location.pathname);

        if (distribution.distributionType == "Single")
        {
            setAssetDistributionSingle((prev) => ({
                ...prev,
                step: 1
              }));
            navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.ASSET_DISTRIBUTION_SINGLE);
        }
         else if (distribution.distributionType == "Percentage")
        {
            setAssetDistributionPercent((prev) => ({
                ...prev,
                step: 1
              }));
            navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.ASSET_DISTRIBUTION_PERCENT);
        }
        else if (distribution.distributionType == "Specific")
        {
            setAssetDistributionSpecific((prev) => ({
                ...prev,
                step: 1
              }));
            navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.ASSET_DISTRIBUTION_SPECIFIC);
            
        }
        else
            navigate(routeValue?.nextPath ?? "/");
    };

    return (
        <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] 
        md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
            <h2 className="text-xl font-bold mb-5">Select Distribution Method</h2>
            <CustomSelectBar
                options={options}
                onSelectChange={handleSelectChange}
                multiple={false}
                selectedOptions={[distribution.distributionType]}
            />
            <div className="justify-between flex mt-10">
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    );
};

export default AssetDistributionSelectionPage;