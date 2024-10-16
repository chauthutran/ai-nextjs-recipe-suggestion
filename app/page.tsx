"use client";


import AppWrapper from './ui/AppWrapper';
import { IngredientProvider } from './contexts/IngredientContext';
import { RecipeProvider } from './contexts/RecipeContext';
import Header from './ui/layout/Header';
import Footer from './ui/layout/Footer';
import { CategoryProvider } from './contexts/CategoryContext';


export default function RecipeGenerator() {

	return (
		<div className="flex h-screen flex-col">
			<CategoryProvider>
				<IngredientProvider>
					<RecipeProvider>
						<Header />

						<main className="flex-1 flex">
							<AppWrapper />
						</main>

						<Footer />
					</RecipeProvider>
				</IngredientProvider>
			</CategoryProvider>
		</div>
	);
}
