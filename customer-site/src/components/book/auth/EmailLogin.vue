<template>
  <div>
    <div class="login-card" min-width="150">
      <div v-if="!IsShowResetForm">
        <h1 class="card-title">Login</h1>
        <div @submit.prevent="login">
          <input v-model="user.email" autocomplete="email" label="Email" required :rules="emailRules"></input>
          <input v-model="user.password" label="Password" autocomplete="current-password" type="password" required
            :rules="passwordRules"></input>
          <!-- <v-alert v-if="signInResponse?.IsPasswordIncorrect" class="mb-3" type="error"
            :text="signInResponse?.errorMessage" variant="outlined" density="compact"></v-alert> -->
          <div class="mb-5" @click="() => (IsShowResetForm = true)">
            <a href="#">Forgot Password</a> <br />
          </div>
          <div class="card-button-container">
            <button size="small" type="submit" color="primary" class="mr-4 mb-4">
              Login
            </button>
            <button size="small" class="mb-5" @click="() => switchForm('Register')">Register Account</button>
          </div>
        </div>
      </div>
      <div v-if="IsShowResetForm">
        <h1 class="card-title">Reset</h1>
        <div @submit.prevent="resetPassword">
          <input v-if="!IsPasswordEmailSent" v-model="user.email" autocomplete="email" label="Email" required
            :rules="emailRules"></input>
          <div v-if="IsPasswordEmailSent">
            An Email has been sent to {{ this.user.email }} please check your
            spam folder.
          </div>
          <div class="card-button-container">
            <button v-if="!IsPasswordEmailSent" size="small" type="submit" color="primary" class="mr-4 mb-4">
              Reset
            </button>
            <button size="small" class="mb-5" @click="() => (IsShowResetForm = false)">Login</button>
          </div>
        </div>
      </div>
      <slot name="providers"></slot>
    </div>
  </div>
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
<style>
.login-card {
  width: 464px;
  height: 710px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  background-color: white;
}

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
