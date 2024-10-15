"use client";


import AppWrapper from './ui/AppWrapper';
import { IngredientProvider } from './contexts/IngredientContext';
import { RecipeProvider } from './contexts/RecipeContext';
import Header from './ui/layout/Header';
import Footer from './ui/layout/Footer';


export default function RecipeGenerator() {

	return (
		<div className="flex h-screen flex-col">
			<IngredientProvider>
				<RecipeProvider>
					<Header />

					<main className="flex-1 flex">
						<AppWrapper />
					</main>

					<Footer />
				</RecipeProvider>
			</IngredientProvider>
		</div>
	);
}
