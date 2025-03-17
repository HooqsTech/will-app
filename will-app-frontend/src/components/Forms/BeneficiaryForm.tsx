import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import { beneficiariesState, IBeneficiaryState } from "../../atoms/BeneficiariesState";
import CustomDatePicker from "../CustomDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { CHILDREN_ORGANIZATION, GENERAL_ORGANIZATION, OLDAGE_ORGANIZATION, SPIRITUAL_ORGANIZATION } from "../../constants";
import { beneficiariesValidationState, IBeneficiaryValidationState } from "../../atoms/validationStates/BeneficiariesValidationState";
import AddButton from "../AddButton";
import "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";

interface IBankAccountFormProps {
    index: number,
    isGuardian?: boolean,
    addGuardian?: () => void
}

const RELATIONSHIP = ['son ', 'daughter ', 'spouse ', 'mother ', 'father ', 'brother ', 'sister ', 'nephew ', 'niece ', 'grand-son ', 'grand-daughter ', 'daughter-in-law ', 'son-in-law ', 'step-son ', 'step-daughter ']

const BeneficiaryForm: React.FC<IBankAccountFormProps> = ({ index, isGuardian, addGuardian }) => {
    const [formState, setFormState] = useRecoilState<IBeneficiaryState[]>(beneficiariesState);
    const [validationState, setValidationState] = useRecoilState<IBeneficiaryValidationState[]>(beneficiariesValidationState);
    const item = formState[index];
    const validationStateItem = validationState[index];
    const [needsGuardian, setNeedsGuardian] = useState(false);

    useEffect(() => {
        if (item.dateOfBirth !== undefined) {
            var age = dayjs().diff(dayjs(item.dateOfBirth), "year");
            setNeedsGuardian(age <= 18)
        }
    }, [])


    const handleChange = (index: number, key: keyof IBeneficiaryState, value: string | Dayjs | null) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: "" } : item))
        );

        if (key === "dateOfBirth") {
            var age = dayjs().diff(dayjs(value), "year");
            setNeedsGuardian(age <= 18)
        }
    };

    const getOrganizationOptions = () => {
        if (item.charityType === "General") {
            return GENERAL_ORGANIZATION
        }
        else if (item.charityType === "Children") {
            return CHILDREN_ORGANIZATION
        }
        else if (item.charityType === "Old Age") {
            return OLDAGE_ORGANIZATION
        }
        else if (item.charityType === "Spiritual") {
            return SPIRITUAL_ORGANIZATION
        }
        else {
            return ["Other"]
        }
    }

    return (
        <CustomFormContainer hideBorder>
            {
                !item.isGuardian && <CustomSelect
                    label="Beneficiary Type"
                    options={["Person", "Charity"]}
                    value={item.type}
                    helperText={validationStateItem.type}
                    onChange={(e) => handleChange(index, "type", e)} />
            }

            {
                item.type === "Person" &&
                <>
                    <CustomTextBox
                        value={item.fullName}
                        onChange={(e) => handleChange(index, "fullName", e)}
                        label="Full Name"
                        helperText={validationStateItem.fullName}
                        type="text" />
                    <CustomSelect
                        label="Gender"
                        options={["Male", "Female", "Others"]}
                        value={item.gender}
                        helperText={validationStateItem.gender}
                        onChange={(e) => handleChange(index, "gender", e)} />
                    <CustomDatePicker
                        onChange={(e) => handleChange(index, "dateOfBirth", e)}
                        value={item.dateOfBirth ? dayjs(item.dateOfBirth) : null}
                        helperText={validationStateItem.dateOfBirth}
                        label="DOB" />
                    {
                        !isGuardian && needsGuardian && (formState.findIndex(f => f.isGuardian === true) > -1) && (
                            <CustomSelect
                                label="Guardian"
                                options={formState.filter(f => f.isGuardian).map(s => s.fullName)}
                                value={item.guardian ?? ""}
                                helperText={validationStateItem.guardian}
                                onChange={(e) => handleChange(index, "guardian", e)}
                            />

                        )
                    }
                    {
                        !isGuardian && needsGuardian && (<AddButton onClick={addGuardian!} label="Add Guardian" />)
                    }
                    <CustomTextBox
                        value={item.email}
                        onChange={(e) => handleChange(index, "email", e)}
                        helperText={validationStateItem.email}
                        label={"Email"}
                        type="text" />
                    <CustomTextBox
                        value={item.phone}
                        onChange={(e) => handleChange(index, "phone", e)}
                        helperText={validationStateItem.phone}
                        label="Phone"
                        restrictAlphabets
                        maxLength={10}
                        type="text" />
                    <CustomSelect
                        label="Relationship"
                        options={RELATIONSHIP}
                        helperText={validationStateItem.relationship}
                        value={item.relationship}
                        onChange={(e) => handleChange(index, "relationship", e)} />
                </>
            }

            {/* Charity Section */}
            {
                item.type === "Charity" &&
                <>
                    <CustomSelect
                        label="Charity Type"
                        options={[
                            "General",
                            "Children",
                            "Old Age",
                            "Animals",
                            "Medical",
                            "Armed Forces",
                            "Spiritual"
                        ]}
                        value={item.charityType}
                        helperText={validationStateItem.charityType}
                        onChange={(e) => handleChange(index, "charityType", e)} />
                    <CustomSelect
                        label="Organization"
                        options={getOrganizationOptions()}
                        helperText={validationStateItem.organization}
                        value={item.organization}
                        onChange={(e) => handleChange(index, "organization", e)} />
                    {
                        item.organization === "Other" &&
                        <CustomTextBox
                            value={item.otherOrganization}
                            onChange={(e) => handleChange(index, "otherOrganization", e)}
                            label="Other Organization"
                            type="text" />
                    }
                    <CustomTextBox
                        label="Donation Amount"
                        type="text"
                        value={item.donationAmount}
                        helperText={validationStateItem.donationAmount}
                        onChange={(e) => handleChange(index, "donationAmount", e)} />
                </>
            }
        </CustomFormContainer>
    )
}

export default BeneficiaryForm