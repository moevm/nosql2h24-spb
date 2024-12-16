<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="registration-card">
        <v-card-title class="headline text-center d-flex justify-center">
          Авторизация0
        </v-card-title>
        <v-card-text class="d-flex flex-column align-center">
          <v-text-field
            label="Имя"
            outlined
            class="mb-9"
          ></v-text-field>
          <v-text-field
            label="Email"
            outlined
            class="mb-9"
          ></v-text-field>
          <v-btn
            color="accent"
            class="mb-9"
          >
            Зарегистрироваться
          </v-btn>
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
  /* background-color: primary; */
  border-radius: 20px;
  padding: 27px;
}
</style>
