<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="registration-card" color="primary">
        <v-card-title class="headline text-center d-flex justify-center text-h3 custom-margin">
          Регистрация
        </v-card-title>
        <v-card-text class="d-flex flex-column align-center">
          <v-form v-model="valid" validate-on="invalid-input" @submit.prevent="handleRegistration">
            <TextField
              label="Укажите почту"
              v-model="email"
              @input="emailMessages = ''"
              :messages="emailMessages"
              :rules="[rules.required, rules.email]"
            />
            <TextField
              label="Придумайте пароль"
              v-model="password"
              @input="passwordMessages = ''"
              type="password"
              :messages="passwordMessages"
              :rules="[rules.required, rules.minPassword]"
            />
            <TextField
              label="Укажите Имя"
              v-model="name"
              @input="nameMessages = ''"
              :messages="nameMessages"
              :rules="[rules.required, rules.minName]"
            />
            <Btn label="Зарегистрироваться" class="custom-margin" @click="handleRegistration" />
          </v-form>
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
      nameMessages: '',
      valid: false,
      rules: {
        required: value => !!value || 'Здесь пусто!',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Некорректный email'
        },
        minPassword: value => value.length >= 6 || 'Пароль должен содержать не менее 6 символов',
        minName: value => value.length >= 4 || 'Имя должно содержать не менее 4 символов'
      }
    }
  },
  methods: {
    async handleRegistration() {
      if (!this.valid) return;
      const { email, password, name } = this;
      console.log('send reg req');
      $fetch(`${this.$config.public.backendUrl}/api/auth/signUp`, {
        method: 'POST',
        body: { email, password, name },
        onResponse: ({ request, response, options }) => {
          localStorage.setItem('access_token', response._data.access_token);
          console.log('ответ', response.status);
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
          else if (response.status === 409) {
            this.emailMessages = 'Пользователь с такой почтой уже существует';
            this.passwordMessages = '';
            this.nameMessages = '';
          } else {
            this.passwordMessages = 'Что-то пошло не так';
            this.emailMessages = 'Что-то пошло не так';
            this.nameMessages = 'Что-то пошло не так';
          }
        }
      })
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
