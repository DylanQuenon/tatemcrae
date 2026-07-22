import Axios from "axios";
import { GALLERIES_API } from "../config";

/**
 * Retrieves all gallery items.
 * Handles Hydra API Platform formats as well as standard arrays.
 */
function findAll() {
    return Axios.get(GALLERIES_API)
        .then((response) => {
            const data = response.data;
            const collection =
                data?.member ||
                data?.['hydra:member'] ||
                (Array.isArray(data) ? data : []);

            return collection;
        })
        .catch((error) => {
            console.error("API Error (findAll):", error);
            return [];
        });
}

/**
 * Retrieves a single gallery item by its ID.
 */
function find(id) {
    return Axios.get(`${GALLERIES_API}/${id}`).then((response) => response.data);
}

/**
 * Deletes a gallery item by its ID.
 */
function deleteGallery(id) {
    return Axios.delete(`${GALLERIES_API}/${id}`);
}

/**
 * Updates a gallery item using JSON Merge Patch format (API Platform requirement).
 */
function updateGallery(id, galleryData) {
    return Axios.patch(`${GALLERIES_API}/${id}`, galleryData, {
        headers: {
            'Content-Type': 'application/merge-patch+json'
        }
    });
}

/**
 * Creates a new gallery item.
 */
function createGallery(galleryData) {
    return Axios.post(GALLERIES_API, galleryData);
}

export default {
    findAll,
    find,
    delete: deleteGallery,
    update: updateGallery,
    create: createGallery
};