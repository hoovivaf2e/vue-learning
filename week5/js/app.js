import userProductModal from './productModal.js';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'), //啟用 locale 
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'megan_api';

Vue.createApp({
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  data() {
    return {
      cartData: {
        carts: [],
      },
      products: [],
      productId: '',
      isLoadingItem: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    };
  },
  methods: {
    getProducts() {
      axios.get(`${apiUrl}/api/${apiPath}/products/all`)
      .then((res)=>{
        this.products = res.data.products;
      })
      .catch((err)=> {
        alert(err.data.message);
      })
    },
    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },
    getCart() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`)
      .then((res)=>{
        this.cartData = res.data.data;
      })
      .catch((err)=> {
        alert(err.data.message);
      })
    },
    addToCart(id, qty=1) {
      const data = {
        product_id: id,
        qty, 
      }
      this.isLoadingItem = id;
      axios.post(`${apiUrl}/api/${apiPath}/cart`, { data })
      .then((res)=>{
        alert(res.data.message);
        this.getCart();
        this.$refs.productModal.closeModal();
        this.isLoadingItem = '';
      })
      .catch((err)=> {
        alert(err.data.message);
      })
    },
    clearCart() {
      this.isLoadingItem = 1;
      axios.delete(`${apiUrl}/api/${apiPath}/carts`)
      .then((res)=>{
        this.isLoadingItem = 0;
        alert(res.data.message);
        this.getCart();
      })
      .catch((err)=> {
        alert(err.data.message);
      })
    },
    removeCartItem(id) {
      this.isLoadingItem = id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
      .then((res)=>{
        alert(res.data.message);
        this.getCart();
        this.isLoadingItem = '';
      })
      .catch((err)=> {
        alert(err.data.message);
      })
    },
    updateCartItem(item) {
      const data = {
        product_id: item.id,
        qty: item.qty, 
      }
      this.isLoadingItem = item.id;
      axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
      .then((res)=>{
        alert(res.data.message);
        this.getCart();
        this.isLoadingItem = '';
      })
      .catch((err)=> {
        this.isLoadingItem = '';
        alert(err.data.message);
      })
    },
    createOrder() {
      axios.post(`${apiUrl}/api/${apiPath}/order`, { data: this.form })
      .then((res)=> {
        alert(res.data.message);
        this.$refs.form.resetForm();  
        this.form.message = ''; // 不知道為什麼無法清除textarea的值，故加了 message 初始化
        this.getCart();
      })
      .catch((err)=> {
        alert(err.data.message);
      })
    }
  },
  mounted() {
    this.getProducts();
    this.getCart();
  }
})
.component('product-modal', userProductModal)
.mount('#app');