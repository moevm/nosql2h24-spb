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
          />
          <TextField
            label="Пароль"
          />
          <Btn label="Вход" class="custom-margin"/>
          <div style="display: inline; text-align: center;">
            В первый раз? <a display: inline href="/signup">Зарегистрируйтесь!</a>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'SignInPage'
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
