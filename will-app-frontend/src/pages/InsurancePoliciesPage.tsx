import ConfirmDelete from "../components/ConfirmDelete";
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { deleteAsset, upsertAsset } from '../api/asset';
import { IInsurancePolicyState, insurancePoliciesState } from '../atoms/InsurancePoliciesState';
import { routesState } from '../atoms/RouteState';
import { userState } from '../atoms/UserDetailsState';
import { emptyInsurancePoliciesValidationState, IInsurancePolicyValidationState, insurancePoliciesValidationState } from '../atoms/validationStates/InsurancePoliciesValidationState';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import CustomAccordion from '../components/CustomAccordion';
import InsurancePolicyForm from '../components/Forms/InsurancePolicyForm';
import NextButton from '../components/NextButton';
import { ASSET_SUBTYPES, ASSET_TYPES, ROUTE_PATHS } from '../constants';
import { IAsset } from '../models/asset';
import { IsEmptyString } from '../utils';

const InsurancePoliciesPage = () => {
    const [formState, setFormState] = useRecoilState<IInsurancePolicyState[]>(insurancePoliciesState);
    const [validationState, setValidationState] = useRecoilState<IInsurancePolicyValidationState[]>(insurancePoliciesValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const saveInsurancePolicyAsync = async (insurancePolicy: IInsurancePolicyState, index: number) => {
        var data: IAsset = {
            id: insurancePolicy.id,
            type: ASSET_TYPES.FINANCIAL_ASSETS,
            subtype: ASSET_SUBTYPES.INSURANCE_POLICIES,
            userId: user.userId,
            data: insurancePolicy
        }
        var upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    }

    const deleteInsurancePolicy = async (index: number) => {
        if (formState[index].id !== ""
            && formState[index].id !== undefined
        ) {
            await deleteAsset(formState[index].id);
        }

        setFormState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );

        setValidationState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );
    }

    const handleBackClick = async () => {
        // NAVIGATE TO PREVIOUS ROUTE
        var routeValue = routeState.find(s => s.nextPath == location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    }

    const setInsurancePolicyValidationState = (index: number, key: keyof IInsurancePolicyValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        var isValid: boolean = true;
        formState.forEach((prop, index) => {
            if (IsEmptyString(prop.insuranceType)) {
                setInsurancePolicyValidationState(index, "insuranceType", "insurance type is required");
                isValid = false;
            }

            if (IsEmptyString(prop.insuranceProvider)) {
                setInsurancePolicyValidationState(index, "insuranceProvider", "insurance provider is required");
                isValid = false;
            }

            if (IsEmptyString(prop.policyNumber)) {
                setInsurancePolicyValidationState(index, "policyNumber", "policy number is required");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    }

    const handleNextClick = async () => {
        // VALIDATE
        if (!validate()) return;

        // SAVE PROPERTIES
        formState.forEach(async (insurancePolicy, index) => {
            await saveInsurancePolicyAsync(insurancePolicy, index);
        })

        // NAVIGATE TO NEXT ROUTE
        var routeValue = routeState.find(s => location.pathname.includes(s.currentPath));
        navigate(ROUTE_PATHS.YOUR_WILL + (routeValue?.nextPath ?? ROUTE_PATHS.LIABILITIES));
    }

    const addInsurancePolicy = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                insuranceType: "",
                insuranceProvider: "",
                policyNumber: ""
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyInsurancePoliciesValidationState
        ])
        setCurrentItem(formState.length);
    };

    const getSubTitle = (index: number) => {
        const { insuranceType, insuranceProvider } = formState[index];
        const firstLine = insuranceType?.trim() || "";
        const secondLine = insuranceProvider.trim() || "";
        return [firstLine, secondLine].filter(Boolean).join("\n");
    }

    const shouldExpandAccordion = (index: number) => {
        return currentItem === index
    }

    const handleAccordionOnChange = (index: number) => {
        setCurrentItem((prevItem) => prevItem === index ? -1 : index)
        setShowErrorBorder(false);
    }

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <h1 className='text-2xl font-semibold'>Insurance Policies</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`Insurance Policy ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <InsurancePolicyForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <ConfirmDelete onConfirm={() => deleteInsurancePolicy(index)} />
                                )
                            }

                        </div>
                    ))
                }
                <AddButton onClick={addInsurancePolicy} label={`Insurance Policy ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    )
}

export default InsurancePoliciesPage   