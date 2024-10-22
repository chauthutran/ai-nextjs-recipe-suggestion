"use client";

import { useApp } from '@/contexts/AppContext';
import { JSONObject } from '@/lib/definations';
import { useState } from 'react';


export default function CategoriesNavigation({ handleItemOnClick }: { handleItemOnClick: (category: JSONObject) => void }) {

	const { categories } = useApp();
	
    const [selectedCategory, setSelectedCategory] = useState<JSONObject>({}); 

	const handleOnClick = ( category: JSONObject ) => {
		setSelectedCategory(category);
		handleItemOnClick(category);
	}

	if (categories === null) return (<div>Loading ...</div>);

	return (
		<div className="grid grid-cols-3 gap-5 lg:grid-cols-8 md:grid-cols-6">
			{categories.map((category) => (
				<div key={category._id} className={`flex justify-centertransition-all transform cursor-pointer flex-col ${selectedCategory.name === category.name && "border-leaf-green border-b-2"}`} onClick={() => handleOnClick(category)}>
					<div className='pr-3 py-1'>
						{category.icon && <div dangerouslySetInnerHTML={{ __html: category.icon.replace('<svg', '<svg width="32" height="32"'), }} className="w-8 h-8" />}
						<span className="whitespace-nowrap">{category.name}</span>
					</div>
				</div>
			))}
		</div>
	)
};