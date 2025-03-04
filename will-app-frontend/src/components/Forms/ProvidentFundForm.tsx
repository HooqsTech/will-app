import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { IProvidentFundState, providentFundsState } from "../../atoms/ProvidentFundsState";
import CustomSelect from "../CustomSelect";
import { IProvidentFundValidationState, providentFundValidationState } from "../../atoms/validationStates/ProvidentValidationState";

interface IFixedDepositFormProps {
    index: number
}

const ProvidentFundForm: React.FC<IFixedDepositFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IProvidentFundState[]>(providentFundsState);
    const [validationState, setValidationState] = useRecoilState<IProvidentFundValidationState[]>(providentFundValidationState);
        
        const item = formState[index];
        const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IProvidentFundState, value: string) => {
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
                options={["EPF", "GPF", "PPF"]}
                value={item.type}
                helperText={validationStateItem.type}
                onChange={(e) => handleChange(index, "type", e)} />
            <CustomTextBox
                value={item.bankName}
                helperText={validationStateItem.bankName}
                onChange={(e) => handleChange(index, "bankName", e)}
                label="Bank Name"
                type="text" />
            <CustomTextBox
                value={item.branch}
                helperText={validationStateItem.branch}
                onChange={(e) => handleChange(index, "branch", e)}
                label="Branch"
                type="text" />
            <CustomTextBox
                value={item.city}
                helperText={validationStateItem.city}
                onChange={(e) => handleChange(index, "city", e)}
                label="City"
                type="text" />
        </CustomFormContainer>
    )
}

export default ProvidentFundForm