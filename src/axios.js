import axios from 'axios'

const baseURL= '/api/v2/app/'
const instance = axios.create({ baseURL })
instance.interceptors.request.use(
    config => {
        config.headers['Accept'] = 'application/json'
        config.headers['Content-Type'] = 'application/json'
        if (config.data == null) {
            config.data = {}
        }

        return config
    },
    err => {
        return Promise.reject(err)
    }
)
export default instance
export { baseURL }