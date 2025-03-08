import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { ILoginState, loginState } from '../atoms/LoginState';
import { useRecoilState } from 'recoil';
import OtpInput from 'react-otp-input';
import { auth } from "../../firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useEffect, useState } from 'react';
import { verifyToken } from '../api/user';

const LoginPage = () => {
    const [formState, setFormState] = useRecoilState<ILoginState>(loginState);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>();
    useEffect(() => {
        if (!recaptchaVerifier) {
          const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: (response:any) => {
              console.log("reCAPTCHA resolved:", response);
            },
          });
          setRecaptchaVerifier(verifier); // Store in state to prevent re-initialization
        }
      }, [recaptchaVerifier]);
    
    const sendOtp = async () => {
       
        try {
            if (!formState.phoneNumber) {
                console.log("Please enter a phone number.");
                return;
            }

            if (!recaptchaVerifier) {
                console.log("Error: reCAPTCHA not initialized.");
                return;
            }

            const confirmation = await signInWithPhoneNumber(auth, "+"+formState.phoneNumber, recaptchaVerifier);
            setFormState((prevState) => ({
                ...prevState,
                showOTP: true,
                confirmationResult: confirmation
                }))
            console.log(confirmation);
        } catch (error) {
            console.error("Error sending OTP:", error);
        }
    };

    const verifyOtp = async () => {
        try {
            if (!formState.otp || !formState.confirmationResult) {
                console.log("Please enter OTP.");
                return;
            }

            const userCredential = await formState.confirmationResult.confirm(formState.otp);
            console.log("User verified:", userCredential.user);

            const idToken = await userCredential.user.getIdToken();
            const response = await verifyToken(idToken);

            console.log("User Verified Successfully!");
            console.log("Server response:", response.userId);
        } catch (error) {
            console.error("Error verifying OTP:", error);
        }
    };
    return(
        <div className="p-4 h-screen bg-white border border-gray-200 shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col m-2 h-full w-full bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row max-w-none dark:border-gray-700 dark:bg-gray-800">
                
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
                        <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-md px-20 py-2 mt-8 dark:bg-green-600 dark:hover:bg-green-700" onClick={sendOtp}>Verify Mobile Number</button>
                        <div id="recaptcha-container"></div>
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
                            numInputs={4}
                            renderInput={(props) => <input {...props} onKeyDown={(e) => {
                                if (!/^\d$/.test(e.key) && e.key !== "Backspace") {
                                  e.preventDefault(); // Block non-numeric keys
                                }
                              }} inputMode="numeric" pattern="[0-9]*" className="w-[40px] h-[40px] border border-black m-4 rounded-md text-[20px] font-semibold outline-none" style={{width:"10px !important",textAlign: 'center'}} />}
                        />
                        <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-md px-20 py-2 mt-4 dark:bg-green-600 dark:hover:bg-green-700" onClick={verifyOtp}>Verify OTP</button>
                        <div className='flex mt-4 space-x-3'>
                            <p className=" text-will-green">Didn't receive the OTP?</p>
                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Resend</a>
                        </div>
                    </div>}
                </div>
                <img
                className="object-cover w-full rounded-tr-lg rounded-br-lg h-auto"
                src="https://picsum.photos/200/300"
                alt="Descriptive Alt Text"
                />
            </div>
        </div>

    )
}

export default LoginPage;