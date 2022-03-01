<template>
  <div class="container">
    <div class="row justify-content-center">
      <h1 class="h3 mb-3 mt-5 font-weight-normal text-center">
        請先登入
      </h1>
      <div class="col-8">
        <form class="form-signin" @submit.prevent="login">
          <div class="form-floating mb-3">
            <input type="email" class="form-control"
              v-model="user.username" id="floatingInput"
              placeholder="name@example.com" required autofocus>
            <label for="floatingInput">Email address</label>
          </div>
          <div class="form-floating">
            <input type="password" class="form-control"
              v-model="user.password" id="floatingPassword"
              placeholder="Password" required>
            <label for="floatingPassword">Password</label>
          </div>
          <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
            登入
          </button>
        </form>
      </div>
    </div>
    <p class="mt-5 mb-3 text-muted text-center">
      &copy; 2021~∞ - 六角學院
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      this.axios.post(`${process.env.VUE_APP_API}/admin/signin`, this.user)
        .then((response) => {
          const { token, expired } = response.data;
          document.cookie = `mainToken=${token}; expires=${new Date(expired)}; path=/`;
          this.$router.push({ name: 'admin' });
        }).catch((error) => {
          console.log(error.data.message);
          alert('驗證錯誤');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
</style>
