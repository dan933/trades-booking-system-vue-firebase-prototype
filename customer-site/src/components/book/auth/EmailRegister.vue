<template>
  <v-container>
    <v-card class="mx-auto" min-width="150">
      <h1 class="card-title">Register</h1>
      <v-card-text>
        <v-form
          @submit.prevent="register"
          v-model="registrationForm"
          ref="registrationFormRef"
        >
          <v-text-field
            class="mb-2"
            v-model="userRegister.email"
            label="Email"
            type="email"
            autocomplete="email"
            required
            :rules="emailRules"
          ></v-text-field>
          <v-text-field
            class="mb-2"
            v-model="userRegister.password"
            label="Password"
            type="password"
            autocomplete="new-password"
            :rules="passwordRules"
            required
          ></v-text-field>
          <v-text-field
            class="mb-2"
            v-model="userRegister.confirmPassword"
            label="Confirm Password"
            type="password"
            autocomplete="new-password"
            :rules="confirmPasswordRules"
            required
          ></v-text-field>
          <div class="card-button-container">
            <v-btn size="small" type="submit" color="primary" class="mr-4 mb-4">
              Register
            </v-btn>
            <v-btn
              size="small"
              class="mr-4 mb-4"
              @click="() => switchForm('Login')"
            >
              Have an account?
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "emailRegister",
  data() {
    return {
      registrationForm: false,
      userRegister: {
        email: "dnadistrictservices@gmail.com",
        password: "daniel180",
        confirmPassword: "daniel180",
      },
      emailRules: [
        (v) => !!v || "Email is required",
        (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Email must be valid",
      ],
    };
  },
  computed: {
    passwordRules() {
      return [
        (value) => !!value || "Password Required",
        (value) =>
          value?.length > 6 || "Password must be greater than 6 charecters",
      ];
    },
    confirmPasswordRules() {
      return [
        (value) => !!value || "Password Required",
        () =>
          this.userRegister.password === this.userRegister.confirmPassword ||
          "Password must match",
      ];
    },
  },
  methods: {
    switchForm(selectedForm) {
      this.$emit("switchForm", selectedForm);
    },
    validateForm() {
      this.$nextTick(() => {
        this.registrationForm = !!this.$refs.registrationFormRef.validate();
      });
    },
    register() {
      console.log(this.registrationForm);
      if (this.registrationForm) {
        let newUser = {
          email: this.userRegister.email,
          password: this.userRegister.password,
        };

        this.$emit("registerEmailUser", newUser);
      }
    },
  },
  mounted() {
    // Validate the form as soon as the component is mounted
    this.validateForm();
  },
  watch: {
    userRegister: {
      handler() {
        this.validateForm();
      },
      deep: true,
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
  margin-top: 10px;
  text-align: center;
}
</style>
