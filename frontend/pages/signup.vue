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
          />
          <TextField
            label="Придкмайте пароль"
          />
          <TextField
            label="Укажите Имя"
          />
          <Btn label="Зарегистрироваться" class="custom-margin"/>
          <div style="display: inline; text-align: center;">
            Уже Зарегистрированы? <a display: inline href="/login">Войдите!</a>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'SignUpPage'
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
