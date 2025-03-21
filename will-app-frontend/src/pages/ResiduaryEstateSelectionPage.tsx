import { useRecoilState, useRecoilValue } from "recoil";
import CustomSelectBar from "../components/CustomSelectBar";
import NextButton from "../components/NextButton";
import { routesState } from "../atoms/RouteState";
import { useLocation, useNavigate } from "react-router";
import { userState } from '../atoms/UserDetailsState';
import { DistributionState } from "../atoms/DistributionState";

const ResiduaryEstateSelectionPage = () => {
    const [distribution, setDistribution] = useRecoilState(DistributionState);
    const routeState = useRecoilValue(routesState);
    const navigate = useNavigate();
    const location = useLocation();
    const user = useRecoilValue(userState);

    const options = [
        { value: "Single", label: "Leave everything to a single beneficiary" },
        { value: "Percentage", label: "Divide my assets by percentage among the beneficiaries" },
    ];

    // Handle Distribution Type Change
    const handleSelectChange = (value: string) => {
        if (["Single", "Percentage"].includes(value)) {
            setDistribution(value);
        }
    };

    // Handle Next Button Click
    const handleNextClick = async () => {
        if (!distribution) {
            alert("Please select a distribution type before proceeding.");
            return;
        }
        const routeValue = routeState.find(s => s.currentPath === location.pathname);
        navigate(routeValue?.nextPath ?? "/");
    };

    return (
        <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
            <h1 className="text-xl font-bold mb-5">Residuary Estate</h1>
            <p className="text-xl font-medium mb-5">Don’t worry if you have forgotten to assign any assets. These unlisted assets will be automatically added to your Residuary Estate.</p>
            <p className="text-xl font-medium mb-5">Residuary Estate can include all assets that have not been specifically assigned to any particular beneficiaries. This also includes assets you may acquire after completing your Will.</p>
            <h2 className="text-xl font-bold mb-5">So, how would you like to distribute your residuary estate?</h2>
            <CustomSelectBar
                options={options}
                onSelectChange={handleSelectChange}
                multiple={false}
                selectedOptions={distribution ? [distribution] : []}
            />
            <div className="justify-between flex mt-10">
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    );
};

export default ResiduaryEstateSelectionPage;
