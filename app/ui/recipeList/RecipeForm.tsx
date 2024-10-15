'use client';

import { useState } from "react";
import * as dbService from '@/lib/mongodb';


export default function RecipeForm() {
    
    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await dbService.createRecipe({ name, imageFile });
        if (response.status === "success") {
            console.log("The message is posted!");
            setImageFile(null);
        }
        else {
            alert(response.message);
        }
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-lg">
            <button className="bg-blue-500" onClick={() => dbService.updateImages()}>Update Images</button>

            
            <h2 className="text-3xl font-bold mb-5 flex items-center justify-center text-center">Post Message</h2>

            <form onSubmit={handleSubmit} action="POST">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-semibold">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        required
                    />
                </div>


                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-semibold mb-1">Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                
                <button
                    type="submit"
                    className="flex bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                >
                    <span className="flex-1">Upload</span>
                    {/* {loading && <FaSpinner className="ml-auto h-5" size={20} />} */}

                </button>
            </form>
        </div>
    )
}