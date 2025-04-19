import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import CustomDatePicker from "../CustomDatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/plugin/relativeTime";
import { executorValidationState, IExecutorValidationState } from "../../atoms/validationStates/ExecutorValidationState";
import { executorState, IExecutorState } from "../../atoms/ExecutorState";

interface IExecutorFormProps {
    index: number,
}

const ExecutorForm: React.FC<IExecutorFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IExecutorState[]>(executorState);
    const [validationState, setValidationState] = useRecoilState<IExecutorValidationState[]>(executorValidationState);

    const item = formState[index];
    const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IExecutorState, value: string | Dayjs | null) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: "" } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <CustomSelect
                label="Title"
                required
                options={["Mr", "Ms", "Mrs"]}
                helperText={validationStateItem.title}
                value={item.title}
                onChange={(e) => handleChange(index, "title", e)} />
            <CustomTextBox
                value={item.firstName}
                onChange={(e) => handleChange(index, "firstName", e)}
                label="First Name"
                helperText={validationStateItem.firstName}
                type="text" />
            <CustomTextBox
                value={item.lastName}
                onChange={(e) => handleChange(index, "lastName", e)}
                label="Last Name"
                helperText={validationStateItem.lastName}
                type="text" />
            <CustomSelect
                label="Gender"
                options={["Male", "Female", "Others"]}
                value={item.gender}
                helperText={validationStateItem.gender}
                onChange={(e) => handleChange(index, "gender", e)} />
            <CustomDatePicker
                onChange={(e) => handleChange(index, "dob", e)}
                value={item.dob ? dayjs(item.dob) : null}
                helperText={validationStateItem.dob}
                label="DOB" />
            <CustomTextBox
                value={item.email}
                onChange={(e) => handleChange(index, "email", e)}
                helperText={validationStateItem.email}
                label={"Email"}
                type="text" />
            <CustomTextBox
                value={item.aadhaarNumber}
                maxLength={12}
                onChange={(e) => handleChange(index, "aadhaarNumber", e)}
                helperText={validationStateItem.aadhaarNumber}
                restrictAlphabets
                label={"Aadhaar Number"}
                type="text" />
            <CustomTextBox
                value={item.phoneNumber}
                onChange={(e) => handleChange(index, "phoneNumber", e)}
                helperText={validationStateItem.phoneNumber}
                label="Phone"
                restrictAlphabets
                maxLength={10}
                type="text" />
        </CustomFormContainer>
    )
}

export default ExecutorForm;