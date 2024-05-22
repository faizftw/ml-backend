const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');

async function postPredictHandler(request, h) {
    const { image } = request.payload;

    if (image._data.length > 1000000) {
        return h.response({
            status: 'fail',
            message: 'Payload content length greater than maximum allowed: 1000000'
        }).code(413);
    }

    const { model } = request.server.app;

    try {
        const { label, suggestion } = await predictClassification(model, image._data);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id: id,
            result: label,
            suggestion: suggestion,
            createdAt: createdAt
        };

        const response = h.response({
            status: 'success',
            message: 'Model is predicted successfully.',
            data
        });
        response.code(201);
        return response;
    } catch (error) {
        throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
    }
}

module.exports = postPredictHandler;