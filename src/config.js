// URL de base du serveur Symfony (sans /api)
export const SERVER_URL = "http://127.0.0.1:8000"; 

// API base URL (avec /api)
export const API_URL = `${SERVER_URL}/api/`;

export const LOGIN_API = API_URL + "login_check";
export const CONCERTS_API = API_URL + "concerts";
export const TAGS_API = API_URL + "tags";
export const ALBUMS_API = API_URL + "albums";