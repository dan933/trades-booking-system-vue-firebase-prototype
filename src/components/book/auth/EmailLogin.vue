<template>
  <v-container>
    <v-card class="mx-auto" min-width="150">
      <v-card-text>
        <v-form @submit.prevent="login" v-model="loginForm">
          <v-text-field
            v-model="user.email"
            autocomplete="email"
            label="Email"
            required
            :rules="emailRules"
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            label="Password"
            autocomplete="current-password"
            type="password"
            required
            :rules="passwordRules"
          ></v-text-field>
          <v-alert
            v-if="signInResponse?.IsPasswordIncorrect"
            class="mb-3"
            type="error"
            :text="signInResponse?.errorMessage"
            variant="outlined"
            density="compact"
          ></v-alert>
          <div class="mb-5"><a href="#">Forgot Password</a> <br /></div>
          <div class="card-button-container">
            <v-btn size="small" type="submit" color="primary" class="mr-4 mb-4">
              Login
            </v-btn>
            <v-btn size="small" class="mb-5" @click="switchForm"
              >Register Account</v-btn
            >
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "emailLogin",
  props: ["signInResponse"],
  data() {
    return {
      loginForm: false,
      user: {
        email: "",
        password: "",
      },
      emailRules: [
        (v) => !!v || "Email is required",
        (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Email must be valid",
      ],
      passwordRules: [(value) => !!value || "Password Required"],
    };
  },
  methods: {
    switchForm() {
      this.$emit("switchForm");
    },
    login() {
      if (this.loginForm) {
        let request = {
          providerName: "email",
          user: this.user,
        };

        this.$emit("signIn", request);
      }
    },
  },
};
</script>
<style type="scss">
.card-button-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>
