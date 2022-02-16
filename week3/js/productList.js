import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let updateModal = '';
let deleteModal = '';

createApp({
    data() {
      return {
        apiUrl: 'https://vue3-course-api.hexschool.io/v2/api',
        apiPath: 'megan_api',
        isNew: false,
        update: '',
        products: [],
        tempProduct: {
          imagesUrl: [],
        },
        ascending: true,
        sortBy: 'price'
      }
    },
    computed: {
      sortProducts() {
        const newProduct = this.products.sort((a, b) => {
          return this.ascending ? a[this.sortBy] - b[this.sortBy] : b[this.sortBy] - a[this.sortBy]
        })
        return this.products;
      }
    },
    methods: {
      checkLogin() {
        // 取出 token 並將 token 的 name 去除只留 value
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)mainToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common['Authorization'] = token;
        
        axios.post(`${this.apiUrl}/user/check`)
        .then(() => {
            this.getProducts();
        })
        .catch((err) => {
          console.log('checkLogin: ', err.data.message);
          alert('登入失敗，請重新登入');
          window.location = 'login.html';
        })
      },
      // isEnabled(item, is_enabled) {
      //   is_enabled ? item.is_enabled = 0 : item.is_enabled = 1;
      // },
      // viewDetails(item) {
      //   this.itemDetails = item
      // },
      openModal(update, item) {
        if (update === 'new') {
          this.isNew = true;
          this.tempProduct = {
            imagesUrl: [],
          };
          updateModal.show();

        }else if(update === 'edit') {
          this.isNew = false;
          this.tempProduct = {...item};
          updateModal.show();

        }else if(update === 'delete') {
          this.tempProduct = {...item};
          deleteModal.show();
        }
      },
      getProducts() {
        axios.get(`${this.apiUrl}/${this.apiPath}/admin/products`)
        .then(response => {
          this.products = response.data.products;
        })
        .catch((error) => {
            console.log('getProducts: ', error.response);
            alert('抓取資料失敗');
        })
      },
      updateProduct() {
        let url = `${this.apiUrl}/${this.apiPath}/admin/product`;
        let http = 'post';

        if(!this.isNew) { // 若為編輯狀態
          url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
          http = 'put';
        }
        console.log('this.isNew: ', this.isNew);
        console.log('http: ', http);
        console.log('this.tempProduct: ', this.tempProduct);

        axios[http](url, {data: this.tempProduct})
        .then(response => {
          alert(response.data.message);
          updateModal.hide();
          this.getProducts();
        })
        .catch((error) => {
            console.log('updateProducts: ', error.response);
            alert('編輯資料失敗');
        })
      },
      deleteProduct() {
        axios.delete(`${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`)
        .then(response => {
          alert(response.data.message);
          deleteModal.hide();
          this.getProducts();
        })
        .catch((error) => {
            console.log('getProducts: ', error.response);
            alert('刪除出現錯誤');
        })
      },
      addImage(){
        this.tempProduct.imagesUrl = [];
        this.tempProduct.imagesUrl.push('');
      },
      sorting(sortBy) {
        this.sortBy = sortBy;
        this.ascending = !this.ascending;
      }
    },
    mounted() { // 使用mounted是因要在畫面完全生成後再擷取 Dom 元素
      this.checkLogin();
      // 建立 bootstrap Modal 實例
      // console.log('this.$refs.updateModal: ', this.$refs.updateModal);
      updateModal = new bootstrap.Modal(this.$refs.updateModal, { keyboard: false });
      // console.log('this.$refs.deleteModal: ', this.$refs.deleteModal);
      deleteModal = new bootstrap.Modal(this.$refs.deleteModal, { keyboard: false });
      
    }
}).mount('#app');