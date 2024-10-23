"use client";

import { JSONObject } from '@/lib/definations';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as Utils from "@/lib/utils";
import User from '@/lib/mongodb/schemas/User.schema';
import * as Encrypt from "./encryptPassword";
import * as Constant from "@/lib/constant";
import * as dbService from "@/lib/mongodb";



interface UserContextProps {
	user: JSONObject | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	register: (user: JSONObject) => Promise<void>;
	setUser: (user: JSONObject | null) => void,
	
	processStatus: string;
	error: string | null;
}

const UserContext = createContext<UserContextProps>({
	user: null,
	login: async () => { },
	logout: () => { },
	register: async(user: JSONObject) => {},
	setUser: (user: JSONObject | null) => {},
	
	processStatus: "",
	error: null
});

export const useUser = (): UserContextProps => {
	const context = useContext(UserContext);
	if (!context) {
	  throw new Error('useUser must be used within an UserProvider');
	}
	return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<JSONObject | null>(null);
    
	const [error, setError] = useState<string | null>(null);
	const [processStatus, setProcessStatus] = useState<string>("");

	const login = async (email: string, password: string) => {
		setProcessStatus(Constant.RESPONSE_LOGIN_REQUEST);
		setError(null);

		const response: JSONObject = await dbService.login({email, password});
        console.log(response);
		if (response.status === "success")  {
			setProcessStatus(Constant.RESPONSE_LOGIN_SUCCESS);
			setUser(response.data);
		}
		else {
			setProcessStatus(Constant.RESPONSE_LOGIN_FAILURE);
		}
	};

	const logout = () => {
		setUser(null);
	}

	const register = async(user: JSONObject) => {
		setProcessStatus(Constant.RESPONSE_REGISTRATION_REQUEST);
		setError(null);

		const response: JSONObject = await dbService.register(user);
		if (response.status === "success")  {
			setProcessStatus(Constant.RESPONSE_REGISTRATION_SUCCESS);
			setUser(response.data);
		}
		else {
			setProcessStatus(Constant.RESPONSE_REGISTRATION_FAILURE);
		}
	}

	return (
		<UserContext.Provider value={{ user, setUser, processStatus, error, login, logout, register }}>
			{children}
		</UserContext.Provider>
	);
};