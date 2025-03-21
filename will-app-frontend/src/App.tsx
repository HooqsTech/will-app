import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router"
import YourWill from "./pages/YourWill"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import { getCookie } from "typescript-cookie";
import MyPlan  from "./pages/MyPlan"

const isAuthenticated = () => {
  const idToken = getCookie('idToken'); // Adjust 'idToken' to match your cookie name
  return !!idToken; // Returns true if token exists, false otherwise
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  return isAuthenticated() ? children : <Navigate to="/login" state={{ from: location }} />;
};

function App() {
  return (
    <div className="font-[frank] w-full">
      <BrowserRouter>
        <Routes>
          <Route path="" element={<ProtectedRoute>
            <Navigate to="/home" />
          </ProtectedRoute>} />
          <Route path="your_will/*" element={<ProtectedRoute><YourWill /></ProtectedRoute>} />
          <Route path="home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="login" element={<LoginPage />} />
          <Route path={"my_plan"} element={<MyPlan />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
