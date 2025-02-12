import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { IPensionAccountState, pensionAccountsState } from "../../atoms/PensionAccountsState";

interface IPensionAccountFormProps {
    index: number
}

const PensionAccountForm: React.FC<IPensionAccountFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IPensionAccountState[]>(pensionAccountsState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IPensionAccountState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <CustomTextBox
                value={item.schemeName}
                onChange={(e) => handleChange(index, "schemeName", e)}
                label="Scheme Name"
                type="text" />
            <CustomTextBox
                value={item.bankName}
                onChange={(e) => handleChange(index, "bankName", e)}
                label="Bank Name"
                type="text" />
        </CustomFormContainer>
    )
}

export default PensionAccountForm