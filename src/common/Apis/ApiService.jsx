// src/api/apiService.js
import apiClient from './ApiClient';
import ENDPOINTS from '../endpoints';
import { RES_MESSAGE } from '../statusMessage';

const validRespones = async (res) => {
    try {
        console.log('valid response ', res)
        if (!(res.data.status && res.data.statusCode == 200)) {
            console.log('valid errrrr', res.data.message)
            return { err: res.data.message }
        }

        return res
    } catch (error) {
        console.log('0', error)
        window.alert(RES_MESSAGE.EM500)
    }
}

const tokens = async () => {
    try {
        let token = JSON.parse(localStorage.getItem('token'))
        return token
    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
}

export const registerUser = async (userData, customHeaders = {}) => {
    try {
    
        const response = await apiClient.post(ENDPOINTS.register, userData, { customHeaders });

        let res = await validRespones(response)

        if (res.err) {
            console.log('valid error', res.err)
            return { status: false, error: res.err }
        }

        localStorage.setItem('user', JSON.stringify(response.data.data._id))
        localStorage.setItem('pr_id', JSON.stringify(response.data.profile._id))

        return { status: true }


    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};


export const loginUser = async (userData, customHeaders = {}) => {
    try {
        // const { startLoading, stopLoading } = useLoader();
        // startLoading();
        console.log('login fun', userData)
        const response = await apiClient.post(ENDPOINTS.login, userData, { customHeaders });
        console.log('login fun res', response)
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true, data : res.data }


    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};

export const updateProfile = async (id, userData, token=false, customHeaders) => {
    try {

        if(token){
            let token = await tokens()
            console.log(token, 'token')
            customHeaders['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiClient.post(`${ENDPOINTS.updateProfile}/${id}`, userData, { customHeaders });

        console.log(response.data, 'pp')
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        // localStorage.setItem('token', JSON.stringify(response.data.data.token))
        // localStorage.setItem('user_id', JSON.stringify(response.data.data._doc._id))

        return { status: true, data : res.data }


    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};

export const updateProfileRegister = async (id, userData, token=false, customHeaders) => {
    try {

        const response = await apiClient.post(`${ENDPOINTS.updateProfileRegister}/${id}`, userData, { customHeaders });
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true }

    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};


export const getChatUsers = async (token, customHeaders = {}) => {
    try {

        if(token){
            let token = await tokens()
            customHeaders['Authorization'] = `Bearer ${token}`;
        }

        const response = await apiClient.get(ENDPOINTS.getChatUsers, { customHeaders });
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true, data : res.data }

    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};

export const getSingleUser = async (id, token, customHeaders = {}) => {
    try {

        if(token){
            let token = await tokens()
            customHeaders['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiClient.get(`${ENDPOINTS.getSingleUser}/${id}`, { customHeaders });
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true, data : res.data }

    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};

export const getLoginUser = async (token, customHeaders = {}) => {
    try {

        if(token){
            let token = await tokens()
            customHeaders['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiClient.get(ENDPOINTS.getLoginUser, { customHeaders });
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true, data : res.data }

    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};

export const getUserChat = async (data, token, customHeaders = {}) => {
    try {

        if(token){
            let token = await tokens()
            customHeaders['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiClient.post(ENDPOINTS.getUserChat, data, { customHeaders });
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true, data : res.data }

    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};

export const updateChat = async (id, data, token, customHeaders = {}) => {
    try {

        if(token){
            let token = await tokens()
            customHeaders['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiClient.post(`${ENDPOINTS.updateChat}/${id}`, data, { customHeaders });
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true, data : res.data }

    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};

export const chatSended = async (data, token, customHeaders = {}) => {
    try {

        if(token){
            let token = await tokens()
            customHeaders['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiClient.post(ENDPOINTS.chatSended, data, { customHeaders });
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true }

    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};

export const reciveChatSuccess = async (data, token, customHeaders = {}) => {
    try {

        if(token){
            let token = await tokens()
            customHeaders['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiClient.post(ENDPOINTS.reciveChatSuccess, data, { customHeaders });
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true }

    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};

export const deleteChatUserside = async (id, token, customHeaders = {}) => {
    try {

        if(token){
            let token = await tokens()
            customHeaders['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiClient.get(`${ENDPOINTS.deleteChatUserside}/${id}`, { customHeaders });
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true, data : response.data }

    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};

export const deleteChatBothside = async (id, token, customHeaders = {}) => {
    try {

        if(token){
            let token = await tokens()
            customHeaders['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiClient.get(`${ENDPOINTS.deleteChatBothside}/${id}`, { customHeaders });
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true, data : response.data }

    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};

export const getNotificationChat = async (data, token, customHeaders = {}) => {
    try {

        if(token){
            let token = await tokens()
            customHeaders['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiClient.post(ENDPOINTS.getNotificationChat, data, { customHeaders });
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true, data : response.data }

    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};

export const getProfile = async (token, customHeaders = {}) => {
    try {

        if(token){
            let token = await tokens()
            customHeaders['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiClient.get(ENDPOINTS.getProfile, { customHeaders });
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true, data : response.data }

    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};

export const removeProfilePhoto = async (id, token, customHeaders) => {
    try {

        if(token){
            let token = await tokens()
            customHeaders['Authorization'] = `Bearer ${token}`;
        }
        const response = await apiClient.delete(`${ENDPOINTS.removeProfilePhoto}/${id}`, { customHeaders });
        let res = await validRespones(response)

        if (res.err) {
            return { status: false, error: res.err }
        }

        return { status: true, data : response.data }

    } catch (error) {
        window.alert(RES_MESSAGE.EM500)
    }
};
