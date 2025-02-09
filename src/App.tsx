import { BrowserRouter, Route, Routes } from "react-router"
import BasicDetails from "./pages/BasicDetails"
import Header from "./components/Header"
import AssetDetails from "./pages/AssetDetails"
import YourWill from "./pages/YourWill"


function App() {
  return (
    <>
      <Header />
      <YourWill />
    </>
  )
}

export default App
