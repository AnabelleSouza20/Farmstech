import axios from "axios";

const api = axios.create({ 
    baseURL: "http://52.226.69.167:5002"
})

export async function sendApi(url:string){
    return await api.get(url).then(({data}) =>  data).catch(()=> ({}))
}

export default api;