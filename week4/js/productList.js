import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';

let updateModal = '';
let deleteModal = '';

const app = createApp({
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
        sortBy: 'price',
        pagination: {}
      }
    },
    components: {
      pagination
    },
    computed: {
      sortProducts() {
        // 搭配 sorting 方法一起使用
        // sort 方法傳入兩個值做比對，如 productsA.price : productsB.price
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
      getProducts(page = 1) {
        axios.get(`${this.apiUrl}/${this.apiPath}/admin/products?page=${page}`)
        .then(response => {
          // 方法一
          // const { products, pagination } = response.data;
          // this.products = products;
          // this.pagination = pagination;
          
          // 方法二
          this.products = response.data.products;
          this.pagination = response.data.pagination;
        })
        .catch((error) => {
            console.log('getProducts: ', error.response);
            alert('抓取資料失敗');
        })
      },
      sorting(sortBy) {
        // 點擊欄位時會將點擊的欄位名稱傳入，亦變換 ascending值，使其可以一直點擊
        this.sortBy = sortBy;
        this.ascending = !this.ascending;
      }
    },
    mounted() { // 使用mounted是因要在畫面完全生成後再擷取 Dom 元素
      this.checkLogin();
    }
});

// 新增 / 編輯 Modal 
app.component('updateModal', {
  template: '#updateModal',
  props: ['product', 'isNew'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2/api',
      apiPath: 'megan_api',
    }
  },
  methods: {
    updateProduct() {
      let url = `${this.apiUrl}/${this.apiPath}/admin/product`;
      let http = 'post';

      if(!this.isNew) { // 若為編輯狀態
        url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.product.id}`;
        http = 'put';
      }
      axios[http](url, {data: this.product})
      .then(response => {
        alert(response.data.message);
        updateModal.hide();
        // 內層方法：update  外層方法：getProduct
        this.$emit('update');
      })
      .catch((error) => {
          console.log('updateProducts: ', error.response);
          alert('編輯資料失敗');
      })
    },
    addImage(){
      this.product.imagesUrl = [];
      this.product.imagesUrl.push('');
    },
    openModal() {
      updateModal.show();
    },
    hideModal() {
      updateModal.hide();
    }
  },
  mounted () {
    // 建立 bootstrap Modal 實例
    updateModal = new bootstrap.Modal(this.$refs.updateModal, { keyboard: false, backdrop: 'static', });
  }
});


// 刪除 Modal 
app.component('deleteModal', {
  template: '#deleteModal',
  props: ['product'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2/api',
      apiPath: 'megan_api',
    }
  },
  methods: {
    deleteProduct() {
      axios.delete(`${this.apiUrl}/${this.apiPath}/admin/product/${this.product.id}`)
      .then(response => {
        alert(response.data.message);
        deleteModal.hide();
        // 內層方法：update  外層方法：getProduct
        this.$emit('update');
      })
      .catch((error) => {
          console.log('getProducts: ', error.response);
          alert('刪除出現錯誤');
      })
    },
    openModal() {
      deleteModal.show();
    },
    hideModal() {
      deleteModal.hide();
    }
  },
  mounted () {
    // 建立 bootstrap Modal 實例
    deleteModal = new bootstrap.Modal(this.$refs.deleteModal, { keyboard: false, backdrop: 'static', });
  }
});

app.mount('#app');