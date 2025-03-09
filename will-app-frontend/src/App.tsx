import { BrowserRouter, Route, Routes } from "react-router"
import YourWill from "./pages/YourWill"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"

function App() {
  return (
    <div className="font-[frank] w-full">
      <BrowserRouter>
        <Routes>
          <Route path={"your_will/*"} element={<YourWill />} />
          <Route path={"login"} element={<LoginPage />} />
          <Route path={"home"} element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
