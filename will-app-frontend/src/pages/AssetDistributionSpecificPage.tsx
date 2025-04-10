import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
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
import { IJewelleryState, jewelleriesState } from "../atoms/JewelleriesState";
import { IVehicleState, vehiclesState } from "../atoms/VehiclesState";
import { digitalAssetsState, IDigitalAssetState } from "../atoms/DigitalAssetsState";
import { IIntellectualPropertyState, intellectualPropertiesState } from "../atoms/IntellectualPropertiesState";
import { customAssetsState, ICustomAssetState } from "../atoms/CustomAssets";
import CustomAssetSelectBar from "../components/CustomAssetSelectBar";
import NextButton from "../components/NextButton";
import CustomSelectBar from "../components/CustomSelectBar";
import { beneficiariesState, IBeneficiaryState } from "../atoms/BeneficiariesState";
import { AssetDistributionSpecificState } from "../atoms/AssetDistributionSpecificState";
import { userState } from "../atoms/UserDetailsState";
import { saveSpecificAssetDistributionApi } from "../api/assetDistribution";
import { useNavigate } from "react-router";
import { ROUTE_PATHS } from "../constants";
import DistributionBeneficiary from "../components/DistributionBeneficiary";
import Swal from "sweetalert2";
import { IPetState, petsState } from "../atoms/petsState";
import { artWorksState, IArtWorkState } from "../atoms/ArtWorksState";

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

