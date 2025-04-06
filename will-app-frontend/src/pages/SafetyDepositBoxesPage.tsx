import ConfirmDelete from "../components/ConfirmDelete";
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { deleteAsset, upsertAsset } from '../api/asset';
import { routesState } from '../atoms/RouteState';
import { ISafetyDepositBoxState, safetyDepositBoxesState } from '../atoms/SafetyDepositBoxesState';
import { userState } from '../atoms/UserDetailsState';
import { emptySafetyDepositBoxesValidationState, ISafetyDepositBoxValidationState, safetyDepositBoxesValidationState } from '../atoms/validationStates/SafetyDepositBoxesValidationState';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import CustomAccordion from '../components/CustomAccordion';
import SafetyDepositBoxForm from '../components/Forms/SafetyDepositBoxForm';
import NextButton from '../components/NextButton';
import { ASSET_SUBTYPES, ASSET_TYPES, ROUTE_PATHS } from '../constants';
import { IAsset } from '../models/asset';
import { IsEmptyString } from '../utils';
import Swal from "sweetalert2";

const SafetyDepositBoxesPage = () => {
    const [formState, setFormState] = useRecoilState<ISafetyDepositBoxState[]>(safetyDepositBoxesState);
    const [validationState, setValidationState] = useRecoilState<ISafetyDepositBoxValidationState[]>(safetyDepositBoxesValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const savePropertyAsync = async (box: ISafetyDepositBoxState, index: number) => {
        var data: IAsset = {
            id: box.id,
            type: ASSET_TYPES.FINANCIAL_ASSETS,
            subtype: ASSET_SUBTYPES.SAFETY_DEPOSIT_BOXES,
            userId: user.userId,
            data: box
        }
        var upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    }

    const deleteSafetyDepositBoxAsync = async (index: number) => {
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

    const setSafetyDepositBoxValidationState = (index: number, key: keyof ISafetyDepositBoxValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        var isValid: boolean = true;
        formState.forEach((prop, index) => {
            if (IsEmptyString(prop.depositBoxType)) {
                setSafetyDepositBoxValidationState(index, "depositBoxType", "box type is required");
                isValid = false;
            }

            if (IsEmptyString(prop.bankName)) {
                setSafetyDepositBoxValidationState(index, "bankName", "bank name is required");
                isValid = false;
            }

            if (IsEmptyString(prop.branch)) {
                setSafetyDepositBoxValidationState(index, "branch", "branch is required");
                isValid = false;
            }

            if (IsEmptyString(prop.state)) {
                setSafetyDepositBoxValidationState(index, "state", "state is required");
                isValid = false;
            }

            if (IsEmptyString(prop.city)) {
                setSafetyDepositBoxValidationState(index, "city", "city is required");
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
            await savePropertyAsync(property, index);
        })

        // NAVIGATE TO NEXT ROUTE
        var routeValue = routeState.find(s => location.pathname.includes(s.currentPath));
        
        if (!routeValue?.nextPath) {
            Swal.fire({
              title: "Are you sure Proceed to Liabilities",
              text: "Ready to move to Liabilities Section? Click No to add more Assets",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "var(--color-will-green)",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, go to Liabilities",
              cancelButtonText: "No",
              customClass: {
                popup: "swal-sm",
                title: "swal-title",
                confirmButton: "swal-confirm-btn",
              },
            }).then((result) => {
              if (result.isConfirmed) {
                navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.LIABILITIES);
              }
              else
              {
                navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.ASSETS)
              }
            });
          } else {
            navigate(ROUTE_PATHS.YOUR_WILL + routeValue.nextPath);
          }
    }

    const addProperty = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                depositBoxType: "",
                bankName: "",
                state: "",
                branch: "",
                city: ""
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptySafetyDepositBoxesValidationState
        ])
        setCurrentItem(formState.length);
    };

    const getSubTitle = (index: number) => {
        const { depositBoxType, bankName, city } = formState[index];
        const firstLine = depositBoxType?.trim() || "";
        const secondLine = [bankName?.trim(), city?.trim()].filter(Boolean).join(" - ");
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
            <h1 className='text-2xl font-semibold'>Safety Deposit Boxes/Lockers</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`Safety Deposit Box / Locker ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <SafetyDepositBoxForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <ConfirmDelete onConfirm={() => deleteSafetyDepositBoxAsync(index)} />
                                )
                            }
                        </div>
                    ))
                }
                <AddButton onClick={addProperty} label={`Safety Deposit Box / Locker ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    )
}

export default SafetyDepositBoxesPage   