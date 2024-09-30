
const URL = {
    // API 
    // baseUrl : 'https://whatsapp-back-end-live.onrender.com/'
    baseUrl : 'http://localhost:5011/'
}
console.log(import.meta.env.MODE)

const ENDPOINTS = {
    // API Endpoints
    baseUrl : URL.baseUrl,
    login: URL.baseUrl + 'api/auth/userLogin',
    register: URL.baseUrl + 'api/auth/userRegister',
    updateProfile : URL.baseUrl + 'api/profile/updateProfile',
    updateProfileRegister : URL.baseUrl + 'api/profile/update-profile-register',
    getChatUsers: URL.baseUrl + 'api/user/getChatUser',
    getSingleUser : URL.baseUrl + 'api/user/getSingleUser',
    getLoginUser : URL.baseUrl + 'api/user/getLoginUser',
    tokenValidation : URL.baseUrl + 'token-valid',
    saveChat : URL.baseUrl + 'api/chat/save-chat',
    getUserChat : URL.baseUrl + 'api/chat/get-chat',
    updateChat : URL.baseUrl + 'api/chat/update-chat',
    chatSended : URL.baseUrl + 'api/chat/chat-send',
    reciveChatSuccess : URL.baseUrl + 'api/chat/recive-chat-success',
    deleteChatUserside : URL.baseUrl + 'api/chat/delete-chat-userside',
    deleteChatBothside : URL.baseUrl + 'api/chat/delete-chat-bothside',
    getNotificationChat : URL.baseUrl + 'api/notification/get-notification-chat',
    getProfile : URL.baseUrl + 'api/profile/get-profile',
    // updateProfilePhoto : URL.baseUrl + 'api/profile/update-profile-pic',
    removeProfilePhoto : URL.baseUrl + 'api/profile/remove-profile-pic',
    socketConnection: URL.baseUrl + 'api/socket/user-namespace',
}

export default ENDPOINTS