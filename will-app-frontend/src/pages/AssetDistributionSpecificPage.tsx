import React, { useState } from "react";
import { useRecoilValue } from "recoil";
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

export interface IBeneficiaryDistribution{
    beneficiaryId: string;
    beneficiaryName: string;
    percentage: number;
}
export interface IAssetSelectionState{
    type: string;
    assetId: string;
    firstline: string;
    secondline : string;
    beneficiarieslist: IBeneficiaryDistribution[] | null;
    isAssetDistributed: boolean;
}

const AssetDistributionSpecificPage = () => {
    const beneficiaryState = useRecoilValue<IBeneficiaryState[]>(beneficiariesState);
    const [assetSelectionList, setAssetSelectionList] = useState<IAssetSelectionState[]>([]);
    const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<string[]>([]);
    const [additionalInputs, setAdditionalInputs] = useState<Record<string, string>>({});
    const [backupBeneficiary, setBackupBeneficiary] = useState<string[]>([]);
    const [step, setStep] = useState(1);

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
       
     React.useEffect(() => {
        getAssetDetails();
        }, [])

    const beneficiaryOptionsFirst = beneficiaryState.map((beneficiary) => ({
        value: beneficiary.id,
        label: beneficiary.fullName,
        }));

    const backupBeneficiaryOptions = [
        { value: "spouse_children", label: "Their spouse and/or children" },
        { value: "equal_split", label: "Split between remaining beneficiaries equally" },
        { value: "percentage_split", label: "Split between remaining beneficiaries according to their previously mentioned percentages" },
        ];
        
    const getAssetDetails = () => {
        let propertiesList = properties.filter((data: IPropertiesState) => data.id !== "")
        .map((data:IPropertiesState,index:number) => {
            return {
                type: `Property ${index}`,
                assetId: data.id,
                firstline: data.address?.trim() || "",
                secondline : [data.city?.trim(), data.pincode?.trim()].filter(Boolean).join(" - "),
                beneficiarieslist: null,
                isAssetDistributed: false
            }
        });
        let bankAccountsList = bankAccounts.filter((data: IBankDetailsState) => data.id !== "")
        .map((data:IBankDetailsState,index:number) => {
            return {
                type: `Bank Accounts ${index}`,
                assetId: data.id,
                firstline: data.bankName?.trim() || "",
                secondline : [data.accountType?.trim(), data.accountNumber?.trim()].filter(Boolean).join(" - "),
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let fixedDepositsList = fixedDeposits.filter((data: IFixedDepositState) => data.id !== "")
        .map((data:IFixedDepositState,index:number) => {
            return {
                type: `Fixed Deposits ${index}`,
                assetId: data.id,
                firstline: [data.bankName?.trim(), data.accountNumber?.trim()].filter(Boolean).join(" - "),
                secondline : [data.branch?.trim(), data.city?.trim()].filter(Boolean).join(" - "),
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let insurancePoliciesList = insurancePolicies.filter((data: IInsurancePolicyState) => data.id !== "")
        .map((data:IInsurancePolicyState,index:number) => {
            return {
                type: `Insurance Policies ${index}`,
                assetId: data.id,
                firstline: data.insuranceType?.trim() || "",
                secondline : data.insuranceProvider.trim() || "",
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let safetyDepositBoxesList = safetyDepositBoxes.filter((data: ISafetyDepositBoxState) => data.id !== "")
        .map((data:ISafetyDepositBoxState,index:number) => {
            return {
                type: `Safety Deposit Boxes ${index}`,
                assetId: data.id,
                firstline: data.depositBoxType?.trim() || "",
                secondline : [data.bankName?.trim(), data.city?.trim()].filter(Boolean).join(" - "),
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let dematAccountsList = dematAccounts.filter((data: IDematAccountState) => data.id !== "")
        .map((data:IDematAccountState,index:number) => {
            return {
                type: `Demat Account ${index}`,
                assetId: data.id,
                firstline: data.accountNumber?.trim() || "",
                secondline : [data.brokerName?.trim()].filter(Boolean).join(" - "),
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let mutualFundsList = mutualFunds.filter((data: IMutualFundState) => data.id !== "")
        .map((data:IMutualFundState,index:number) => {
            return {
                type: `Mutual Fund ${index}`,
                assetId: data.id,
                firstline: [data.fundName?.trim(), data.noOfHolders?.trim()].filter(Boolean).join(" - "),
                secondline : "",
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let providentFundsList = providentFunds.filter((data: IProvidentFundState) => data.id !== "")
        .map((data:IProvidentFundState,index:number) => {
            return {
                type: `Provident Fund ${index}`,
                assetId: data.id,
                firstline: data.type?.trim() || "",
                secondline : [data.bankName?.trim(), data.branch?.trim(), data.city?.trim()].filter(Boolean).join(" - "),
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let pensionAccountsList = pensionAccounts.filter((data: IPensionAccountState) => data.id !== "")
        .map((data:IPensionAccountState,index:number) => {
            return {
                type: `Pension Account ${index}`,
                assetId: data.id,
                firstline: data.bankName?.trim() || "",
                secondline : [data.schemeName?.trim()].filter(Boolean).join(" - "),
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let businesssesList = businessses.filter((data: IBusinessState) => data.id !== "")
        .map((data:IBusinessState,index:number) => {
            return {
                type: `Business ${index}`,
                assetId: data.id,
                firstline: [data.type?.trim(), data.holdingPercentage?.trim()].filter(Boolean).join(" - "),
                secondline : [data.companyName?.trim(), data.address?.trim()].filter(Boolean).join(" - "),
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let bondsList = bonds.filter((data: IBondState) => data.id !== "")
        .map((data:IBondState,index:number) => {
            return {
                type: `Bond ${index}`,
                assetId: data.id,
                firstline: data.type?.trim() || "",
                secondline : [data.financialServiceProviderName?.trim(), data.certificateNumber?.trim()].filter(Boolean).join(" - "),
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let debenturesList = debentures.filter((data: IDebentureState) => data.id !== "")
        .map((data:IDebentureState,index:number) => {
            return {
                type: `Pension Account ${index}`,
                assetId: data.id,
                firstline: data.type?.trim() || "",
                secondline : [data.financialServiceProviderName?.trim(), data.certificateNumber?.trim()].filter(Boolean).join(" - "),
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let escopsList = escops.filter((data: IEscopState) => data.id !== "")
        .map((data:IEscopState,index:number) => {
            return {
                type: `ESCOP ${index}`,
                assetId: data.id,
                firstline: data.companyName?.trim() || "",
                secondline : [
                    data.noOfUnitGraged ? `Units Graded: ${data.noOfUnitGraged}` : "",
                    data.noOfVestedEscops ? `Vested: ${data.noOfVestedEscops}` : "",
                    data.noOfUnVestedEscops ? `Unvested: ${data.noOfUnVestedEscops}` : ""
                ].filter(Boolean).join(" - "),
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let jewelleriesList = jewelleries.filter((data: IJewelleryState) => data.id !== "")
        .map((data:IJewelleryState,index:number) => {
            return {
                type: `Jewellery ${index}`,
                assetId: data.id,
                firstline: data.description?.trim() || "",
                secondline : "",
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let vehiclesList = vehicles.filter((data: IVehicleState) => data.id !== "")
        .map((data:IVehicleState,index:number) => {
            return {
                type: `Vechicle ${index}`,
                assetId: data.id,
                firstline: data.brandOrModel?.trim() || "",
                secondline : data.registrationNumber?.trim() || "",
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let digitalAssetsList = digitalAssets.filter((data: IDigitalAssetState) => data.id !== "")
        .map((data:IDigitalAssetState,index:number) => {
            return {
                type: `Digital Asset ${index}`,
                assetId: data.id,
                firstline: data.type?.trim() || "",
                secondline : data.walletAddress?.trim() || "",
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let intellectualPropertiesList = intellectualProperties.filter((data: IIntellectualPropertyState) => data.id !== "")
        .map((data:IIntellectualPropertyState,index:number) => {
            return {
                type: `Intellectual Property ${index}`,
                assetId: data.id,
                firstline: data.type?.trim() || "",
                secondline : [data.identificationNumber?.trim(), data.description?.trim()].filter(Boolean).join(" - "),
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });
        let customAssetsList = customAssets.filter((data: ICustomAssetState) => data.id !== "")
        .map((data:ICustomAssetState,index:number) => {
            return {
                type: `Custom Asset ${index}`,
                assetId: data.id,
                firstline: data.description?.trim() || "",
                secondline : "",
                beneficiarieslist:  null,
                isAssetDistributed: false
            }
        });

        setAssetSelectionList([...propertiesList,...bankAccountsList,...fixedDepositsList,...insurancePoliciesList,...safetyDepositBoxesList,
            ...dematAccountsList,...mutualFundsList,...providentFundsList,...pensionAccountsList,...businesssesList,...bondsList,
            ...debenturesList,...escopsList,...jewelleriesList,...vehiclesList,...digitalAssetsList,...intellectualPropertiesList, ...customAssetsList      
            ])
    }

    const handleSelectAssetChange = (value: string) => {
        setSelectedAssets((prevSelected) =>
          prevSelected.includes(value)
            ? prevSelected.filter((option) => option !== value)
            : [...prevSelected, value]
        );
      };

    const handleSelectbeneficiaryChange = (value: string) => {
        setSelectedBeneficiary((prevSelected) =>
            prevSelected.includes(value)
            ? prevSelected.filter((option) => option !== value)
            : [...prevSelected, value]
        );
    };

    const handleAssetPercentInputChange = (value: string, input: string) => {
        setAdditionalInputs((prevInputs) => ({
          ...prevInputs,
          [value]: input,
        }));
      };
    const handleEditChange = (value: string) => {
    
        let newInputs = assetSelectionList
        .find(asset => asset.assetId === value)
        ?.beneficiarieslist?.reduce(
          (acc, { beneficiaryId, percentage }) => ({
            ...acc,
            [beneficiaryId]: String(percentage),
          }),
          {} as Record<string, string>
        ) || {};
        setSelectedBeneficiary(Object.keys(newInputs));
        setAdditionalInputs(newInputs);
        setSelectedAssets([value]);
        setStep(2);
    };

    const handleBackupBeneficiaryChange = (value: string) => {
        setBackupBeneficiary([value]);
      };
    
    const handleNextStep = async () => {
        if (step === 1) {
            let areAllAssetsDistributed = assetSelectionList.every(asset => asset.isAssetDistributed);
            if (areAllAssetsDistributed) {
                setStep(3);
                console.log(assetSelectionList);
            } else {
                setStep(2);
            }
        } 
        else if(step === 2){
            let beneficiaryDistributionitem: IBeneficiaryDistribution[];
    
            if (Object.keys(additionalInputs).length === 0) {
                beneficiaryDistributionitem = [
                    {
                        beneficiaryId: selectedBeneficiary[0],
                        beneficiaryName: beneficiaryOptionsFirst.find(b => b.value === selectedBeneficiary[0])?.label ?? "",
                        percentage: 100
                    }
                ];
            } else {
                beneficiaryDistributionitem = Object.entries(additionalInputs).map(([beneficiaryId, percentage]) => ({
                    beneficiaryId,
                    beneficiaryName: beneficiaryOptionsFirst.find(b => b.value === beneficiaryId)?.label ?? "",
                    percentage: Number(percentage) || 0 // Convert percentage to number safely
                }));
            }
    
            // Update asset selection list: set isAssetDistributed to true for selected assets
            setAssetSelectionList(prevList =>
                prevList.map(asset =>
                    selectedAssets.includes(asset.assetId)
                        ? { ...asset, beneficiarieslist:beneficiaryDistributionitem, isAssetDistributed: true }
                        : asset
                )
            );
    
            // Reset states
            setStep(1);
            setAdditionalInputs({});
            setSelectedBeneficiary([]);
            setSelectedAssets([]);
        }
        else if(step === 3){
            //navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.RESIDUARY_SELECTION);
            // save logic
        }
    };
    
    

    return(
        <div className="flex flex-col justify-between px-6 w-full min-h-[calc(100vh-232px)] md:max-w-[560px] md:mx-auto">
            {step === 1 && (
                <>
                    <h2 className="text-xl font-bold mb-3">Select the assets you would like to assign a beneficiary</h2>
                    <p className="mb-2">Selecting multiple assets at once will allow you to distribute them together. (They will be sold and converted to cash or digital money and then distributed if multiple beneficiaries are chosen)</p>
                    <CustomAssetSelectBar
                        assets={assetSelectionList}
                        onSelectChange={(value) => handleSelectAssetChange(value)}
                        multiple={true}
                        selectedOptions={selectedAssets}
                        onEdit= {handleEditChange}
                    />
                    <NextButton onClick={handleNextStep} label="Save & Continue" />
                </>
            )}
            {step === 2 && (
        <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
          <h2 className="text-xl font-bold mb-5">
            Who will be inheriting this asset?
          </h2>
          {assetSelectionList
            .filter(asset => selectedAssets.includes(asset.assetId)) // Filter only selected assets
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

          <CustomSelectBar
            options={beneficiaryOptionsFirst}
            onSelectChange={handleSelectbeneficiaryChange}
            onInputChange={handleAssetPercentInputChange}
            multiple={true}
            selectedOptions={selectedBeneficiary}
            showAdditionalInput={true}
            onPercentageInput={additionalInputs}
          />
          <div className="justify-between flex mt-10">
            <NextButton
              onClick={handleNextStep}
              label="Save & continue"
            />
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
          <h2 className="text-xl font-bold mb-5">
            If one of your beneficiaries passes away before you, who should inherit their share of the assets instead?
          </h2>
          <CustomSelectBar
            options={backupBeneficiaryOptions}
            onSelectChange={handleBackupBeneficiaryChange}
            multiple={false}
            selectedOptions={backupBeneficiary}
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