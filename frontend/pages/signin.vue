<template>
  <v-row justify="center" align="center" class="h-100 pb-16">
    <v-col cols="12" sm="8" md="6">
      <v-card class="rounded-xl" color="primary">
        <v-card-title class="headline text-center d-flex justify-center text-h3 mb-7">
          Авторизация
        </v-card-title>
        <v-card-text class="d-flex flex-column align-center">
          <v-col cols="12" sm="10" xl="8">
            <v-form v-model="valid" validate-on="invalid-input" @submit.prevent="handleRegistration" class="w-100">
              <TextField label="Почта" v-model="email" @input="emailMessages = ''" :messages="emailMessages"
                :rules="[rules.required, rules.email]" class="my-1" />
              <TextField label="Пароль" v-model="password" @input="passwordMessages = ''" type="password"
                :messages="passwordMessages" :rules="[rules.required]" class="my-1" />

              <Btn label="Вход" class="mb-7" type="submit" block />
            </v-form>
          </v-col>
          <div class="text-center">
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
      passwordMessages: '',
      valid: false,
      rules: {
        required: value => !!value || 'Здесь пусто!',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Некорректный email'
        }
      }
    }
  },
  methods: {
    async handleRegistration() {
      console.log('hi!!', this.valid)
      if (!this.valid) return;
      const { email, password } = this;
      await $fetch(`${this.$config.public.backendUrl}/api/auth/signIn`, {
        method: 'POST',
        body: { email, password },
        onResponse: ({ request, response, options }) => {
          console.log('asdasd', response);
          if (response.status === 200) {
            console.log('Успешная авторизация', request);
            this.password = '';
            this.email = '';
            this.passwordMessages = '';
            this.emailMessages = '';
            localStorage.setItem('access_token', response._data.access_token);
            localStorage.setItem('user_id', response._data.user.id);
            this.$router.push('/');
          }
          else {
            console.error('Ошибка при отправке данных:', response.statusText);
            if (response.status === 404) {
              this.emailMessages = 'Пользователя с такой почтой не существует';
              this.passwordMessages = '';
            }
            else if (response.status === 401) {
              this.emailMessages = '';
              this.passwordMessages = 'Неверный пароль';
            }
            else {
              console.error('Что то пошло не так:', response.statusText);
              this.passwordMessages = 'Что то пошло не так';
              this.emailMessages = 'Что то пошло не так';
            }
          }
        }
      })
    }
  }
}
</script>