<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="registration-card" color="background">
        <v-card-title class="headline text-center d-flex justify-center text-h3 custom-margin">
          Авторизация
        </v-card-title>
        <v-card-text class="d-flex flex-column align-center">
          <TextField label="Почта" v-model="email" :messages="emailMessages" />
          <TextField label="Пароль" v-model="password" type="password" :messages="passwordMessages" />
          <Btn label="Вход" class="custom-margin" @click="handleRegistration" />
          <div style="display: inline; text-align: center;">
            В первый раз? <nuxt-link to="/signup">Зарегистрируйтесь!</nuxt-link>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'SignInPage',
  data() {
    return {
      email: '',
      password: '',
      emailMessages: '',
      passwordMessages: ''
    }
  },
  methods: {
    async handleRegistration() {
      const { email, password } = this;
      const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegExp.test(email)) {
        this.emailMessages = 'Некорректный email';
        this.passwordMessages = '';
        return;
      }
      const response = await this.$axios.post('/api/auth/signIn', { email, password });
      localStorage.setItem('access_token', response.data.access_token);
      console.log(response);
      if (response.status === 200) {
        console.log('Успешная авторизация');
        this.password = '';
        this.email = '';
        this.passwordMessages = '';
        this.emailMessages = '';
        this.$router.push('/');
      }
      else {
        console.error('Ошибка при отправке данных:', error);
        if (error.response.status === 404) {
          this.emailMessages = 'Пользователя с такой почтой не существует';
          this.passwordMessages = '';
        }
        else if (error.response.status === 401) {
          this.emailMessages = '';
          this.passwordMessages = 'Неверный пароль';
        }
        else {
          console.error('Что то пошло не так:', error, response);
          this.passwordMessages = 'Что то пошло не так';
          this.emailMessages = 'Что то пошло не так';
        }
      }
    }
  }
}
</script>

<style scoped>
.registration-card {
  background-color: primary;
  border-radius: 20px;
  padding: 27px;
}

.custom-margin {
  margin-top: 0;
  margin-bottom: 28px;
}
</style>
