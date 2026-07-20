import Axios from 'axios';
import { CONCERTS_API } from '../config';

function findAll() {
    return Axios.get(CONCERTS_API, {
        headers: {
            'Accept': 'application/ld+json' // Force le format Hydra pour garantir 'hydra:member'
        }
    }).then(response => {
        const data = response.data;
        // Gère les différentes structures possibles renvoyées par API Platform
        return data['hydra:member'] || data['member'] || data;
    });
}

export default {
    findAll
};