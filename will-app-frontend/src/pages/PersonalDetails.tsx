import CustomButton from "../components/CustomButton";
import PersonalDetailsForm from "../components/Forms/PersonalDetailsForm";
import { useNavigate } from "react-router";


const PersonalDetails = () => {
    
    const navigate = useNavigate();

    const addUserDetails = () => {
       
        navigate("/address_details");
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