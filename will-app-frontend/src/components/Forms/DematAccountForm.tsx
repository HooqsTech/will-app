import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { dematAccountsState, IDematAccountState } from "../../atoms/DematAccountsState";

interface IDematAccountFormProps {
    index: number
}

const DematAccountForm: React.FC<IDematAccountFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IDematAccountState[]>(dematAccountsState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IDematAccountState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer formLabel="Demat Account">
            <CustomTextBox
                value={item.brokerName}
                onChange={(e) => handleChange(index, "brokerName", e)}
                label="Broker Name"
                type="text" />
            <CustomTextBox
                value={item.accountNumber}
                onChange={(e) => handleChange(index, "accountNumber", e)}
                label="Account Number"
                type="text" />
        </CustomFormContainer>
    )
}

export default DematAccountForm