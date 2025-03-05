import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { ISafetyDepositBoxState, safetyDepositBoxesState } from "../../atoms/SafetyDepositBoxesState";
import CustomSelect from "../CustomSelect";
import { ISafetyDepositBoxValidationState, safetyDepositBoxesValidationState } from "../../atoms/validationStates/SafetyDepositBoxesValidationState";

interface ISafetyDepositBoxFormProps {
    index: number
}

const SafetyDepositBoxForm: React.FC<ISafetyDepositBoxFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<ISafetyDepositBoxState[]>(safetyDepositBoxesState);
    const [validationState, setValidationState] = useRecoilState<ISafetyDepositBoxValidationState[]>(safetyDepositBoxesValidationState);

    const item = formState[index];
    const validationStateItem = validationState[index];


    const handleChange = (index: number, key: keyof ISafetyDepositBoxState, value: string) => {
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
                label="Type"
                options={["Single", "Joint"]}
                helperText={validationStateItem.depositBoxType}
                required
                value={item.depositBoxType}
                onChange={(e) => handleChange(index, "depositBoxType", e)} />
            <CustomTextBox
                value={item.bankName}
                helperText={validationStateItem.bankName}
                required
                onChange={(e) => handleChange(index, "bankName", e)}
                label="Bank Name"
                type="text" />
            <CustomTextBox
                value={item.branch}
                helperText={validationStateItem.branch}
                required
                onChange={(e) => handleChange(index, "branch", e)}
                label="Branch"
                type="text" />
            <CustomTextBox
                value={item.city}
                helperText={validationStateItem.city}
                required
                onChange={(e) => handleChange(index, "city", e)}
                label="City"
                type="text" />
        </CustomFormContainer>
    )
}

export default SafetyDepositBoxForm