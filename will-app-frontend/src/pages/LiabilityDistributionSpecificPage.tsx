import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import CustomAssetSelectBar from "../components/CustomAssetSelectBar";
import NextButton from "../components/NextButton";
import CustomSelectBar from "../components/CustomSelectBar";
import { beneficiariesState, IBeneficiaryState } from "../atoms/BeneficiariesState";
import { userState } from "../atoms/UserDetailsState";
import { saveLiablitiyDistributionApi } from "../api/assetDistribution";
import { useNavigate } from "react-router";
import { ROUTE_PATHS } from "../constants";
import DistributionBeneficiary from "../components/DistributionBeneficiary";
import Swal from "sweetalert2";
import { homeLoansState, IHomeLoanState } from "../atoms/HomeLoansState";
import { IPersonalLoanState, personalLoansState } from "../atoms/PersonalLoansState";
import { IVehicleLoanState, vehicleLoansState } from "../atoms/VehicleLoansState";
import { educationLoansState, IEducationLoanState } from "../atoms/EducationsLoanState";
import { IOtherLiabilityState, otherLiabilitiesState } from "../atoms/OtherLiabilitiesState";
import { LiabilityDistributionSpecificState } from "../atoms/LiabilityDistributionSpecificState";


export interface IBeneficiaryDistribution {
    beneficiaryId: string;
    beneficiaryName: string;
    percentage: number;
}
export interface IAssetSelectionState {
    type: string;
    assetId: string;
    firstline: string;
    secondline: string;
    beneficiarieslist: IBeneficiaryDistribution[] | null;
    isAssetDistributed: boolean;
}

