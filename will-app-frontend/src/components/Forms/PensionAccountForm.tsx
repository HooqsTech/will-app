import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { IPensionAccountState, pensionAccountsState } from "../../atoms/PensionAccountsState";
import { IPensionAccountValidationState, pensionAccountValidationState } from "../../atoms/validationStates/PensionAccountValidationState";

interface IPensionAccountFormProps {
    index: number
}

const PensionAccountForm: React.FC<IPensionAccountFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IPensionAccountState[]>(pensionAccountsState);
    const [validationState, setValidationState] = useRecoilState<IPensionAccountValidationState[]>(pensionAccountValidationState);
        
        const item = formState[index];
        const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IPensionAccountState, value: string) => {
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
                value={item.schemeName}
                onChange={(e) => handleChange(index, "schemeName", e)}
                helperText={validationStateItem.schemeName}
                label="Scheme Name"
                type="text" />
            <CustomTextBox
                value={item.bankName}
                onChange={(e) => handleChange(index, "bankName", e)}
                helperText={validationStateItem.bankName}
                label="Bank Name"
                type="text" />
        </CustomFormContainer>
    )
}

export default PensionAccountForm