import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import { debenturesState, IDebentureState } from "../../atoms/DebenturesState";
import { IDebentureValidationState, debenturesValidationState } from "../../atoms/validationStates/DebentureValidationState";

interface IDebentureFormProps {
    index: number
}

const DebentureForm: React.FC<IDebentureFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IDebentureState[]>(debenturesState);
    const item = formState[index];
    const [validationState, setValidationState] = useRecoilState<IDebentureValidationState[]>(debenturesValidationState);
    const validationStateItem = validationState[index];
    
    const handleChange = (index: number, key: keyof IDebentureState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );

        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: "" } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <CustomSelect
                label="Debenture Type"
                helperText={validationStateItem.type}
                options={["Single", "Joint"]}
                value={item.type}
                onChange={(e) => handleChange(index, "type", e)} />
            <CustomTextBox
                value={item.financialServiceProviderName}
                helperText={validationStateItem.financialServiceProviderName}
                onChange={(e) => handleChange(index, "financialServiceProviderName", e)}
                label="Bank / Financial Service Provider Name"
                type="text" />
            <CustomTextBox
                value={item.certificateNumber}
                helperText={validationStateItem.certificateNumber}
                onChange={(e) => handleChange(index, "certificateNumber", e)}
                label="Certificate / Folio Number"
                type="text" />
        </CustomFormContainer>
    )
}

export default DebentureForm