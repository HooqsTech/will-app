import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { fixedDepositsState, IFixedDepositState } from "../../atoms/FixedDepositState";
import { fixedDepositsValidationState, IFixedDepositValidationState } from "../../atoms/validationStates/FixedDepositValidationState";

interface IFixedDepositFormProps {
    index: number
}

const FixedDepositForm: React.FC<IFixedDepositFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IFixedDepositState[]>(fixedDepositsState);
    const [validationState, setValidationState] = useRecoilState<IFixedDepositValidationState[]>(fixedDepositsValidationState);

    const item = formState[index];
    const validationItem = validationState[index];

    const handleChange = (index: number, key: keyof IFixedDepositState, value: string) => {
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
                value={item.noOfHolders}
                helperText={validationItem.noOfHolders}
                required
                restrictAlphabets
                maxLength={2}
                onChange={(e) => handleChange(index, "noOfHolders", e)}
                label="No of Holders"
                type="text" />
            <CustomTextBox
                value={item.bankName}
                helperText={validationItem.bankName}
                required
                onChange={(e) => handleChange(index, "bankName", e)}
                label="Bank Name"
                type="text" />
            <CustomTextBox
                value={item.accountNumber}
                restrictAlphabets
                helperText={validationItem.accountNumber}
                required
                onChange={(e) => handleChange(index, "accountNumber", e)}
                label="Account Number"
                type="text" />
            <CustomTextBox
                value={item.branch}
                helperText={validationItem.branch}
                required
                onChange={(e) => handleChange(index, "branch", e)}
                label="Branch"
                type="text" />
            <CustomTextBox
                value={item.city}
                helperText={validationItem.city}
                required
                onChange={(e) => handleChange(index, "city", e)}
                label="City"
                type="text" />
        </CustomFormContainer>
    )
}

export default FixedDepositForm