export default function ({ $axios, store }) {
    $axios.onRequest(config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.common['Authorization'] = `Bearer ${token}`;
        }
    });
}
