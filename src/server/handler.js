const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    try {
        const { label, suggestion } = await predictClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            "id": id,
            "result": label,
            "suggestion": suggestion,
            "createdAt": createdAt
        }

        await storeData(id, data);

        const response = h.response({
            status: 'success',
            message: 'Model is predicted successfully.',
            data
        });
        response.code(201);
        return response;
    } catch (error) {
        if (error.message.includes('Payload content length greater than maximum allowed')) {
            throw new InputError('Payload content length greater than maximum allowed: 1000000', 413);
        } else {
            throw new InputError('Terjadi kesalahan dalam melakukan prediksi', 400);
        }
    }
}

module.exports = postPredictHandler;