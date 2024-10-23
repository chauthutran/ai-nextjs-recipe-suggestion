/** The login page for user authentication. Contains the LoginForm component. */

"use client";

import { CiUser } from "react-icons/ci";
import { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { IoKeyOutline } from "react-icons/io5";
import * as Constant from '@/lib/constant';
import * as Utils from "@/lib/utils";
import { useApp } from "@/contexts/AppContext";
import { useUser } from "@/contexts/UserContext";

export default function LoginForm({onSuccess}: {onSuccess: () => void}) {

	const { appPage, setAppPage } = useApp();
	const { user, processStatus, login, error } = useUser();

	const [email, setEmail] = useState("test2@example.com");
	const [password, setPassword] = useState("1234");


	useEffect(() => {
		if (user != null) {
            onSuccess();
			setAppPage(Constant.PAGE_HOME);
		}
	}, [user])

	const handleLoginBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		login(email, password);
	};


	return (
		<div className="w-96 p-4 flex flex-col">
			<div className="mb-4">
				<label
					className="block text-xs font-medium text-gray-900"
					htmlFor="email"
				>
					Email
				</label>
				<div className="relative">
					<input
						className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 "
						id="email"
						type="email"
						name="email"
						value={email}
						placeholder="Enter your email"
						required
						onChange={(e) => { setEmail(e.target.value) }}
					/>
					<CiUser className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"></CiUser>
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
						placeholder="Enter password"
						value={password}
						required
						minLength={4}
						onChange={(e) => { setPassword(e.target.value) }}
					/>
					<IoKeyOutline className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
				</div>
			</div>

			<div className="mb-4">
				<button className="flex w-full flex-row bg-leaf-green px-4 py-2 rounded hover:bg-green-600 text-white" onClick={(e) => handleLoginBtn(e)} >
					<span className="flex-1">Log in</span>
					{processStatus === Constant.RESPONSE_LOGIN_REQUEST && <FaSpinner className="ml-auto h-5" size={20} />}
				</button>
			</div>

			<div className="flex h-8 items-end space-x-1 text-red-500">
				{error != null && <p>{error}</p>}
			</div>

		</div>
	);
}