
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { IMutualFundState, mutualFundsState } from '../atoms/MutualFundsState';
import MutualFundForm from '../components/Forms/MutualFundForm';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { useLocation, useNavigate } from 'react-router';
import { routesState } from '../atoms/RouteState';
import { deleteAsset, upsertAsset } from '../api/asset';
import { ASSET_SUBTYPES, ASSET_TYPES, ROUTE_PATHS } from '../constants';
import { IAsset } from '../models/asset';
import { userState } from '../atoms/UserDetailsState';
import { emptyMutualFundsValidationState, IMutualFundValidationState, mutualFundValidationState } from '../atoms/validationStates/MutualFundsValidationState';
import { IsEmptyString } from '../utils';
import ConfirmDelete from "../components/ConfirmDelete";

const MutualFundsPage = () => {
    const [formState, setFormState] = useRecoilState<IMutualFundState[]>(mutualFundsState);
    const [validationState, setValidationState] = useRecoilState<IMutualFundValidationState[]>(mutualFundValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const saveMutualFundAsync = async (property: IMutualFundState, index: number) => {
        let data: IAsset = {
            id: "",
            type: ASSET_TYPES.FINANCIAL_ASSETS,
            subtype: ASSET_SUBTYPES.MUTUAL_FUNDS,
            userId: user.userId,
            data: property
        }
        let upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    }

    const deleteMutualFundAsync = async (index: number) => {
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
        let routeValue = routeState.find(s => s.nextPath == location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    };

    const setPropertyValidationState = (index: number, key: keyof IMutualFundValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid: boolean = true;
        formState.forEach((prop, index) => {
            if (IsEmptyString(prop.fundName)) {
                setPropertyValidationState(index, "fundName", "Fundname is required");
                isValid = false;
            }
            if (IsEmptyString(prop.noOfHolders)) {
                setPropertyValidationState(index, "noOfHolders", "please enter no of holders");
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
        formState.forEach(async (property, index) => {
            await saveMutualFundAsync(property, index);
        })

        // NAVIGATE TO NEXT ROUTE
        let routeValue = routeState.find(s => location.pathname.includes(s.currentPath));
        navigate(ROUTE_PATHS.YOUR_WILL + (routeValue?.nextPath ?? ROUTE_PATHS.LIABILITIES));
    }


    const addMutualFund = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                noOfHolders: "",
                fundName: "",
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyMutualFundsValidationState
        ])
        setCurrentItem(formState.length);
    };


    const getSubTitle = (index: number) => {
        const { fundName, noOfHolders } = formState[index];
        const secondLine = [fundName?.trim(), noOfHolders?.trim()].filter(Boolean).join(" - ");
        return secondLine;
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
            <h1 className='text-2xl font-semibold'>Mutual Funds</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`MUTUAL FUNDS ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <MutualFundForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <ConfirmDelete onConfirm={() => deleteMutualFundAsync(index)} />
                                )
                            }

                        </div>
                    ))
                }
                <AddButton onClick={addMutualFund} label={`MUTUAL FUND ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    )

}

export default MutualFundsPage;  
