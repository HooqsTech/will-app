import { BrowserRouter, Route, Routes } from "react-router"
import BasicDetails from "./pages/BasicDetails"
import Header from "./components/Header"
import AssetDetails from "./pages/AssetDetails"
import YourWill from "./pages/YourWill"


function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/basic-details" element={<BasicDetails />} />
          <Route path="/" element={<YourWill />} />
          <Route path="/asset-details" element={<AssetDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
