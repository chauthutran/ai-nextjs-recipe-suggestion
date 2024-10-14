// pages/index.tsx

import * as tf from '@tensorflow/tfjs';
import { useState, useEffect } from 'react';

const RecipePrediction = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [ingredients, setIngredients] = useState<string>('');
  const [prediction, setPrediction] = useState<string | null>(null);

  // Load a pre-trained model or create a model
  useEffect(() => {
    const loadModel = async () => {
      const model = await tf.loadLayersModel('/path/to/your/model.json');
      setModel(model);
    };
    loadModel();
  }, []);

  const predictRecipe = async () => {
    if (!model) return;

    // Convert input ingredients to tensor format
    const inputTensor = tf.tensor([ingredients.split(',').map(ingredient => ingredient.length)]);
    
    // Make prediction
    const output = model.predict(inputTensor) as tf.Tensor;
    
    // Get result from tensor
    const result = await output.data();
    setPrediction(result[0] > 0.5 ? 'Recipe A' : 'Recipe B'); // Dummy result logic
  };

  return (
    <div className="container">
      <h1>Recipe Suggestion</h1>
      <input
        type="text"
        placeholder="Enter ingredients, e.g., apple, chicken, lettuce"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className="input"
      />
      <button onClick={predictRecipe} disabled={!model}>
        Get Recipe Suggestion
      </button>
      {prediction && <p>Suggested Recipe: {prediction}</p>}
    </div>
  );
};

export default RecipePrediction;
