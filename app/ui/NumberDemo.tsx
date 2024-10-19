import * as tf from '@tensorflow/tfjs';
import { useState } from 'react';


export default function NumberDemo() {

    const [model, setModel] = useState<tf.Sequential | null>(null);

    // Create a simple dataset (inputs and outputs)
    const inputs = tf.tensor2d([[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]]);
    const outputs = tf.tensor2d([[3], [5], [7], [9], [11], [13]]);


    const createModel = () => {

        // Step 1: Define the Model Structure
        const model = tf.sequential();

        // Add a single dense (fully connected) layer with 1 neuron.
        // This layer will take two input values and produce one output value (the sum).
        model.add(tf.layers.dense({ inputShape: [2], units: 1 }));

        // Step 2: Compile the Model
        model.compile({
            optimizer: 'sgd', // Stochastic Gradient Descent
            loss: 'meanSquaredError', // Loss function for regression tasks
            metrics: ['mse'] // Mean Squared Error as a performance metric
        });

        return model;
    }

    // Early stopping callback
    const earlyStopping = tf.callbacks.earlyStopping({
        monitor: 'val_loss',
        patience: 5, // Number of epochs to wait for improvement before stopping
    });

    // Train the model using the dataset
    const trainModel = async (_model: tf.LayersModel) => {
        // Training process
        const history = await _model.fit(inputs, outputs, {
            epochs: 1000, // Number of epochs (iterations over the dataset)
            verbose: 1, // Display progress
            // validationData: [valInputs, valOutputs], // Validation set
            callbacks: [earlyStopping], // Early stopping to prevent overfitting
        });

        // Print the final loss
        console.log('Training completed!');
        console.log('Final Loss:', history.history.loss[history.history.loss.length - 1]);
    }


    // Make predictions using the trained model
    async function makePrediction() {
        const prediction = model!.predict(tf.tensor2d([[7, 8]])) as tf.Tensor; // Predicting for input [7, 8]
        prediction.print(); // Print the predicted sum
    }


    const loadModel = async () => {
        console.log("Model is loading");
        const _model = createModel();

        await trainModel(_model);
        console.log("Model is loaded");

        setModel(_model); // Store the trained model
    };

    return (
        <div>
            <button className="bg-blue-400 text-white p-3" onClick={() => loadModel()}>Load model</button>
            <br />
            <br />
            <button className="bg-blue-400 text-white p-3" onClick={() => makePrediction()}>Make Prediction</button>
        </div>
    )

}