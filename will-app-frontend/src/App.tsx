import YourWill from "./pages/YourWill"
import { useEffect } from "react"
import { getUser } from "./api/user"
import { useSetRecoilState } from "recoil"
import { userState } from "./atoms/UserDetailsState"
import { personalDetailsState } from "./atoms/PersonalDetailsState"
import { addressDetailsState } from "./atoms/AddressDetailsState"
import Header from "./components/Header"
import { selectedAssetsState } from "./atoms/SelectedAssetsState"


function App() {
  const setUser = useSetRecoilState(userState);
  const setPersonalDetails = useSetRecoilState(personalDetailsState);
  const setAddressDetails = useSetRecoilState(addressDetailsState);
  const setSelectedAssets = useSetRecoilState(selectedAssetsState);

  useEffect(() => {
    getUserAndSetState();
  }, [])

  const getUserAndSetState = async () => {
    const user = await getUser("9876543211");

    setUser({
      userId: user.userId
    })

    setPersonalDetails(user.personalDetails);
    setAddressDetails(user.addressDetails);
    
    if (user.selectedAssets) {
      setSelectedAssets(user.selectedAssets);
    }
  }

  return (
    <>
      <Header />
      <YourWill />
    </>
  )
}

export default App
