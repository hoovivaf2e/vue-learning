<template>
  <div class="container">
    <h2 class="mt-5 text-center">購物車</h2>
    <!-- 購物車列表 -->
    <div class="text-end">
      <button
        class="btn btn-outline-danger"
        type="button"
        @click="clearCart" :disabled="cartData.carts.length === 0"
      >
        <span v-show="isLoadingItem === 1 " class="spinner-grow spinner-grow-sm"></span>
        清空購物車
      </button>
    </div>
    <table class="table align-middle">
      <thead>
        <tr>
          <th></th>
          <th>品名</th>
          <th style="width: 150px">數量/單位</th>
          <th>單價</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="cartData.carts">
          <tr v-for="item in cartData.carts" :key="item.id">
            <td>
              <button type="button" class="btn btn-outline-danger btn-sm"
                @click="removeCartItem(item.id)">
                x
              </button>
            </td>
            <td>
              {{ item.product.title }}
              <div class="text-success" v-if="item.coupon">
                已套用優惠券
              </div>
            </td>
            <td>
              <div class="input-group input-group-sm">
                <div class="input-group mb-3">
                  <select class="form-select" v-model="item.qty"
                    @change="updateCartItem(item)"
                    :disabled="isLoadingItem === item.id"
                    >
                    <option :value="num" v-for="num in 20"
                      :key="`${num}-${item.id}`"
                    >
                      {{num}}
                    </option>
                  </select>
                  <span class="input-group-text" id="basic-addon2">{{ item.product.unit }}</span>
                </div>
              </div>
            </td>
            <td class="text-end">
              <small class="text-success" v-if="item.final_total !== item.total">折扣價：</small>
              {{ item.final_total }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="text-end">總計</td>
          <td class="text-end">{{ cartData.total }}</td>
        </tr>
        <tr v-if="cartData.final_total !== cartData.total">
          <td colspan="3" class="text-end text-success">折扣價</td>
          <td class="text-end text-success">{{ cartData.final_total }}</td>
        </tr>
      </tfoot>
    </table>

    <!-- 購買人表單 -->
    <div class="my-5 row justify-content-center">
      <Form ref="form" class="col-md-6" v-slot="{ errors }" @submit="createOrder">
        <div class="mb-3">
          <span class="text-danger">*</span> 為必填
        </div>
        <div class="mb-3">
          <label for="email" class="form-label"><span class="text-danger">*</span>Email</label>
          <Field id="email" name="email" type="email" class="form-control"
            :class="{ 'is-invalid': errors['email'] }"
            v-model="form.user.email"
            rules="email|required"
            placeholder="請輸入 Email"
          ></Field>
          <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="name" class="form-label"><span class="text-danger">*</span>收件人姓名</label>
          <Field id="name" name="姓名" type="text" class="form-control"
            :class="{ 'is-invalid': errors['姓名'] }"
            v-model="form.user.name"
            rules="required"
            placeholder="請輸入姓名"
          ></Field>
          <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="tel" class="form-label"><span class="text-danger">*</span>收件人電話</label>
          <Field id="tel" name="電話" type="tel" class="form-control"
            v-model="form.user.tel"
            :class="{'is-invalid': errors['電話']}"
            placeholder="請輸入電話"
            rules="required|min:8"
          ></Field>
          <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label"><span class="text-danger">*</span>收件人地址</label>
          <Field id="address" name="地址" type="text" class="form-control"
            :class="{'is-invalid': errors['地址']}"
            v-model="form.user.address"
            rules="required"
            placeholder="請輸入地址"
          ></Field>
          <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea name="" id="message" class="form-control"
            cols="30" rows="10" v-model="form.message">
          </textarea>
        </div>

        <div class="text-end">
          <button type="submit" class="btn btn-danger"
            :disabled="cartData.carts.length === 0 || Object.keys(errors).length > 0">
            送出訂單
          </button>
        </div>

      </Form>
    </div>
  </div>
</template>

<script>
import emitter from '../libs/emitter';

export default {
  data() {
    return {
      cartData: {
        carts: [],
      },
      products: [],
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
    getCart() {
      this.axios.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`)
        .then((res) => {
          this.cartData = res.data.data;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    clearCart() {
      this.isLoadingItem = 1;
      this.axios.delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/carts`)
        .then((res) => {
          this.isLoadingItem = 0;
          alert(res.data.message);
          this.getCart();
          // get-cart 觸發監聽行為
          emitter.emit('get-cart');
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    removeCartItem(id) {
      this.isLoadingItem = id;
      this.axios.delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${id}`)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
          this.isLoadingItem = '';
          emitter.emit('get-cart');
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    updateCartItem(item) {
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      this.axios.put(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${item.id}`, { data })
        .then((res) => {
          alert(res.data.message);
          this.getCart();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          this.isLoadingItem = '';
          alert(err.data.message);
        });
    },
    createOrder() {
      this.axios.post(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order`, { data: this.form })
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.form.message = '';
          this.getCart();
          emitter.emit('get-cart');
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
  mounted() {
    this.getCart();
  },
};
</script>
