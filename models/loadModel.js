const tf = require("@tensorflow/tfjs-node");

async function loadModel(modelPath) {
  try {
    const model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
    return model;
  } catch (error) {
    console.error("Failed to load model:", error);
    throw new Error(`Failed to load model: ${error.message}`);
  }
}

module.exports = loadModel;
