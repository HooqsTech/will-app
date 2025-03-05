import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { IOtherLiabilityState, otherLiabilitiesState } from "../../atoms/OtherLiabilitiesState";
import { IOtherLiabilitiesValidationState, otherLiabilitiesvalidationState } from "../../atoms/validationStates/OtherLiabilitiesValidationState";

interface IOtherLiabilityFormProps {
    index: number
}

const OtherLiabilityForm: React.FC<IOtherLiabilityFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IOtherLiabilityState[]>(otherLiabilitiesState);
    const [validationState, setValidationState] = useRecoilState<IOtherLiabilitiesValidationState[]>(otherLiabilitiesvalidationState);
            
    const item = formState[index];
    const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IOtherLiabilityState, value: string) => {
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
                value={item.nameOfLender}
                onChange={(e) => handleChange(index, "nameOfLender", e)}
                label="Name of Lender"
                helperText={validationStateItem.nameOfLender}
                type="text" />
            <CustomTextBox
                value={item.loanAmount}
                onChange={(e) => handleChange(index, "loanAmount", e)}
                label="Loan Amount"
                helperText={validationStateItem.loanAmount}
                type="number" />
            <CustomTextBox
                value={item.remainingAmount}
                onChange={(e) => handleChange(index, "remainingAmount", e)}
                label="Remaining Amount"
                helperText={validationStateItem.remainingAmount}
                type="number" />
            <CustomTextBox
                value={item.accountNumber}
                onChange={(e) => handleChange(index, "accountNumber", e)}
                label="Account Number"
                helperText={validationStateItem.accountNumber}
                type="text" />
            <CustomTextBox
                value={item.description}
                onChange={(e) => handleChange(index, "description", e)}
                label="Description"
                helperText={validationStateItem.description}
                type="text" />
        </CustomFormContainer>
    )
}

export default OtherLiabilityForm