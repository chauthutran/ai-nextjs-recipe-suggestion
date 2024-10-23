/** The login page for user authentication. Contains the LoginForm component. */

"use client";

import { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { IoKeyOutline } from "react-icons/io5";
import * as Constant from '@/lib/constant';
import { useUser } from "@/contexts/UserContext";
import { useApp } from '@/contexts/AppContext';

export default function RegisterForm() {

	
	const { appPage, setAppPage } = useApp();
	const { user, processStatus, register, error } = useUser();


	const [email, setEmail] = useState("");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState<string | null>(null);


	useEffect(() => {
	  if( user != null ) {
		setAppPage(Constant.PAGE_HOME);
	  }
	},[user])

	const handleRegisterBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if( checkValidUser() ){
			register( {email, password} );
		}
	};

	
    const validateConfirmPassword = (password: string, confirmPassword: string) => {
        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match!');
        } else {
            setErrorMsg(null);
        }
    };


    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = e.target.value;
        setPassword(newPassword);
        validateConfirmPassword(newPassword, confirmPassword);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        validateConfirmPassword(password, newConfirmPassword);
    };
	
	const checkValidUser = () => {
		return( email !== "" && password !== "" && confirmPassword === password );
	}

    const handleCancelBtn = () => {
        // const ok = confirm("Are you sure you don't want to register an account ?")
        // if( ok ) {
        //     setMainPage(Constant.PAGE_EXPENSE);
        // }
    }

	return (
		<div className="max-w-md mx-auto p-8 h-[calc(100vh-138px)]">
			<h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

			<div className="mb-4">
				<label
					className="block text-xs font-medium text-gray-900"
					htmlFor="email"
				>
					Email
				</label>
				<div className="relative">
					<input
						className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
						id="email"
						type="text"
						name="email"
						value={email}
						required
						minLength={4}
						placeholder="Enter your email"
						onChange={(e) => { setEmail(e.target.value) }}
					/>
					<IoKeyOutline className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
					
					{email === "" && <span className="text-red-500 italic text-sm">* This field is required</span>}
				</div>
			</div>

			<div className="mb-4">
				<label
					className="block text-xs font-medium text-gray-900"
					htmlFor="password"
				>
					Password
				</label>
				<div className="relative">
					<input
						className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
						id="password"
						type="password"
						name="password"
						value={password}
						required
						minLength={4}
						placeholder="Enter your password"
						onChange={handlePasswordChange}
					/>
					<IoKeyOutline className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
					
					{password === "" && <span className="text-red-500 italic text-sm">* This field is required</span>}
				</div>
			</div>
			
			<div className="mb-4">
				<label
					className="block text-xs font-medium text-gray-900"
					htmlFor="confirmPassword"
				>
					Confirm Password
				</label>
				<div className="relative">
					<input
						className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
						id="confirmPassword"
						type="password"
						name="confirmPassword"
						value={confirmPassword}
						required
						minLength={4}
						placeholder="Confirm Password"
						onChange={handleConfirmPasswordChange}
					/>
					<IoKeyOutline className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

					{errorMsg !== null && <span className="text-red-500 italic text-sm">{errorMsg}</span>}
				</div>
			</div>

			<div className="mb-4">
				<button className="flex w-full flex-row bg-gold px-4 py-2 rounded hover:bg-yellow-300" onClick={(e) => handleRegisterBtn(e)} >
					<span className="flex-1">Register</span>
					{processStatus === Constant.RESPONSE_REGISTRATION_REQUEST && <FaSpinner className="ml-auto h-5 text-gray-50" size={20} />}
				</button>
			</div>

			<div className="flex h-8 items-end space-x-1">
				{error !== null && <p>{error}</p>}
			</div>

		</div>
	);
}