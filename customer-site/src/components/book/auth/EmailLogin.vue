<template>
  <v-container>
    <v-card class="mx-auto" min-width="150">
      <v-card-text v-if="!IsShowResetForm">
        <h1 class="card-title">Login</h1>
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
          <div class="mb-5" @click="() => (IsShowResetForm = true)">
            <a href="#">Forgot Password</a> <br />
          </div>
          <div class="card-button-container">
            <v-btn size="small" type="submit" color="primary" class="mr-4 mb-4">
              Login
            </v-btn>
            <v-btn
              size="small"
              class="mb-5"
              @click="() => switchForm('Register')"
              >Register Account</v-btn
            >
          </div>
        </v-form>
      </v-card-text>
      <v-card-text v-if="IsShowResetForm">
        <h1 class="card-title">Reset</h1>
        <v-form @submit.prevent="resetPassword" v-model="resetForm">
          <v-text-field
            v-if="!IsPasswordEmailSent"
            v-model="user.email"
            autocomplete="email"
            label="Email"
            required
            :rules="emailRules"
          ></v-text-field>
          <v-card-text v-if="IsPasswordEmailSent">
            An Email has been sent to {{ this.user.email }} please check your
            spam folder.
          </v-card-text>
          <div class="card-button-container">
            <v-btn
              v-if="!IsPasswordEmailSent"
              size="small"
              type="submit"
              color="primary"
              class="mr-4 mb-4"
            >
              Reset
            </v-btn>
            <v-btn
              size="small"
              class="mb-5"
              @click="() => (IsShowResetForm = false)"
              >Login</v-btn
            >
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { authService } from "../../../services/auth/auth-services.js";
export default {
  name: "emailLogin",
  props: ["signInResponse"],
  data() {
    return {
      resetForm: true,
      loginForm: false,
      user: {
        email: "",
        password: "",
      },
      IsPasswordEmailSent: false,
      IsShowResetForm: false,
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
    switchForm(selectedForm) {
      this.$emit("switchForm", selectedForm);
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
    async resetPassword() {
      let reg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let IsValidEmail = reg.test(this.user.email);

      if (this.resetForm || IsValidEmail) {
        //todo make api call with nodemailer to reset password
        //will make this more professional
        //just more work later on down the road.
        const response = await authService.resetPassword(this.user.email);
        this.IsPasswordEmailSent = response;
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

.card-title {
  text-align: center;
  margin-bottom: 15px;
}
</style>
