import { useNavigate } from "react-router";
import Header from "../components/Header";
import NextButton from "../components/NextButton";
import { ROUTE_PATHS } from "../constants";

const HomePage = () => {
    const navigate = useNavigate();
    const handleGetStartedClick = () => {
        navigate(ROUTE_PATHS.YOUR_WILL)
    }

    return (
        <div>
            <Header />
            {/* TOP CONTENT */}
            <div className="py-12">
                <div className="max-w-5xl m-auto py-6">
                    <div className="max-w-4xl m-auto pb-10">
                        <p className="text-4xl font-bold">Welcome</p>
                        <p className="text-slate-700 text-xl">Let's start your legacy planning today!</p>
                    </div>
                    <div className="bg-white shadow-xl grid items-center justify-between w-full grid-cols-4 p-10">
                        <div className="col-span-2 flex flex-col space-y-6">
                            <p className="text-4xl">
                                In just 20 minutes, you can safeguard your loved one's future.
                            </p>
                            <p className="text-2xl text-slate-500">
                                Be prepared for the unexpected with a secure, affordable WILL
                            </p>
                            <NextButton className="w-fit lowercase" onClick={handleGetStartedClick} label="Get Started" />
                        </div>
                        <div className="col-span-2 flex items-end justify-end w-full">
                            <img className="w-80" src="/assets/family.jpg" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 max-w-7xl gap-10 m-auto justify-around">
                    <div className="bg-will-green col-span-1 w-full p-5 space-y-2 text-white">
                        <img className="h-40" src="/assets/make-your-will.png" />
                        <p className="font-semibold text-xl">Make your will</p>
                        <p>Create a will in 15 minutes</p>
                        <NextButton onClick={handleGetStartedClick} label="Get Started" className="!bg-white !text-will-green" />
                    </div>
                    <div className="bg-[#f5f6f8] col-span-1 w-full p-5 space-y-2 text-black">
                        <img className="h-40" src="/assets/expert-review.png" />
                        <p className="font-semibold text-xl">Expert Review</p>
                        <p className="text-will-green">Get your Will reviewed by experts. We will
                            suggest revisions in 24 hours.</p>
                    </div>
                    <div className="bg-[#f5f6f8] col-span-1 w-full space-y-2 p-5 text-black">
                        <img className="h-40" src="/assets/make-it-official.png" />
                        <p className="font-semibold text-xl">Make it Official</p>
                        <p className="text-will-green">Notarize or register and legalise your will with your chosen witnesses.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage