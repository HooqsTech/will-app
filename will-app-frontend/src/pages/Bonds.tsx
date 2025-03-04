import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import BondForm from '../components/Forms/BondForm';
import { useState } from 'react';
import AddButton from '../components/AddButton';
import NextButton from '../components/NextButton';
import { bondsState, IBondState } from '../atoms/BondsState';
import { userState } from '../atoms/UserDetailsState';
import { IsEmptyString } from '../utils';
import { emptyBondValidationState, IBondValidationState, bondsValidationState } from '../atoms/validationStates/BondDetailsValidationState';
import { upsertAsset, deleteAsset } from '../api/asset';
import { ASSET_TYPES, ASSET_SUBTYPES } from '../constants';
import DeleteIcon from '@mui/icons-material/Delete';
import BackButton from '../components/BackButton';

const Bonds = () => {
    const [formState, setFormState] = useRecoilState<IBondState[]>(bondsState);
    const [validationState, setValidationState] = useRecoilState<IBondValidationState[]>(bondsValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const [showErrorBorder, setShowErrorBorder] = useState(false);
    const user = useRecoilValue(userState);

    const addBond = () => {
        setFormState((prevState) => [...prevState, {
            id: "",
            type: "",
            financialServiceProviderName: "",
            certificateNumber: ""
        }]);
        setValidationState((prevState) => [...prevState, emptyBondValidationState]);
        setCurrentItem(formState.length);
    };

    const saveBondAsync = async (bond: IBondState, index: number) => {
        const data = {
            id: bond.id,
            type: ASSET_TYPES.FINANCIAL_ASSETS,
            subtype: ASSET_SUBTYPES.BONDS,
            userId: user.userId,
            data: bond
        };
        const upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    };

    const deleteBondAsync = async (index: number) => {
        const isDeleted = await deleteAsset(formState[index].id);
        if (isDeleted) {
            setValidationState((prevValidations) => prevValidations.filter((_, i) => i !== index));
        }
    };

    const setBondValidationState = (index: number, key: keyof IBondValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid = true;
        formState.forEach((bond, index) => {
            if (IsEmptyString(bond.type)) {
                setBondValidationState(index, "type", "Type is required");
                isValid = false;
            }
            if (IsEmptyString(bond.financialServiceProviderName)) {
                setBondValidationState(index, "financialServiceProviderName", "Provider name is required");
                isValid = false;
            }
            if (IsEmptyString(bond.certificateNumber)) {
                setBondValidationState(index, "certificateNumber", "Certificate Number name is required");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    };

    const getBondSubTitle = (index: number) => {
        const { type, financialServiceProviderName, certificateNumber } = formState[index]; 
        const firstLine = type?.trim() || "";
        const secondLine = [financialServiceProviderName?.trim(), certificateNumber?.trim()].filter(Boolean).join(" - ");
        return [firstLine, secondLine].filter(Boolean).join("\n");
    };

    const handleNextClick = async () => {
        if (!validate()) return;
        formState.forEach(async (bond, index) => {
            await saveBondAsync(bond, index);
        });
    };

    const shouldExpandAccordion = (index: number) => currentItem === index;
    
    const handleAccordionOnChange = (index: number) => {
        setCurrentItem((prevItem) => prevItem === index ? -1 : index)
        setShowErrorBorder(false);
    }

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <h1 className='text-2xl font-semibold'>Bonds</h1>
            <div>
                {formState.map((_, index) => (
                    <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                        <div className='w-full h-full'>
                            <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                onChange={() => handleAccordionOnChange(index)}
                                label={`Bond ${index + 1}`}
                                subTitle={
                                    currentItem !== index && !shouldExpandAccordion(index) ? getBondSubTitle(index) : ""
                                }
                            >
                                <BondForm index={index} />
                            </CustomAccordion>
                        </div>
                        {!shouldExpandAccordion(index) && (
                            <button onClick={() => deleteBondAsync(index)} className='p-2 h-full bg-will-green'>
                                <DeleteIcon fontSize="small" className='text-white bg-will-green' />
                            </button>
                        )}
                    </div>
                ))}
                <AddButton onClick={addBond} label={`Bond ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                {/* testing purpose i kept back button Onclick change event */}
                <BackButton label='Back' onClick={handleNextClick}/>
                <NextButton label='Next' onClick={handleNextClick} />
            </div>
        </div>
    );
};

export default Bonds;