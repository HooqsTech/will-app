import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { IOtherLiabilityState, otherLiabilitiesState } from "../../atoms/OtherLiabilitiesState";

interface IOtherLiabilityFormProps {
    index: number
}

const OtherLiabilityForm: React.FC<IOtherLiabilityFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IOtherLiabilityState[]>(otherLiabilitiesState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IOtherLiabilityState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <CustomTextBox
                value={item.nameOfLender}
                onChange={(e) => handleChange(index, "nameOfLender", e)}
                label="Name of Lender"
                type="text" />
            <CustomTextBox
                value={item.loanAmount}
                onChange={(e) => handleChange(index, "loanAmount", e)}
                label="Loan Amount"
                type="number" />
            <CustomTextBox
                value={item.remainingAmount}
                onChange={(e) => handleChange(index, "remainingAmount", e)}
                label="Remaining Amount"
                type="number" />
            <CustomTextBox
                value={item.accountNumber}
                onChange={(e) => handleChange(index, "accountNumber", e)}
                label="Account Number"
                type="text" />
            <CustomTextBox
                value={item.description}
                onChange={(e) => handleChange(index, "description", e)}
                label="Description"
                type="text" />
        </CustomFormContainer>
    )
}

export default OtherLiabilityForm