import axios, {type AxiosInstance, type AxiosResponse } from 'axios';
import { type ApiResponse } from './types';

const service: AxiosInstance = axios.create({
    baseURL: 'http://139.196.211.196:9000',
    // baseURL: 'http://localhost:9000',
    timeout: 5000
});

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<any>>) => {
        const res = response.data;
        return res as any; // 这里返回 ApiResponse 对象
    },
    (error) => {
        console.log("发生错误：" + error);
        return null;
    }
);

export default service;