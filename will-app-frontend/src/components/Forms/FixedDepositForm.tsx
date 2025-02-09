import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { fixedDepositsState, IFixedDepositState } from "../../atoms/FixedDepositState";

interface IFixedDepositFormProps {
    index: number
}

const FixedDepositForm: React.FC<IFixedDepositFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IFixedDepositState[]>(fixedDepositsState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IFixedDepositState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer formLabel="Fixed Deposit">
            <div>
                <CustomTextBox
                    value={item.noOfHolders}
                    onChange={(e) => handleChange(index, "noOfHolders", e)}
                    label="No of Holders"
                    type="text" />
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

export default FixedDepositForm