// pages/api/generateRecipe.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY as string);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { ingredients } = req.body;

  if (!ingredients) {
    return res.status(400).json({ error: 'Ingredients are required' });
  }

  const prompt = `Generate a recipe based on these ingredients: ${ingredients.join(', ')}`;

  try {
    const response = await hf.textGeneration({
      model: 'gpt2', // or any other model of your choice
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
      },
    });

    const recipe = response.generated_text;
    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
};
