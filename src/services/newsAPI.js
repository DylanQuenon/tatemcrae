import Axios from "axios";
import { NEWS_API } from "../config";

function findAll(){
    return Axios.get(NEWS_API)
    .then(response => {
        const data=response.data;
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
    return Axios.get(`${NEWS_API}/${id}`)
    .then(response => response.data);
}
function findBySlug(slug) {
  return Axios.get(`${NEWS_API}/${slug}`).then((response) => response.data);
}

function deleteNews(id){
    return Axios.delete(`${NEWS_API}/${id}`);
}

function updateNews(id, news) {
    return Axios.patch(`${NEWS_API}/${id}`, news, {
        headers: {
            'Content-Type': 'application/merge-patch+json'
        }
    });
}

function createNews(news){
    return Axios.post(NEWS_API, news);
}

export default {
    findAll: findAll,
    find: find,
    findBySlug: findBySlug,
    delete: deleteNews,
    update: updateNews,
    create: createNews

}
