import YourWill from "./pages/YourWill"
import { useEffect } from "react"
import { getUser } from "./api/user"
import { useSetRecoilState } from "recoil"
import { userState } from "./atoms/UserDetailsState"
import { personalDetailsState } from "./atoms/PersonalDetailsState"
import { addressDetailsState } from "./atoms/AddressDetailsState"
import { assetRoutesMap, ISelectedAssetsState, selectedAssetsState } from "./atoms/SelectedAssetsState"
import { routesState } from "./atoms/RouteState"
import { IPropertiesState, propertiesState } from "./atoms/PropertiesState"
import { ASSET_SUBTYPES } from "./constants"
import { emptyPropertyValidationState, propertiesValidationState } from "./atoms/validationStates/PropertiesValidationState"
import Header from "./components/Header"


function App() {
  const setUser = useSetRecoilState(userState);
  const setPersonalDetails = useSetRecoilState(personalDetailsState);
  const setAddressDetails = useSetRecoilState(addressDetailsState);
  const setSelectedAssets = useSetRecoilState(selectedAssetsState);

  // PROPERTIES
  const setProperties = useSetRecoilState(propertiesState);
  const setPropertiesValidationState = useSetRecoilState(propertiesValidationState);


  const setRouteState = useSetRecoilState(routesState);

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

    if (user.assets) {
      // SET PROPERTIES
      var properties: IPropertiesState[] = user.assets.filter(s => s.subtype == ASSET_SUBTYPES.PROPERTIES).map((s) => ({ ...s.data, id: s.id }));
      if (properties.length > 0) {
        setProperties(properties)
        setPropertiesValidationState(properties.map(_ => ({...emptyPropertyValidationState})))
      }
    }

    // DYNAMIC ROUTE MAPPING
    generateRouteDataFromSelectedAssets(user.selectedAssets);
  }

  const generateRouteDataFromSelectedAssets = (selectedAssets: ISelectedAssetsState) => {
    const selectedKeys = Object.entries(selectedAssets)
      .filter(([_, value]) => value === true)
      .map(([key]) => key as keyof ISelectedAssetsState)

    const selectedPaths = selectedKeys.map((key) => assetRoutesMap[key]).sort((a, b) => a.order - b.order);

    const routeData = selectedPaths.map((path, index) => ({
      currentPath: path.routePath,
      nextPath: selectedPaths[index + 1]?.routePath || "/", // Last route leads to summary
    }));

    setRouteState(routeData);
  }

  return (
    <div className="font-[frank] w-full">
      <Header />
      <YourWill />
    </div>
  )
}

export default App
