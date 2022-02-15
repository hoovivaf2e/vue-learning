import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
    data() {
        return {
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';

            axios.post(api, this.user)
            .then((response) => {
                const { token, expired } = response.data;
                document.cookie = `mainToken=${token}; expires=${new Date(expired)}; path=/`;
                window.location = 'productList.html';
            }).catch((error) => {
                alert(error.data.message);
            });
        }
    }
}).mount('#app');