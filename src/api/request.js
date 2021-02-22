import axios from 'axios';

const instance = axios.create({});

instance.interceptors.request.use(function (config) {
    let m_id = localStorage.getItem('m_id');
    config.data.m_id = m_id;
    return config;
}, function (error) {
    return Promise.reject(error);
});


export default instance