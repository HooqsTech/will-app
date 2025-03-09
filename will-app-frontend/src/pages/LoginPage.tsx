import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { ILoginState, loginState } from '../atoms/LoginState';
import { useRecoilState } from 'recoil';
import OtpInput from 'react-otp-input';
import { auth } from "../../firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useEffect, useState } from 'react';
import { verifyToken } from '../api/user';
import { getCookie, setCookie } from 'typescript-cookie';
import { useLocation, useNavigate } from 'react-router';
import CustomSnackBar, { TAlertType } from '../components/CustomSnackBar';
import CustomButton from '../components/CustomButton';

const LoginPage = () => {
    const [formState, setFormState] = useRecoilState<ILoginState>(loginState);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>();
    const [timer, setTimer] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState<TAlertType>("info");
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!recaptchaVerifier) {
            const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                size: "invisible",
                callback: (response: any) => {
                    console.log("reCAPTCHA resolved:", response);
                },
            });
            verifier.render().then(() => {
                setRecaptchaVerifier(verifier);
            });
        }
    }, [recaptchaVerifier]);

    useEffect(() => {
        let countdown: any;
        if (timer > 0) {
            countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setIsResendDisabled(false);
            clearInterval(countdown);
        }
        return () => clearInterval(countdown);
    }, [timer]);

    useEffect(() => {
        const idToken = getCookie('idToken');

        if (idToken) {
            // Token is present, redirect to dashboard or another protected route
            navigate(location.state?.from?.pathname || '/home');
        }
    }, [navigate]);

    const handleResend = () => {
        setIsResendDisabled(true);
        sendOtp();
        console.log('OTP resent!');
    };

    const alertOnClose = () => {
        setShowAlert(false);
        setAlertMessage("");
        setAlertType("info");
    }

    const sendOtp = async () => {
        try {
            if (!formState.phoneNumber) {
                setShowAlert(true);
                setAlertMessage("Please enter a phone number.");
                setAlertType("error");
                console.log("Please enter a phone number.");
                return;
            }

            if (!recaptchaVerifier) {
                setShowAlert(true);
                setAlertMessage("Error: reCAPTCHA not initialized.");
                setAlertType("error");
                console.log("Error: reCAPTCHA not initialized.");
                return;
            }
            setLoading(true);

            const confirmation = await signInWithPhoneNumber(auth, "+" + formState.phoneNumber, recaptchaVerifier);
            setFormState((prevState) => ({
                ...prevState,
                showOTP: true,
                confirmationResult: confirmation
            }));
            setTimer(60);
            setShowAlert(true);
            setAlertMessage("OTP Sent Sucessfully!");
            setAlertType("success");
        } catch (error) {
            console.error("Error sending OTP:", error);
            setShowAlert(true);
            setAlertMessage("Error sending OTP. Try Again !!!");
            setAlertType("error");
        }
        setLoading(false);
    };

    const verifyOtp = async () => {
        try {
            if (!formState.otp || !formState.confirmationResult) {
                console.log("Please enter OTP.");
                setShowAlert(true);
                setAlertMessage("Please enter OTP.");
                setAlertType("error");
                return;
            }
            setLoading(true);
            const userCredential = await formState.confirmationResult.confirm(formState.otp);
            console.log("User verified:", userCredential.user);

            const idToken = await userCredential.user.getIdToken();
            const response = await verifyToken(idToken);

            setCookie('idToken', idToken, {
                expires: 1, // Expires in 1 day
                secure: true, // HTTPS only
                sameSite: 'Strict', // Prevent CSRF
                path: '/', // Available for all routes
            });
            setCookie('phoneNumber', "+" + formState.phoneNumber, {
                expires: 1, // Expires in 1 day
                secure: true, // HTTPS only
                sameSite: 'Strict', // Prevent CSRF
                path: '/', // Available for all routes
            });
            console.log("User Verified Successfully!");
            console.log("Server response:", response.userId);
            setShowAlert(true);
            setAlertMessage("OTP Verified Sucessfully!");
            setAlertType("success");
            navigate(location.state?.from?.pathname || '/home');

        } catch (error) {
            setFormState((prevState) => ({
                ...prevState,
                showOTP: false,
                otp: "",
                confirmationResult: undefined
            }));
            setShowAlert(true);
            setAlertMessage("Error verifying OTP. Try Again !!!");
            setAlertType("error");
            console.error("Error verifying OTP:", error);
        }

        setLoading(false);
    };
    return (
        <div className="p-4 h-screen bg-white border border-gray-200 shadow-sm sm:p-6 md:p-8">
            <div className="flex flex-col m-2 h-full w-full bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row max-w-none">

                <div className="flex flex-col items-center p-4  w-full">
                    <div className="flex items-center mt-8 space-x-3">
                        <img src="/assets/hamara-logo-icon.png" className="h-10" alt="Flowbite Logo" />
                        <span className="self-center text-5xl text-will-green whitespace-nowrap uppercase">Hamara Will</span>
                    </div>
                    <p className="text-2xl mt-2 text-will-green">Create your Will with India's most trusted professionals</p>
                    <p className="text-3xl mt-16 font-bold text-will-green uppercase">login</p>
                    {!formState.showOTP && <div className='flex flex-col items-center'>
                        <p className="text-2xl mt-4 text-will-green uppercase">Welcome !</p>
                        <div className='mt-8'>
                            <PhoneInput
                                country={'in'}
                                value={formState.phoneNumber}
                                onChange={(phone) =>
                                    setFormState((prevState) => ({
                                        ...prevState,
                                        phoneNumber: phone,
                                    }))
                                }
                            />
                        </div>
                        <CustomButton loading={loading} label='Send OTP' className="!mt-8" onClick={sendOtp} />
                        <p className=" mt-4 text-will-green">By clicking the above button you agree to receive verification code as SMS.</p>
                    </div>}
                    {formState.showOTP && <div className='flex flex-col items-center'>
                        <p className="text-2xl mt-4 text-will-green uppercase">VERIFICATION CODE</p>
                        <OtpInput
                            value={formState.otp?.toString()}
                            onChange={(otp) =>
                                setFormState((prevState) => ({
                                    ...prevState,
                                    otp: otp,
                                }))}
                            numInputs={6}
                            renderInput={(props) => <input {...props} onKeyDown={(e) => {
                                if (!/^\d$/.test(e.key) && e.key !== "Backspace") {
                                    e.preventDefault(); // Block non-numeric keys
                                }
                            }} inputMode="numeric" pattern="[0-9]*" className="w-[40px] h-[40px] border border-black m-4 rounded-md text-[20px] font-semibold outline-none" style={{ width: "10px !important", textAlign: 'center' }} />}
                        />
                        <CustomButton
                            label='Verify OTP'
                            className="!mt-4"
                            loading={loading}
                            onClick={verifyOtp}
                        >
                        </CustomButton>
                        <div className='flex mt-4 space-x-1'>
                            <p className=" text-will-green">Didn't receive the OTP?</p>
                            <button
                                onClick={handleResend}
                                disabled={isResendDisabled}
                                className={`font-medium cursor-pointer focus:outline-none ${isResendDisabled ? 'text-gray-500' : 'text-blue-500 hover:underline'}`}
                            >
                                {isResendDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                            </button>
                        </div>
                    </div>}
                    <div id="recaptcha-container"></div>
                </div>
                <img
                    className="object-cover w-full rounded-tr-lg rounded-br-lg h-auto"
                    src="https://picsum.photos/200/300"
                    alt="Descriptive Alt Text"
                />
            </div>
            {showAlert && <CustomSnackBar alertType={alertType} message={alertMessage} open={showAlert} onClose={alertOnClose} />}
        </div>

    )
}

export default LoginPage;