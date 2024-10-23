"use client";

import { useApp } from '@/contexts/AppContext';
import { JSONObject } from '@/lib/definations';
import { useState } from 'react';
import * as Constant from "@/lib/constant";


export default function CategoriesNavigation({ handleItemOnClick }: { handleItemOnClick: (category: JSONObject) => void }) {

	const { categories } = useApp();
    const { appPage } = useApp();

	const initCategory = (appPage.name === Constant.PAGE_RECIPES_BY_CATEGORY && appPage.data !== null ) ? appPage.data : {};

    const [selectedCategory, setSelectedCategory] = useState<JSONObject>(initCategory); 

	const handleOnClick = ( category: JSONObject ) => {
		setSelectedCategory(category);
		handleItemOnClick(category);
	}

	if (categories === null) return (<div>Loading ...</div>);

	return (
		<div className="grid grid-cols-3 gap-5 lg:grid-cols-8 md:grid-cols-6 items-center justify-center ">
			{categories.map((category) => (
				<div key={category._id} className={`flex flex-col items-center justify-center py-2 px-2 transition-all transform cursor-pointer ${selectedCategory.name === category.name && "border-leaf-green border-b-2"}`} onClick={() => handleOnClick(category)}>
					{category.icon && <div dangerouslySetInnerHTML={{ __html: category.icon.replace('<svg', '<svg width="32" height="32"'), }} />}
					<span className="whitespace-nowrap">{category.name}</span>
				</div>
			))}
		</div>
	)
};