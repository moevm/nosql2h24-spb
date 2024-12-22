<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="registration-card" color="background">
        <v-card-title class="headline text-center d-flex justify-center text-h3 custom-margin">
          Регистрация
        </v-card-title>
        <v-card-text class="d-flex flex-column align-center">
          <TextField
            label="Укажите почту"
            v-model="email"
            :messages="emailMessages"
          />
          <TextField
            label="Придумайте пароль"
            v-model="password"
            type="password"
            :messages="passwordMessages"
          />
          <TextField
            label="Укажите Имя"
            v-model="name"
            :messages="nameMessages"
          />
          <Btn label="Зарегистрироваться" class="custom-margin" @click="handleRegistration"/>
          <div style="display: inline; text-align: center;">
            Уже Зарегистрированы? <nuxt-link to="/signin">Войдите!</nuxt-link>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'SignUpPage',
  data() {
    return {
      email: '',
      password: '',
      name: '',
      emailMessages: '',
      passwordMessages: '',
      nameMessages: ''
    }
  },
  methods: {
    async handleRegistration() {
      const { email, password, name } = this;
      const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      
      if (!emailRegExp.test(email)) {
        this.emailMessages = 'Некорректный email';
        this.passwordMessages = '';
        this.nameMessages = '';
        return;
      }
      
      if (password.length < 6) {
        this.passwordMessages = 'Пароль должен содержать не менее 6 символов';
        this.emailMessages = '';
        this.nameMessages = '';
        return;
      }

      if (name.length < 4) {
        this.nameMessages = 'Имя должно содержать не менее 4 символов';
        this.emailMessages = '';
        this.passwordMessages = '';
        return;
      }
      
      try {
        console.log('send reg req');
        const response = await this.$axios.post('/api/auth/signUp', { email, password, name });
        localStorage.setItem('access_token', response.data.access_token);

        if (response.status === 201) {
          console.log('Успешная регистрация');
          this.password = '';
          this.email = '';
          this.name = '';
          this.passwordMessages = '';
          this.emailMessages = '';
          this.nameMessages = '';
          this.$router.push('/');
        }
      } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        if (error.response.status === 409) {
          this.emailMessages = 'Пользователь с такой почтой уже существует';
          this.passwordMessages = '';
          this.nameMessages = '';
        } else {
          this.passwordMessages = 'Что-то пошло не так';
          this.emailMessages = 'Что-то пошло не так';
          this.nameMessages = 'Что-то пошло не так';
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
