import { Modal } from "@mui/material";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";
import { useRecoilValue } from "recoil";
import { getCookie } from "typescript-cookie";
import { pageLoadingState } from "./atoms/PageLoadingState";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyPlan from "./pages/MyPlan";
import OrderConfirmation from "./pages/OrderSummary";
import YourWill from "./pages/YourWill";

const isAuthenticated = () => {
  const idToken = getCookie('idToken'); // Adjust 'idToken' to match your cookie name
  return !!idToken; // Returns true if token exists, false otherwise
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  return isAuthenticated() ? children : <Navigate to="/login" state={{ from: location }} />;
};


function App() {
  const [animationData, setAnimationData] = useState(null);
  const isLoading = useRecoilValue(pageLoadingState);

  useEffect(() => {
    fetch("/assets/loading-lottie.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data));
  }, []);

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
          <Route path={"order_summary"} element={<OrderConfirmation />} />
          OrderConfirmation
        </Routes>
        <Modal className='h-screen flex flex-col items-center justify-center' open={isLoading}>
          <div className='border-none focus:border-none outline-0'>
            <Lottie animationData={animationData} />
          </div>
        </Modal>
      </BrowserRouter>
    </div>
  )
}

export default App
