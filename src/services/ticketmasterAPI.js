import axios from "axios";

const ticketmasterApi = axios.create({
    baseURL: "https://app.ticketmaster.com/discovery/v2",
});


export const getConcerts = async (artist) => {

    const response = await ticketmasterApi.get("/events.json", {
        params: {
            apikey: import.meta.env.VITE_TICKETMASTER_KEY,
            keyword: artist,
            size: 10,
            locale: "*",
            sort: "date,asc",
        },
    });


    return response.data._embedded?.events || [];
};