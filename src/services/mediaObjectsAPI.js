import axios from 'axios';

// Remplace par l'URL de ton API (ou utilise ton instance axios configurée avec les interceptors de token)
const MEDIA_OBJECTS_URL = "http://localhost:8000/api/media_objects"; 

/**
 * Envoie un fichier image au backend API Platform
 * @param {FormData} formData - Contient le fichier sous la clé 'file'
 * @returns {Promise<Object>} Le MediaObject créé (avec son @id / IRI)
 */
function create(formData) {
    return axios
        .post(MEDIA_OBJECTS_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => response.data);
}

export default {
    create,
};