import { BrowserRouter, Route, Routes } from "react-router"
import Stepper from "./components/Stepper"
import BasicDetails from "./pages/BasicDetails"
import Header from "./components/Header"
import AssetDetails from "./pages/AssetDetails"

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Stepper />
        <Routes>
          <Route path="/" element={<BasicDetails />} />
          <Route path="/asset-details" element={<AssetDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
