import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { dematAccountsState, IDematAccountState } from "../../atoms/DematAccountsState";
import { dematAccountValidationState, IDematAccountValidationState } from "../../atoms/validationStates/DematAccountValidationState";

interface IDematAccountFormProps {
    index: number
}

const DematAccountForm: React.FC<IDematAccountFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IDematAccountState[]>(dematAccountsState);
    const [validationState, setValidationState] = useRecoilState<IDematAccountValidationState[]>(dematAccountValidationState);

    const item = formState[index];
    const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IDematAccountState, value: string) => {
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
                value={item.brokerName}
                helperText={validationStateItem.brokerName}
                required
                onChange={(e) => handleChange(index, "brokerName", e)}
                label="Broker Name"
                type="text" />
            <CustomTextBox
                value={item.accountNumber}
                required
                helperText={validationStateItem.accountNumber}
                onChange={(e) => handleChange(index, "accountNumber", e)}
                label="Account Number"
                type="text" />
        </CustomFormContainer>
    )
}

export default DematAccountForm