const AssetDistributionSpecificPage = () => {
    const beneficiaryState = useRecoilValue<IBeneficiaryState[]>(beneficiariesState);
    const [assetDistribution, setAssetDistribution] = useRecoilState(AssetDistributionSpecificState);
    const [error,setError] = useState<boolean>(false);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();

    const properties = useRecoilValue(propertiesState);
    const bankAccounts = useRecoilValue(bankDetailsState);
    const fixedDeposits = useRecoilValue(fixedDepositsState);
    const insurancePolicies = useRecoilValue(insurancePoliciesState);
    const safetyDepositBoxes = useRecoilValue(safetyDepositBoxesState);
    const dematAccounts = useRecoilValue(dematAccountsState);
    const mutualFunds = useRecoilValue(mutualFundsState);
    const providentFunds = useRecoilValue(providentFundsState);
    const pensionAccounts = useRecoilValue(pensionAccountsState);
    const businessses = useRecoilValue(businessesState);
    const bonds = useRecoilValue(bondsState);
    const debentures = useRecoilValue(debenturesState);
    const escops = useRecoilValue(escopsState);
    const jewelleries = useRecoilValue(jewelleriesState);
    const vehicles = useRecoilValue(vehiclesState);
    const digitalAssets = useRecoilValue(digitalAssetsState);
    const intellectualProperties = useRecoilValue(intellectualPropertiesState);
    const customAssets = useRecoilValue(customAssetsState);
    const pets = useRecoilValue(petsState);
    const arts = useRecoilValue(artWorksState);
    
    React.useEffect(() => {
        getAssetDetails();
    }, [properties,bankAccounts,fixedDeposits,insurancePolicies,safetyDepositBoxes,dematAccounts,mutualFunds,providentFunds,pensionAccounts,businessses,bonds,debentures,escops,jewelleries,vehicles,digitalAssets,intellectualProperties,customAssets,pets,arts])
    
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
        let propertiesList = properties.filter((data: IPropertiesState) => data.id !== "")
            .map((data: IPropertiesState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Property ${index + 1}`,
                    assetId: data.id,
                    firstline: data.address?.trim() || "",
                    secondline: [data.city?.trim(), data.pincode?.trim()].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedAsset?.beneficiarieslist ?? null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed ?? false
                }
            });
        let bankAccountsList = bankAccounts.filter((data: IBankDetailsState) => data.id !== "")
            .map((data: IBankDetailsState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Bank Accounts ${index + 1}`,
                    assetId: data.id,
                    firstline: data.bankName?.trim() || "",
                    secondline: [data.accountType?.trim(), data.accountNumber?.trim()].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false
                }
            });
        let fixedDepositsList = fixedDeposits.filter((data: IFixedDepositState) => data.id !== "")
            .map((data: IFixedDepositState, index: number) => {

                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Fixed Deposits ${index + 1}`,
                    assetId: data.id,
                    firstline: [data.bankName?.trim(), data.accountNumber?.trim()].filter(Boolean).join(" - "),
                    secondline: [data.branch?.trim(), data.city?.trim()].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false
                }
            });
        let insurancePoliciesList = insurancePolicies.filter((data: IInsurancePolicyState) => data.id !== "")
            .map((data: IInsurancePolicyState, index: number) => {

                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Insurance Policies ${index + 1}`,
                    assetId: data.id,
                    firstline: data.insuranceType?.trim() || "",
                    secondline: data.insuranceProvider.trim() || "",
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false                }
            });
        let safetyDepositBoxesList = safetyDepositBoxes.filter((data: ISafetyDepositBoxState) => data.id !== "")
            .map((data: ISafetyDepositBoxState, index: number) => {

                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Safety Deposit Boxes ${index + 1}`,
                    assetId: data.id,
                    firstline: data.depositBoxType?.trim() || "",
                    secondline: [data.bankName?.trim(), data.city?.trim()].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false                   }
            });
        let dematAccountsList = dematAccounts.filter((data: IDematAccountState) => data.id !== "")
            .map((data: IDematAccountState, index: number) => {

                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );
                  
                return {
                    type: `Demat Account ${index + 1}`,
                    assetId: data.id,
                    firstline: data.accountNumber?.trim() || "",
                    secondline: [data.brokerName?.trim()].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false                   
                }
            });
        let mutualFundsList = mutualFunds.filter((data: IMutualFundState) => data.id !== "")
            .map((data: IMutualFundState, index: number) => {

                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Mutual Fund ${index + 1}`,
                    assetId: data.id,
                    firstline: [data.fundName?.trim(), data.noOfHolders?.trim()].filter(Boolean).join(" - "),
                    secondline: "",
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false                   
                }
            });
        let providentFundsList = providentFunds.filter((data: IProvidentFundState) => data.id !== "")
            .map((data: IProvidentFundState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Provident Fund ${index + 1}`,
                    assetId: data.id,
                    firstline: data.type?.trim() || "",
                    secondline: [data.bankName?.trim(), data.branch?.trim(), data.city?.trim()].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false     
                }
            });
        let pensionAccountsList = pensionAccounts.filter((data: IPensionAccountState) => data.id !== "")
            .map((data: IPensionAccountState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Pension Account ${index + 1}`,
                    assetId: data.id,
                    firstline: data.bankName?.trim() || "",
                    secondline: [data.schemeName?.trim()].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false  
                }
            });
        let businesssesList = businessses.filter((data: IBusinessState) => data.id !== "")
            .map((data: IBusinessState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Business ${index + 1}`,
                    assetId: data.id,
                    firstline: [data.type?.trim(), data.holdingPercentage?.trim()].filter(Boolean).join(" - "),
                    secondline: [data.companyName?.trim(), data.address?.trim()].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false 
                }
            });
        let bondsList = bonds.filter((data: IBondState) => data.id !== "")
            .map((data: IBondState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Bond ${index + 1}`,
                    assetId: data.id,
                    firstline: data.type?.trim() || "",
                    secondline: [data.financialServiceProviderName?.trim(), data.certificateNumber?.trim()].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false
                }
            });
        let debenturesList = debentures.filter((data: IDebentureState) => data.id !== "")
            .map((data: IDebentureState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Pension Account ${index + 1}`,
                    assetId: data.id,
                    firstline: data.type?.trim() || "",
                    secondline: [data.financialServiceProviderName?.trim(), data.certificateNumber?.trim()].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false
                }
            });
        let escopsList = escops.filter((data: IEscopState) => data.id !== "")
            .map((data: IEscopState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `ESOP ${index + 1}`,
                    assetId: data.id,
                    firstline: data.companyName?.trim() || "",
                    secondline: [
                        data.noOfUnitGraged ? `Units Graded: ${data.noOfUnitGraged}` : "",
                        data.noOfVestedEscops ? `Vested: ${data.noOfVestedEscops}` : "",
                        data.noOfUnVestedEscops ? `Unvested: ${data.noOfUnVestedEscops}` : ""
                    ].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false
                }
            });
        let jewelleriesList = jewelleries.filter((data: IJewelleryState) => data.id !== "")
            .map((data: IJewelleryState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Jewellery ${index + 1}`,
                    assetId: data.id,
                    firstline: data.description?.trim() || "",
                    secondline: "",
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false
                }
            });
        let vehiclesList = vehicles.filter((data: IVehicleState) => data.id !== "")
            .map((data: IVehicleState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Vechicle ${index + 1}`,
                    assetId: data.id,
                    firstline: data.brandOrModel?.trim() || "",
                    secondline: data.registrationNumber?.trim() || "",
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false
                }
            });
        let digitalAssetsList = digitalAssets.filter((data: IDigitalAssetState) => data.id !== "")
            .map((data: IDigitalAssetState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Digital Asset ${index + 1}`,
                    assetId: data.id,
                    firstline: data.type?.trim() || "",
                    secondline: data.walletAddress?.trim() || "",
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false
                }
            });
        let intellectualPropertiesList = intellectualProperties.filter((data: IIntellectualPropertyState) => data.id !== "")
            .map((data: IIntellectualPropertyState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Intellectual Property ${index + 1}`,
                    assetId: data.id,
                    firstline: data.type?.trim() || "",
                    secondline: [data.identificationNumber?.trim(), data.description?.trim()].filter(Boolean).join(" - "),
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false
                }
            });
        let customAssetsList = customAssets.filter((data: ICustomAssetState) => data.id !== "")
            .map((data: ICustomAssetState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Custom Asset ${index + 1}`,
                    assetId: data.id,
                    firstline: data.description?.trim() || "",
                    secondline: "",
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false
                }
            });
        let petList = pets.filter((data: IPetState) => data.id !== "")
            .map((data: IPetState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Pets ${index + 1}`,
                    assetId: data.id,
                    firstline : data.petName?.trim() || "",
                    secondline : data.animalBreed?.trim(),
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false
                }
            });
            let artList = arts.filter((data: IArtWorkState) => data.id !== "")
            .map((data: IArtWorkState, index: number) => {
                const selectedAsset = assetDistribution?.assetSelectionList?.find(
                    asset => asset?.assetId === data.id
                  );

                return {
                    type: `Art Work ${index + 1}`,
                    assetId: data.id,
                    firstline : data.name?.trim() || "",
                    secondline : data.description?.trim(),
                    beneficiarieslist: selectedAsset?.beneficiarieslist || null,
                    isAssetDistributed: selectedAsset?.isAssetDistributed || false
                }
            });
        setAssetDistribution((prev) => ({
            ...prev,
            assetSelectionList: [...propertiesList, ...bankAccountsList, ...fixedDepositsList, ...insurancePoliciesList, ...safetyDepositBoxesList,
            ...dematAccountsList, ...mutualFundsList, ...providentFundsList, ...pensionAccountsList, ...businesssesList, ...bondsList,
            ...debenturesList, ...escopsList, ...jewelleriesList, ...vehiclesList, ...digitalAssetsList, ...intellectualPropertiesList, ...customAssetsList, ...petList,...artList
            ]
        }));
    }

    const handleSelectAssetChange = (value: string) => {
        setAssetDistribution((prev) => ({
            ...prev,
            selectedAssets: prev.selectedAssets.includes(value) ? prev.selectedAssets.filter((option) => option !== value) : [...prev.selectedAssets, value]
        }));
    };

    const handleSelectbeneficiaryChange = (value: string) => {
        setAssetDistribution((prev) => ({
            ...prev,
            selectedBeneficiary: prev.selectedBeneficiary.includes(value) ? prev.selectedBeneficiary.filter((option) => option !== value) : [...prev.selectedBeneficiary, value]
        }));
    };

    const handleAssetPercentInputChange = (value: string, input: string) => {
        setAssetDistribution((prev) => ({
            ...prev,
            additionalInputs: { ...prev.additionalInputs, [value]: input }
        }));
    };
    const handleEditChange = (value: string) => {

        let newInputs = assetDistribution.assetSelectionList
            .find(asset => asset.assetId === value)
            ?.beneficiarieslist?.reduce(
                (acc, { beneficiaryId, percentage }) => ({
                    ...acc,
                    [beneficiaryId]: String(percentage),
                }),
                {} as Record<string, string>
            ) || {};
        setAssetDistribution((prev) => ({
            ...prev,
            selectedBeneficiary: Object.keys(newInputs),
            additionalInputs: newInputs,
            selectedAssets: [value],
            step: 2
        }));
    };

    const handleBackupBeneficiaryChange = (value: string) => {
        setAssetDistribution((prev) => ({
            ...prev,
            backupBeneficiary: [value]
        }));
    };

    const handleNextStep = async () => {
        if (assetDistribution.step === 1) {
            let areAllAssetsDistributed = assetDistribution.assetSelectionList.every(asset => asset.isAssetDistributed);
            if (areAllAssetsDistributed) {
                setAssetDistribution((prev) => ({
                    ...prev,
                    step: 3
                }));

            }
            else if (assetDistribution.selectedAssets.length === 0)
            {
                Swal.fire({
                            title: "Warning!!",
                            text: "Please select atleast one asset",
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
            else {
                setAssetDistribution((prev) => ({
                    ...prev,
                    step: 2
                }));
            }
        }
        else if (assetDistribution.step === 2) {
            if (assetDistribution.selectedBeneficiary.length === 0)
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

            let toatlamount = 0;
            for (let key in assetDistribution.additionalInputs) {
                toatlamount += parseInt(assetDistribution.additionalInputs[key]);
            }
            if(toatlamount!= 100 && assetDistribution.selectedBeneficiary.length > 1)
            {
                setError(true);
            }
            else
            {
                let beneficiaryDistributionitem: IBeneficiaryDistribution[];

                if (Object.keys(assetDistribution.additionalInputs).length === 0 || assetDistribution.selectedBeneficiary.length === 1) {
                    beneficiaryDistributionitem = [
                        {
                            beneficiaryId: assetDistribution.selectedBeneficiary[0],
                            beneficiaryName: beneficiaryOptionsFirst.find(b => b.value === assetDistribution.selectedBeneficiary[0])?.label ?? "",
                            percentage: 100
                        }
                    ];
                } else {
                    beneficiaryDistributionitem = Object.entries(assetDistribution.additionalInputs).map(([beneficiaryId, percentage]) => ({
                        beneficiaryId,
                        beneficiaryName: beneficiaryOptionsFirst.find(b => b.value === beneficiaryId)?.label ?? "",
                        percentage: Number(percentage) || 0 // Convert percentage to number safely
                    }));
                }


                setAssetDistribution((prev) => ({
                    ...prev,
                    assetSelectionList: prev.assetSelectionList.map(asset =>
                        prev.selectedAssets.includes(asset.assetId)
                            ? { ...asset, beneficiarieslist: beneficiaryDistributionitem, isAssetDistributed: true }
                            : asset
                    ),
                    selectedBeneficiary: [],
                    additionalInputs: {},
                    selectedAssets: [],
                    step: 1
                }));
            }  
        }
        else if (assetDistribution.step === 3) {
            const userId = user.userId;
            await saveSpecificAssetDistributionApi(userId, assetDistribution.assetSelectionList);

            navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.RESIDUARY_SELECTION);
            // save logic
            setAssetDistribution((prev) => ({
                ...prev,
                step: 1
            }));
        }
    };



    return (
        <div className="flex flex-col justify-between px-6 
        w-full min-h-[calc(100vh-232px)] md:max-w-[560px] md:mx-auto">
            {assetDistribution.step === 1 && (
                <>
                    <h2 className="text-xl font-bold mb-3">Select the assets you would like to assign a beneficiary</h2>
                    <p className="mb-2">Selecting multiple assets at once will allow you to distribute them together. (They will be sold and converted to cash or digital money and then distributed if multiple beneficiaries are chosen)</p>
                    <CustomAssetSelectBar
                        assets={assetDistribution.assetSelectionList}
                        onSelectChange={(value) => handleSelectAssetChange(value)}
                        multiple={true}
                        selectedOptions={assetDistribution.selectedAssets}
                        onEdit={handleEditChange}
                    />
                    <NextButton onClick={handleNextStep} label="Save & Continue" />
                </>
            )}
            {assetDistribution.step === 2 && (
                <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
                    <h2 className="text-xl font-bold mb-5">
                        Who will be inheriting this asset?
                    </h2>
                    {assetDistribution.assetSelectionList
                        .filter(asset => assetDistribution.selectedAssets.includes(asset.assetId)) // Filter only selected assets
                        .map(asset => (
                            <div key={asset.assetId} className="flex flex-col gap-y-5 w-full">
                                {/* Header Section */}
                                <div className="flex flex-col items-start">
                                    <p className="header capitalize">{asset.type}</p>
                                    <div className="font-medium text-sm leading-[24px] text-[#848484]">
                                        <p>{asset.firstline}</p>
                                        <p>{asset.secondline}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    <div>
                        <CustomSelectBar
                            options={beneficiaryOptionsFirst}
                            onSelectChange={handleSelectbeneficiaryChange}
                            onInputChange={handleAssetPercentInputChange}
                            multiple={true}
                            selectedOptions={assetDistribution.selectedBeneficiary}
                            showAdditionalInput={true}
                            onPercentageInput={assetDistribution.additionalInputs}
                        />
                        <DistributionBeneficiary />
                    </div>
                    {error && <p className="mt-3  text-red-500">Please make sure the sum of percentages add up to 100%</p>}
                    <div className="justify-between flex mt-10">
                        <NextButton
                            onClick={handleNextStep}
                            label="Save & continue"
                        />
                    </div>
                </div>
            )}
            {assetDistribution.step === 3 && (
                <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
                    <h2 className="text-xl font-bold mb-5">
                        If one of your beneficiaries passes away before you, who should inherit their share of the assets instead?
                    </h2>
                    <CustomSelectBar
                        options={backupBeneficiaryOptions}
                        onSelectChange={handleBackupBeneficiaryChange}
                        multiple={false}
                        selectedOptions={assetDistribution.backupBeneficiary}
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
export default AssetDistributionSpecificPage;