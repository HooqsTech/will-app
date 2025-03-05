import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { bankDetailsState, IBankDetailsState } from "../../atoms/BankDetailsState";
import CustomSelect from "../CustomSelect";
import { bankDetailsValidationState, IBankDetailsValidationState } from "../../atoms/validationStates/BankDetailsValidationState";

interface IBankAccountFormProps {
    index: number
}

const BankAccountForm: React.FC<IBankAccountFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IBankDetailsState[]>(bankDetailsState);
    const [validationState, setValidationState] = useRecoilState<IBankDetailsValidationState[]>(bankDetailsValidationState);

    const item = formState[index];
    const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IBankDetailsState, value: string) => {
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
                label="Account Type"
                helperText={validationStateItem.accountType}
                required
                options={["Single", "Joint"]}
                value={item.accountType}
                onChange={(e) => handleChange(index, "accountType", e)} />
            <CustomTextBox
                value={item.bankName}
                required
                helperText={validationStateItem.bankName}
                onChange={(e) => handleChange(index, "bankName", e)}
                label="Bank Name"
                type="text" />
            <CustomTextBox
                value={item.accountNumber}
                required
                helperText={validationStateItem.accountNumber}
                restrictAlphabets
                onChange={(e) => handleChange(index, "accountNumber", e)}
                label="Account Number"
                type="text" />
            <CustomTextBox
                value={item.branch}
                required
                helperText={validationStateItem.branch}
                onChange={(e) => handleChange(index, "branch", e)}
                label="Branch"
                type="text" />
            <CustomTextBox
                value={item.city}
                required
                helperText={validationStateItem.city}
                onChange={(e) => handleChange(index, "city", e)}
                label="City"
                type="text" />
        </CustomFormContainer>
    )
}

export default BankAccountForm