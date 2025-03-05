import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { educationLoansState, IEducationLoanState } from "../../atoms/EducationsLoanState";
import { educationLoanValidationState, IEducationLoanValidationState } from "../../atoms/validationStates/EducationLoanValidationState";

interface IEducationLoanFormProps {
    index: number
}

const EducationLoanForm: React.FC<IEducationLoanFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IEducationLoanState[]>(educationLoansState);
    const [validationState, setValidationState] = useRecoilState<IEducationLoanValidationState[]>(educationLoanValidationState);
        
    const item = formState[index];
    const validationStateItem = validationState[index];
    
    const handleChange = (index: number, key: keyof IEducationLoanState, value: string) => {
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
                value={item.nameOfBank}
                onChange={(e) => handleChange(index, "nameOfBank", e)}
                label="Name of Bank / Institution"
                helperText={validationStateItem.nameOfBank}
                type="text" />
            <CustomTextBox
                value={item.loanAmount}
                onChange={(e) => handleChange(index, "loanAmount", e)}
                label="Loan Amount"
                helperText={validationStateItem.loanAmount}
                type="number" />
        </CustomFormContainer>
    )
}

export default EducationLoanForm