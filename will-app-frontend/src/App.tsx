import { BrowserRouter, Route, Routes } from "react-router"
import YourWill from "./pages/YourWill"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <div className="font-[frank] w-full">
      <BrowserRouter>
        <Routes>
          <Route path={"your_will/*"} element={<YourWill />} />
          <Route path={"login"} element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
