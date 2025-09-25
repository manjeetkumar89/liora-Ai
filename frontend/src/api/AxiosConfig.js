import axios from 'axios';

const instance = axios.create({
    baseURL : "https://liora-eelb.onrender.com/",
})

export default instance;