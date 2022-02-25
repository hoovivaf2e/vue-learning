const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'megan_api';

export default {
  props: ['id'],
  template: '#userProductModal',
  data() {
    return {
      modal: {},
      product: {},
      qty: 1,
    };
  },
  watch: {
    id() {
      this.getProduct();
    }
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    getProduct(id) {
      axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
      .then((res)=> {
        this.product = res.data.product
      })
      .catch((err)=> {
        alert(err.data.message);
      })
    },
    addToCart() {
      this.$emit("add-cart", this.product.id, this.qty);
    }
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal, { keyboard: false, backdrop: 'static', });
  }
}