import { useRecoilValue } from "recoil";
import { createUser } from "../api/user";
import CustomButton from "../components/CustomButton";
import AddressDetailsForm from "../components/Forms/AddressDetailsForm";
import { basicDetailsState } from "../atoms/BasicDetailsState";
import { useNavigate } from "react-router";

const AddressDetails = () => {
    const formState = useRecoilValue(basicDetailsState);
    const navigate = useNavigate();
    const addUserDetails = () => {
           
        createUser(formState);
        navigate("/address_details");
        }
    return (
        <div className="pb-10 flex flex-col items-center">
            <div className="w-lg">
                <AddressDetailsForm />
            </div>
            <CustomButton className='mt-5' onClick={addUserDetails} label="Next" />
        </div>
    )
}

export default AddressDetails