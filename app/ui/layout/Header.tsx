"use client";

import { useApp } from "@/contexts/AppContext";
import Image from "next/image";
import { GiNoodles } from "react-icons/gi";
import * as Constant from "@/lib/constant";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import Modal from "../basics/Modal";
import LoginForm from "../user/LoginForm";
import { IoClose } from "react-icons/io5";


export default function Header() {

    const { appPage, setAppPage } = useApp();
    const { user, logout } = useUser();
    const [showLoginForm, setShowLoginForm] = useState(false);

    const handleLogout = () => {
        const ok = "Are you sure you want to logout ?";
        if(ok) {
            logout();
        }
    }

    return (
        <>
            <header className="font-montserrat px-10 flex items-center space-x-10 py-3 text-black">
                {/* <div className="flex-1 flex  items-center"> */}
                <div className="flex flex-col items-center justify-center text-leaf-green font-extrabold">
                    <div className="text-2xl">
                        <GiNoodles />
                        {/* <Image
                            src="/images/food-svgrepo-com.svg" // Path from the public folder
                            alt="Logo"
                            width={30} // Set width and height
                            height={100}
                        /> */}
                    </div>
                    <div>AI Recipes</div>
                </div>

                <button className={`${appPage.name === Constant.PAGE_HOME} && border_b border-leaf-green`} onClick={() => setAppPage(Constant.PAGE_HOME)}>Home</button>
                <button className={`${appPage.name ===Constant.PAGE_MEAL_PLAN} && border_b border-leaf-green`} onClick={() => setAppPage(Constant.PAGE_MEAL_PLAN)}>Meal Planner</button>
            
                <button className={`${appPage.name ===Constant.PAGE_RECIPES_BY_CATEGORY} && border_b border-leaf-green`} onClick={() => setAppPage(Constant.PAGE_RECIPES_BY_CATEGORY)}>Categories</button>
                <button>Dietary Preferences</button>
                {user !== null && <>
                    <button>Favorites</button>
                    <button>Recipe Upload</button>
                    <button>Profile</button>
                    <button>Notifications</button>
                    <button className="bg-leaf-green px-3 py-1 text-white rounded" onClick={() => handleLogout()}>Log-out</button>
                </>}
                {user === null && <button className="bg-leaf-green px-3 py-1 text-white rounded" onClick={() => setShowLoginForm(true)}>Login</button>}
                {/* <button className="bg-leaf-green px-3 py-1 text-white rounded-lg" onClick={() => setAppPage(Constant.PAGE_INGREDIENT_BASED_RECIPE_SUGGESTIONS)}>Search</button> */}
                {/* <div>Ingredient-Based Recipe Suggestions</div>
                    <div>Cuisine and Dietary Preferences</div>
                    <div>Meal Planner</div>
                    <div>Nutritional Information</div>
                    <div>Recipe Search and Filters</div>
                    <div>Favorites and Recipe Collections</div>
                    <div>AI-Powered Recipe Suggestions</div>
                    <div>User Reviews and Ratings</div>
                    <div>Recipe Sharing</div>
                    <div>Personalized Notifications</div> */}
                {/* </div> */}
                {/* <div className="ml-auto flex bg-black text-white px-3 py-1">fasd</div> */}
            </header>

            {showLoginForm && <Modal>
                <div className="bg-white rounded">
                    <div className="flex justify-center border-b border-gray-300 p-3 bg-black text-white">
                        <h2 className="flex-1 text-xl font-semibold">Login</h2>
                        <div className="m-auto flex cursor-pointer" onClick={() => setShowLoginForm(false)}><IoClose /></div>
                    </div>
                    <LoginForm onSuccess={() => setShowLoginForm(false)} />
                </div>
            </Modal>}
        </>
    )
}