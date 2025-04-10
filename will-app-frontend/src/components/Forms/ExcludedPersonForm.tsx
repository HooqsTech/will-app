import { useRecoilState } from "recoil";
import { excludedPersonsState, IExcludedPersonState } from "../../atoms/ExcludedPersonsState";
import { excludedPersonsValidationState, IExcludedPersonValidationState } from "../../atoms/validationStates/ExcludedPersonsValidationState";
import CustomFormContainer from "../CustomFormContainer";
import CustomTextBox from "../CustomTextBox";
import CustomSelect from "../CustomSelect";
import { RELATIONSHIP } from "../../utils";

interface IExcludedPersonFormProps {
    index: number
}

const ExcludedPersonForm: React.FC<IExcludedPersonFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IExcludedPersonState[]>(excludedPersonsState);
    const [validationState, setValidationState] = useRecoilState<IExcludedPersonValidationState[]>(excludedPersonsValidationState);

    const item = formState[index];
    const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IExcludedPersonState, value: string) => {
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
                value={item.fullName}
                onChange={(e) => handleChange(index, "fullName", e)}
                label="Full Name"
                required
                helperText={validationStateItem.fullName}
                type="text" />
            <CustomSelect
                label="Relationship"
                options={RELATIONSHIP}
                helperText={validationStateItem.relationship ?? ""}
                value={item.relationship}
                onChange={(e) => handleChange(index, "relationship", e)} />
            <CustomTextBox
                value={item.reason}
                required
                onChange={(e) => handleChange(index, "reason", e)}
                label="Reason"
                helperText={validationStateItem.reason}
                type="text" />
        </CustomFormContainer>
    )
}

export default ExcludedPersonForm