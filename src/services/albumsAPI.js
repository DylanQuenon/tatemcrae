import Axios from 'axios';
import { ALBUMS_API } from '../config';

function findAll() {
    return Axios.get(ALBUMS_API)
        .then(response => {
            const data = response.data;
            const collection = 
                data?.member || 
                data?.['hydra:member'] || 
                (Array.isArray(data) ? data : []);

            console.log("Tableau final d'albums extrait :", collection);

            return collection;
        })
        .catch(error => {
            console.error("Erreur API Albums :", error);
            return [];
        });
}

function find(id) {
    return Axios.get(`${ALBUMS_API}/${id}`)
        .then(response => response.data);
}

function deleteAlbum(id) {
    return Axios.delete(`${ALBUMS_API}/${id}`);
}

function updateAlbum(id, album) {
    return Axios.put(`${ALBUMS_API}/${id}`, album);
}

function createAlbum(album) {
    console.log("Album créé :", album);
    return Axios.post(ALBUMS_API, album);
}

export default {
    findAll: findAll,
    find: find,
    delete: deleteAlbum,
    update: updateAlbum,
    create: createAlbum
};