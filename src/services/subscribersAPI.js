import Axios from 'axios'
import { SUBSCRIBERS_API } from '../config'

function findAll() {
    return Axios.get(SUBSCRIBERS_API)
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

function find(id) {
    return Axios.get(`${SUBSCRIBERS_API}/${id}`)
        .then(response => response.data);
}

function deleteSubscriber(id) {
    return Axios.delete(`${SUBSCRIBERS_API}/${id}`);
}

function updateSubscriber(id, subscriber) {
    return Axios.put(`${SUBSCRIBERS_API}/${id}`, subscriber, {
        headers: {
            'Content-Type': 'application/ld+json'
        }
    }).then(response => response.data);
}

function createSubscriber(subscriber) {
    console.log("Creating subscriber payload:", subscriber);
    return Axios.post(SUBSCRIBERS_API, subscriber, {
        headers: {
            'Content-Type': 'application/ld+json'
        }
    }).then((response) => response.data);
}

export default {
    findAll: findAll,
    find: find,
    delete: deleteSubscriber,
    update: updateSubscriber,
    create: createSubscriber
}