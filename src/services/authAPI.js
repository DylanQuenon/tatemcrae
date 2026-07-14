import Axios from 'axios'

import { LOGIN_API } from '../config'
import { jwtDecode } from 'jwt-decode'

function authenticate(credentials)
{
    return Axios
            .post(LOGIN_API, credentials)
            .then(response => response.data.token)
            .then(token => {
                // token into local storage
                window.localStorage.setItem("authToken", token)
                //add bearer token
                Axios.defaults.headers["Authorization"] = "Bearer " + token
                return true
            })
}

function logout(){
    window.localStorage.removeItem("authToken")
    delete Axios.defaults.headers["Authorization"]
}

function setup(){
    // voir si on a un token
    const token = window.localStorage.getItem("authToken")
    if(token)
    {
        const jwtData = jwtDecode(token)
        if((jwtData.exp * 1000) > new Date().getTime())
        {
            Axios.defaults.headers["Authorization"]="Bearer " + token
        }
    }
}

function isAuthenticated() {
    const token = window.localStorage.getItem("authToken")
    if(token)
    {
        const jwtData = jwtDecode(token)
        if((jwtData.exp * 1000) > new Date().getTime())
        {
            return true // ok il est authentifié
        }
        return false // token existe mais expiré 
    }
    return false // pas de token
}


export default {
    authenticate: authenticate,
    logout: logout,
    setup: setup,
    isAuthenticated: isAuthenticated
}