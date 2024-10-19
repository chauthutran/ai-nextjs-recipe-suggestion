"use client";


import AppWrapper from './ui/AppWrapper';
import { IngredientProvider } from './contexts/IngredientContext';
import { RecipeProvider } from './contexts/RecipeContext';
import Header from './ui/layout/Header';
import Footer from './ui/layout/Footer';
import { CategoryProvider } from './contexts/CategoryContext';
import { AppProvider } from './contexts/AppContext';


export default function RecipeGenerator() {

	return (
		<div className="flex h-screen flex-col">
			<AppProvider>
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
			
			</AppProvider>
		</div>
	);
}
