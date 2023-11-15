// TODO : import axios
import axios from 'axios';

const baseURL = 'http://localhost:8000';
export const upload_holdings_url = baseURL+"/upload_holdings";

// TODO : create api using axios
const api = axios.create({
    baseURL: baseURL,
})

// TODO: Request interceptor for adding the bearer token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }

)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }

)

// TODO : create API endpoints
//Register user
export const UserRegister = (param) => {
    return api.post('/register', param)
}

export const userLogin = (param) => {
    return api.post('/login', param)
}

export const saveBankAccount = (param) => {
    return api.post('/bank_accounts', param)
}

export const getBankAccounts = () => {
    return api.get('/bank_accounts')
}

export const getHoldings = (params) => {
    console.log(params)
    return api.get('/holdings', {params:params})
}

export const handleProcessFile = (fieldName, file, metadata, load, error, progress, abort) => {
    const config = {
        onUploadProgress: (event) => {
            const percent = Math.floor((event.loaded * 100) / event.total)
            progress(percent)
        }
    }

    const formData = new FormData();
    formData.append('file', file);

    api.post('/upload_holdings', file, config).then((response) => {
            load(response.data)
    }).catch((err) => {
        error('Error uploading the file')
    })
}

// TODO: export api endpoints
export default api;