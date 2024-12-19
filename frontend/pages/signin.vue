<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="registration-card" color="background">
        <v-card-title class="headline text-center d-flex justify-center text-h3 custom-margin">
          Авторизация
        </v-card-title>
        <v-card-text class="d-flex flex-column align-center">
          <TextField
            label="Почта"
            v-model="email"
          />
          <TextField
            label="Пароль"
            v-model="password"
            type="password"
          />
          <Btn label="Вход" class="custom-margin" @click="handleRegistration"/>
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
      password: ''
    }
  },
  methods: {
    async handleRegistration() {
      const { email, password } = this;
      const backendUrl = `${this.$config.backendHost}:${this.$config.backendPort}/signInDto`;
      try {
        const response = await this.$axios.post(backendUrl, { email, password });
        if (response.status === 200) {
          console.log('Успешная авторизация:', response.data);
          // Здесь можно перенаправить пользователя на другую страницу
          this.$router.push('/');
        } else {
          console.error('Ошибка авторизации:', response.data);
        }
      } catch (error) {
        console.error('Ошибка при отправке данных:', error);
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
