import { useRecoilValue } from "recoil";
import { basicDetailsState } from "../atoms/BasicDetailsState";
import CustomButton from "../components/CustomButton";
import PersonalDetailsForm from "../components/Forms/PersonalDetailsForm";
import { createUser } from "../api/user";
import { IPersonalDetails } from "../models/user";

const PersonalDetails = () => {
    const formState = useRecoilValue(basicDetailsState);

    const addUserDetails = () => {
        const userdata: IPersonalDetails = {
            full_name: formState.fullName,
            father_name: formState.fatherName,
            gender: formState.gender,
            dob: formState.dob?.toString() ?? "",
            religion: formState.religion,
            aadhaar_number: formState.aadhaarNumber,
            username: formState.fullName,
            phone_number: formState.phoneNumber ?? ""
          }
        createUser(userdata)
    }
    return (
        <div className="pb-10 flex flex-col items-center">
            <div className="w-lg">
                <PersonalDetailsForm />

                <CustomButton className='mt-5' onClick={addUserDetails} label="Add" />
            </div>
        </div>
    )
}

export default PersonalDetails