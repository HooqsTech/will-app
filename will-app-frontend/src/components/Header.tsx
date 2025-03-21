import CustomButton from "./CustomButton"
import { useNavigate } from 'react-router';
import { removeCookie } from 'typescript-cookie';
import Sidebar2 from "./Sidebar2";
import { Drawer } from "@mui/material";
import { useRecoilState } from "recoil";
import { drawerState } from "../atoms/drawerState";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        removeCookie('idToken'); // Removes the 'idToken' cookie
        removeCookie('phoneNumber');
        navigate('/login');
    };

    const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(drawerState);

    return (
        <nav className="bg-white top-0 w-full sticky z-50 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
            <div className="flex m-auto w-full items-center justify-between p-4">
                <a href="/" className="flex items-center space-x-3">
                    <img src="/assets/hamara-logo-icon.png" className="h-10" alt="Flowbite Logo" />
                    <span className="self-center text-2xl text-will-green whitespace-nowrap uppercase">Hamara Will</span>
                </a>
                <button onClick={() => setIsDrawerOpen(true)} data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 items-center rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm md:p-0" aria-current="page">Dashboard</a>
                        </li>
                        <li>
                            <a href="/my_plan" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:border-0  md:p-0 ">My Plans</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:border-0  md:p-0 ">Contact Us</a>
                        </li>
                        <li>
                            <CustomButton label="Log Out" onClick={handleLogout} />
                        </li>
                    </ul>
                </div>
            </div>
            <Drawer className="md:hidden" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <div className='bg-[#265e55] col-span-3'>
                    <div className='top-14 min-h-screen sticky'>
                        <Sidebar2 />
                    </div>
                </div>
            </Drawer>
        </nav>
    )
}

export default Header