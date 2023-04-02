<template>
  <v-container>
    <v-card class="mx-auto" max-width="500">
      <v-card-text>
        <v-form @submit.prevent="register">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit" color="primary" class="mr-4"> Register </v-btn>
          <v-btn @click="switchForm">Already have an account?</v-btn>
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
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    switchForm() {
      this.$emit("switchForm");
    },
    register() {
      // perform registration logic here
      console.log("Email:", this.email);
      console.log("Password:", this.password);
      console.log("Confirm Password:", this.confirmPassword);
    },
  },
};
</script>
