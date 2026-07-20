import Axios from 'axios'
import { TAGS_API } from '../config'

function findAll() {
    return Axios.get(TAGS_API)
        .then(response => {
            const data = response.data;
            const collection = 
                data?.member || 
                data?.['hydra:member'] || 
                (Array.isArray(data) ? data : []);

            console.log("Tableau final extrait :", collection);

            return collection;
        })
        .catch(error => {
            console.error("Erreur API :", error);
            return [];
        });
}
function find(id){
    return Axios.get(`${TAGS_API}/${id}`)
                .then(response => response.data)
}

function deleteTag(id){
    return Axios.delete(`${TAGS_API}/${id}`)
}

function updateTag(id, tag){
    return Axios.put(`${TAGS_API}/${id}`, tag)
}

function createTag(tag){
    console.log(tag)
    return Axios.post(TAGS_API, tag)
}

export default {
    findAll : findAll,
    find: find,
    delete: deleteTag,
    update: updateTag,
    create: createTag
}