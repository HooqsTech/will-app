import { useRecoilState } from "recoil"
import { currentStepper } from "../atoms/StepperState"
import { useNavigate } from "react-router";

interface IStepperItem {
    title: string;
    route: string;
}

const Stepper = () => {
    const [stepperState, _] = useRecoilState(currentStepper);
    const navigate = useNavigate();
    const stepperItems: IStepperItem[] = [
        {
            title: "Basic Details",
            route: ""
        },
        {
            title: "Asset Details",
            route: "asset-details"
        }
    ]
    return (
        <div className="p-10">
            <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-xs sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                {
                    stepperItems.map(item => (
                        <button key={item.title} onClick={() => {
                            navigate(`/${item.route}`)
                        }} className={`flex items-center ${item.title === stepperState && "text-blue-600"} `}>
                            <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border ${item.title === stepperState ? "border-blue-600" : "border-gray-500"}  rounded-full shrink-0 `}>
                                1
                            </span>
                            {item.title}
                            <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 9 4-4-4-4M1 9l4-4-4-4" />
                            </svg>
                        </button>
                    ))
                }
            </ol>
        </div>
    )
}

export default Stepper