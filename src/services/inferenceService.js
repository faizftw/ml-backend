const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const predictionValue = (await prediction.data())[0];

        let label, suggestion;

        if (predictionValue > 0.5) {
            label = 'Cancer';
            suggestion = "Segera periksa ke dokter!";
        } else {
            label = 'Non-cancer';
            suggestion = "Anda aman";
        }

        return { label, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;
