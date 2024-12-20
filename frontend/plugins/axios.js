export default function ({ $axios, store }) {
    $axios.onRequest(config => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.common['Authorization'] = `Bearer ${token}`;
        }
    });
}
  