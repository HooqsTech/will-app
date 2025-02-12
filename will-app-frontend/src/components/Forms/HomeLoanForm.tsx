import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { homeLoansState, IHomeLoanState } from "../../atoms/HomeLoansState";

interface IHomeLoanFormProps {
    index: number
}

const HomeLoanForm: React.FC<IHomeLoanFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IHomeLoanState[]>(homeLoansState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IHomeLoanState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <CustomTextBox
                value={item.nameOfBank}
                onChange={(e) => handleChange(index, "nameOfBank", e)}
                label="Name of Bank / Institution"
                type="text" />
            <CustomTextBox
                value={item.loanAmount}
                onChange={(e) => handleChange(index, "loanAmount", e)}
                label="Loan Amount"
                type="number" />
            <CustomTextBox
                value={item.accountNumber}
                onChange={(e) => handleChange(index, "accountNumber", e)}
                label="Account Number"
                type="text" />
        </CustomFormContainer>
    )
}

export default HomeLoanForm