import { useRecoilState, useRecoilValue } from "recoil";
import { willDistributionState, IWillDistributionState } from "../atoms/WillDistributionState";
import CustomSelectBar from "../components/CustomSelectBar";
import NextButton from "../components/NextButton";
import { routesState } from "../atoms/RouteState";
import { useLocation, useNavigate } from "react-router";
import { upsertWillDistribution } from "../api/assetDistribution";
import { userState } from '../atoms/UserDetailsState';

const AssetDistributionSelectionPage = () => {
    const [distribution, setDistribution] = useRecoilState(willDistributionState);
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
        if (["Single", "Specific", "Percentage"].includes(value)) {
            setDistribution((prevState) => ({
                ...prevState,
                distributionType: value as "Single" | "Specific" | "Percentage",
                residuaryDistributionType: value as "Single" | "Percentage",
            }));
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
            alert("Please select a distribution type before proceeding.");
            return;
        }

        await saveWillDistributionAsync(distribution);

        const routeValue = routeState.find(s => s.currentPath === location.pathname);
        navigate(routeValue?.nextPath ?? "/");
    };

    return (
        <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
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