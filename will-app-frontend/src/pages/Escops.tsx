import { useRecoilState, useRecoilValue } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import EscopForm from '../components/Forms/EscopForm';
import { escopsState, IEscopState } from '../atoms/EscopsState';
import { userState } from '../atoms/UserDetailsState';
import { IsEmptyString } from '../utils';
import { emptyEscopValidationState, IEscopValidationState, escopsValidationState } from '../atoms/validationStates/EscopsDetailsValidationState';
import { upsertAsset, deleteAsset } from '../api/asset';
import { ASSET_TYPES, ASSET_SUBTYPES } from '../constants';
import DeleteIcon from '@mui/icons-material/Delete';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';

const Escops = () => {
    const [formState, setFormState] = useRecoilState<IEscopState[]>(escopsState);
    const [validationState, setValidationState] = useRecoilState<IEscopValidationState[]>(escopsValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const [showErrorBorder, setShowErrorBorder] = useState(false);
    const user = useRecoilValue(userState);

    const shouldExpandAccordion = (index: number) => currentItem === index;

    const getEscopSubTitle = (index: number) => {
        const { companyName, noOfUnitGraged, noOfVestedEscops, noOfUnVestedEscops } = formState[index]; 
        const firstLine = companyName?.trim() || "";
        const secondLine = [
            noOfUnitGraged ? `Units Graded: ${noOfUnitGraged}` : "",
            noOfVestedEscops ? `Vested: ${noOfVestedEscops}` : "",
            noOfUnVestedEscops ? `Unvested: ${noOfUnVestedEscops}` : ""
        ].filter(Boolean).join(" - ");
        
        return [firstLine, secondLine].filter(Boolean).join("\n");
    };

    const addItem = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                companyName: "",
                noOfUnitGraged: "",
                noOfVestedEscops: "",
                noOfUnVestedEscops: "",
            },
        ]);
        setValidationState((prevState) => [...prevState, emptyEscopValidationState]);
        setCurrentItem(formState.length);
    };

    const saveEscopAsync = async (escop: IEscopState, index: number) => {
        const data = {
            id: escop.id,
            type: ASSET_TYPES.FINANCIAL_ASSETS,
            subtype: ASSET_SUBTYPES.ESCOPS,
            userId: user.userId,
            data: escop
        };
        const upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    };

    const deleteEscopAsync = async (index: number) => {
        const isDeleted = await deleteAsset(formState[index].id);
        if (isDeleted) {
            setFormState((prevItems) => prevItems.filter((_, i) => i !== index));
            setValidationState((prevValidations) => prevValidations.filter((_, i) => i !== index));
        }
    };

    const setEscopValidationState = (index: number, key: keyof IEscopValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid = true;
        formState.forEach((escop, index) => {
            if (IsEmptyString(escop.companyName)) {
                setEscopValidationState(index, "companyName", "Company Name is required");
                isValid = false;
            }
            if (IsEmptyString(escop.noOfUnitGraged)) {
                setEscopValidationState(index, "noOfUnitGraged", "No. of Unit Graged is required");
                isValid = false;
            }
            if (IsEmptyString(escop.noOfVestedEscops)) {
                setEscopValidationState(index, "noOfVestedEscops", "No. of Vested Escops is required");
                isValid = false;
            }
            if (IsEmptyString(escop.noOfUnVestedEscops)) {
                setEscopValidationState(index, "noOfUnVestedEscops", "No. of UnVested Escops is required");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    };

    const handleNextClick = async () => {
        if (!validate()) return;
        formState.forEach(async (escop, index) => {
            await saveEscopAsync(escop, index);
        });
    };

    const handleAccordionOnChange = (index: number) => {
        setCurrentItem((prevItem) => (prevItem === index ? -1 : index));
        setShowErrorBorder(false);
    };

    return (
        <div className="flex flex-col justify-start h-full space-y-3 w-xl m-auto">
    <h1 className="text-2xl font-semibold">ESCOP</h1>
    <div>
        {formState.map((_, index) => (
            <div key={formState[index].id} className="flex w-full justify-between items-center space-x-1 h-fit">
                <div className="w-full h-full">
                    <CustomAccordion
                        expanded={shouldExpandAccordion(index)}
                        error={showErrorBorder && Object.values(validationState[index]).some(s => s !== undefined && s !== null && s !== "")}
                        onChange={() => handleAccordionOnChange(index)}
                        label={`ESCOP ${index + 1}`}
                        subTitle={currentItem !== index && !shouldExpandAccordion(index) ? getEscopSubTitle(index) : ""}
                    >
                        <EscopForm index={index} />
                    </CustomAccordion>
                </div>
                {!shouldExpandAccordion(index) && (
                    <button onClick={() => deleteEscopAsync(index)} className="p-2 h-full bg-will-green">
                        <DeleteIcon fontSize="small" className="text-white" />
                    </button>
                )}
            </div>
        ))}
                <AddButton onClick={addItem} label={`Add ESCOP ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                {/* testing purpose i kept back button Onclick change event */}
                <BackButton label='Back' onClick={handleNextClick}/>
                <NextButton label='Next' onClick={handleNextClick} />
            </div>
        </div>
    );
};

export default Escops;