const LiabilityDistributionSpecificPage = () => {
    const beneficiaryState = useRecoilValue<IBeneficiaryState[]>(beneficiariesState);
    const [liabilityDistribution, setLiabilityDistribution] = useRecoilState(LiabilityDistributionSpecificState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();

    const homeLoans = useRecoilValue(homeLoansState);
    const personalLoans = useRecoilValue(personalLoansState);
    const vechicleLoans = useRecoilValue(vehicleLoansState);
    const educationLoans = useRecoilValue(educationLoansState);
    const otherLiabilities = useRecoilValue(otherLiabilitiesState);

    React.useEffect(() => {
        getAssetDetails();
    }, [homeLoans,personalLoans,vechicleLoans,educationLoans,otherLiabilities])
    
    const beneficiaryOptionsFirst = beneficiaryState
    .filter(beneficiary => !beneficiary.isGuardian)
    .map(beneficiary => ({
      value: beneficiary.id,
      label: beneficiary.type === "Person" ? beneficiary.fullName : beneficiary.organization,
    }));

    const backupBeneficiaryOptions = [
        { value: "spouse_children", label: "Their spouse and/or children" },
        { value: "equal_split", label: "Split between remaining beneficiaries equally" },
        { value: "percentage_split", label: "Split between remaining beneficiaries according to their previously mentioned percentages" },
    ];
    
    const getAssetDetails = () => {
        let homeLoansList = homeLoans.filter((data: IHomeLoanState) => data.id !== "")
            .map((data: IHomeLoanState, index: number) => {
                const selectedLiability = liabilityDistribution?.LiabilitySelectionList?.find(
                    liability => liability?.assetId === data.id
                  );

                return {
                    type: `Home Loan ${index + 1}`,
                    assetId: data.id,
                    firstline: data.nameOfBank?.trim() || "",
                    secondline: [data.accountNumber?.trim(), data.loanAmount ? "Rs. " + data.loanAmount : ""].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedLiability?.beneficiarieslist ?? null,
                    isAssetDistributed: selectedLiability?.isAssetDistributed ?? false
                }
            });
        let personalLoansList = personalLoans.filter((data: IPersonalLoanState) => data.id !== "")
            .map((data: IPersonalLoanState, index: number) => {
                const selectedLiability = liabilityDistribution?.LiabilitySelectionList?.find(
                    liability => liability?.assetId === data.id
                  );

                return {
                    type: `Personal Loan ${index + 1}`,
                    assetId: data.id,
                    firstline: data.nameOfBank?.trim() || "",
                    secondline: [data.accountNumber?.trim(), data.loanAmount ? "Rs. " + data.loanAmount : ""].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedLiability?.beneficiarieslist || null,
                    isAssetDistributed: selectedLiability?.isAssetDistributed || false
                }
            });
        let vehicleLoansList = vechicleLoans.filter((data: IVehicleLoanState) => data.id !== "")
            .map((data: IVehicleLoanState, index: number) => {

                const selectedLiability = liabilityDistribution?.LiabilitySelectionList?.find(
                    liability => liability?.assetId === data.id
                  );

                return {
                    type: `Vechicle Loan ${index + 1}`,
                    assetId: data.id,
                    firstline: data.nameOfBank?.trim() || "",
                    secondline: [data.accountNumber?.trim(), data.loanAmount ? "Rs. " + data.loanAmount : ""].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedLiability?.beneficiarieslist || null,
                    isAssetDistributed: selectedLiability?.isAssetDistributed || false
                }
            });
        let educationLoansList = educationLoans.filter((data: IEducationLoanState) => data.id !== "")
            .map((data: IEducationLoanState, index: number) => {

                const selectedLiability = liabilityDistribution?.LiabilitySelectionList?.find(
                    liability => liability?.assetId === data.id
                  );

                return {
                    type: `Education Loan ${index + 1}`,
                    assetId: data.id,
                    firstline: data.nameOfBank?.trim() || "",
                    secondline: [data.loanAmount ? "Rs. " + data.loanAmount : ""].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedLiability?.beneficiarieslist || null,
                    isAssetDistributed: selectedLiability?.isAssetDistributed || false                }
            });
        let otherLiabilitiesList = otherLiabilities.filter((data: IOtherLiabilityState) => data.id !== "")
            .map((data: IOtherLiabilityState, index: number) => {

                const selectedLiability = liabilityDistribution?.LiabilitySelectionList?.find(
                    liability => liability?.assetId === data.id
                  );

                return {
                    type: `Other Liability ${index + 1}`,
                    assetId: data.id,
                    firstline: data.nameOfLender?.trim() || "",
                    secondline: [data.accountNumber?.trim(), data.loanAmount ? "Rs. " + data.loanAmount : ""].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedLiability?.beneficiarieslist || null,
                    isAssetDistributed: selectedLiability?.isAssetDistributed || false                   }
            });
    
        setLiabilityDistribution((prev) => ({
            ...prev,
            LiabilitySelectionList: [...homeLoansList,...personalLoansList,...vehicleLoansList,...educationLoansList,...otherLiabilitiesList]
        }));
    }

    const handleSelectLiabilityChange = (value: string) => {
        setLiabilityDistribution((prev) => ({
            ...prev,
            selectedLiability: prev.selectedLiability.includes(value) ? prev.selectedLiability.filter((option) => option !== value) : [...prev.selectedLiability, value]
        }));
    };

    const handleSelectbeneficiaryChange = (value: string) => {
        setLiabilityDistribution((prev) => ({
            ...prev,
            selectedBeneficiary: [value]
        }));
    };

    
    const handleEditChange = (value: string) => {

        let newInputs = liabilityDistribution.LiabilitySelectionList
            .find(liability => liability.assetId === value)
            ?.beneficiarieslist?.map((re) => re.beneficiaryId.toString()) ?? [];
        setLiabilityDistribution((prev) => ({
            ...prev,
            selectedBeneficiary: newInputs,
            selectedLiability: [value],
            step: 2
        }));
    };

    const handleBackupBeneficiaryChange = (value: string) => {
        setLiabilityDistribution((prev) => ({
            ...prev,
            backupBeneficiary: [value]
        }));
    };

    const handleNextStep = async () => {
        if (liabilityDistribution.step === 1) {
            let areAllLiabilityDistributed = liabilityDistribution.LiabilitySelectionList.every(liability => liability.isAssetDistributed);
            if (liabilityDistribution.selectedLiability.length === 0 && !areAllLiabilityDistributed)
                {
                    Swal.fire({
                                title: "Warning!!",
                                text: "Please select atleast one Liability",
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
            else if (areAllLiabilityDistributed) {
                setLiabilityDistribution((prev) => ({
                    ...prev,
                    step: 3
                }));

            } 
            else {
                setLiabilityDistribution((prev) => ({
                    ...prev,
                    step: 2
                }));
            }
        }
        else if (liabilityDistribution.step === 2) {
            if (liabilityDistribution.selectedBeneficiary.length === 0)
            {
                Swal.fire({
                            title: "Warning!!",
                            text: "Please select atleast one beneficiary to proceed",
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

            
                let beneficiaryDistributionitem: IBeneficiaryDistribution[] = [
                        {
                            beneficiaryId: liabilityDistribution.selectedBeneficiary[0],
                            beneficiaryName: beneficiaryOptionsFirst.find(b => b.value === liabilityDistribution.selectedBeneficiary[0])?.label ?? "",
                            percentage: 100
                        }
                    ];
                
                setLiabilityDistribution((prev) => ({
                    ...prev,
                    LiabilitySelectionList: prev.LiabilitySelectionList.map(asset =>
                        prev.selectedLiability.includes(asset.assetId)
                            ? { ...asset, beneficiarieslist: beneficiaryDistributionitem, isAssetDistributed: true }
                            : asset
                    ),
                    selectedBeneficiary: [],
                    selectedAssets: [],
                    step: 1
                }));
             
        }
        else if (liabilityDistribution.step === 3) {
            const userId = user.userId;
            
            await saveLiablitiyDistributionApi(userId, liabilityDistribution.LiabilitySelectionList);

            navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.EXECLUDED_PERSONS);
            // save logic
            setLiabilityDistribution((prev) => ({
                ...prev,
                step: 1
            }));
        }
    };



    return (
        <div className="flex flex-col justify-between px-6 
        w-full min-h-[calc(100vh-232px)] md:max-w-[560px] md:mx-auto">
            {liabilityDistribution.step === 1 && (
                <>
                    <h2 className="text-xl font-bold mb-3">Select the Liabilities you would like to assign a beneficiary</h2>
                    <p className="mb-2">Selecting multiple Liabilities at once will allow you to distribute them together</p>
                    <CustomAssetSelectBar
                        assets={liabilityDistribution.LiabilitySelectionList}
                        onSelectChange={(value) => handleSelectLiabilityChange(value)}
                        multiple={true}
                        selectedOptions={liabilityDistribution.selectedLiability}
                        onEdit={handleEditChange}
                    />
                    <NextButton onClick={handleNextStep} label="Save & Continue" />
                </>
            )}
            {liabilityDistribution.step === 2 && (
                <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
                    <h2 className="text-xl font-bold mb-5">
                        Who will be inheriting this asset?
                    </h2>
                    {liabilityDistribution.LiabilitySelectionList
                        .filter(liability => liabilityDistribution.selectedLiability.includes(liability.assetId)) // Filter only selected assets
                        .map(liability => (
                            <div key={liability.assetId} className="flex flex-col gap-y-5 w-full">
                                {/* Header Section */}
                                <div className="flex flex-col items-start">
                                    <p className="header capitalize">{liability.type}</p>
                                    <div className="font-medium text-sm leading-[24px] text-[#848484]">
                                        <p>{liability.firstline}</p>
                                        <p>{liability.secondline}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    <div>
                        <CustomSelectBar
                            options={beneficiaryOptionsFirst}
                            onSelectChange={handleSelectbeneficiaryChange}
                            multiple={false}
                            selectedOptions={liabilityDistribution.selectedBeneficiary}
                            
                        />
                        <DistributionBeneficiary />
                    </div>
                    <div className="justify-between flex mt-10">
                        <NextButton
                            onClick={handleNextStep}
                            label="Save & continue"
                        />
                    </div>
                </div>
            )}
            {liabilityDistribution.step === 3 && (
                <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
                    <h2 className="text-xl font-bold mb-5">
                        If one of your beneficiaries passes away before you, who should inherit their share of the assets instead?
                    </h2>
                    <CustomSelectBar
                        options={backupBeneficiaryOptions}
                        onSelectChange={handleBackupBeneficiaryChange}
                        multiple={false}
                        selectedOptions={liabilityDistribution.backupBeneficiary}
                    />
                    <div className="justify-between flex mt-10">
                        <NextButton
                            onClick={handleNextStep}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
export default LiabilityDistributionSpecificPage;