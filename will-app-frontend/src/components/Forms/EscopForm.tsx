import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { escopsState, IEscopState } from "../../atoms/EscopsState";
import { escopsValidationState, IEscopValidationState } from "../../atoms/validationStates/EscopsDetailsValidationState";

interface IEscopFormProps {
    index: number
}

const EscopForm: React.FC<IEscopFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IEscopState[]>(escopsState);
    const item = formState[index];
    const [validationState, setValidationState] = useRecoilState<IEscopValidationState[]>(escopsValidationState);
    const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IEscopState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );

        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: "" } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <CustomTextBox
                helperText={validationStateItem.companyName}
                value={item.companyName}
                onChange={(e) => handleChange(index, "companyName", e)}
                label="Company Name"
                type="text" />
            <CustomTextBox
                helperText={validationStateItem.noOfUnitGraged}
                value={item.noOfUnitGraged}
                onChange={(e) => handleChange(index, "noOfUnitGraged", e)}
                label="Number of Unit Graged"
                type="text" />
            <CustomTextBox
                helperText={validationStateItem.noOfVestedEscops}
                value={item.noOfVestedEscops}
                onChange={(e) => handleChange(index, "noOfVestedEscops", e)}
                label="Number of Vested ESCOPs"
                type="text" />
            <CustomTextBox
                helperText={validationStateItem.noOfUnVestedEscops}
                value={item.noOfUnVestedEscops}
                onChange={(e) => handleChange(index, "noOfUnVestedEscops", e)}
                label="Number of UnVested ESCOPs"
                type="text" />
        </CustomFormContainer>
    )
}

export default EscopForm