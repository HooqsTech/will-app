import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { bankDetailsState, IBankDetailsState } from "../../atoms/BankDetailsState";
import CustomSelect from "../CustomSelect";

interface IBankAccountFormProps {
    index: number
}

const BankAccountForm: React.FC<IBankAccountFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IBankDetailsState[]>(bankDetailsState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IBankDetailsState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer formLabel="Bank Account">
            <div>
                <CustomSelect
                    label="Account Type"
                    options={["Single", "Joint"]}
                    value={item.accountType}
                    onChange={(e) => handleChange(index, "accountType", e)} />
                <CustomTextBox
                    value={item.bankName}
                    onChange={(e) => handleChange(index, "bankName", e)}
                    label="Bank Name"
                    type="text" />
                <CustomTextBox
                    value={item.accountNumber}
                    onChange={(e) => handleChange(index, "accountNumber", e)}
                    label="Account Number"
                    type="text" />
                <CustomTextBox
                    value={item.branch}
                    onChange={(e) => handleChange(index, "branch", e)}
                    label="Branch"
                    type="text" />
                <CustomTextBox
                    value={item.city}
                    onChange={(e) => handleChange(index, "city", e)}
                    label="City"
                    type="text" />
            </div>
        </CustomFormContainer>
    )
}

export default BankAccountForm