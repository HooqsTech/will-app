import PersonalDetailsForm from "../components/Forms/PersonalDetailsForm";
import AddressDetailsForm from "../components/Forms/AddressDetailsForm";

const BasicDetails = () => {
    return (
        <div className="pb-10 flex flex-col items-center">
            <div className="w-lg">
                <PersonalDetailsForm />
            </div>
            <div className="w-lg">
                <AddressDetailsForm />
            </div>
        </div>
    )
}

export default BasicDetails