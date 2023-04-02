<template>
  <v-container>
    <v-card class="mx-auto" max-width="500">
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="username"
            label="Username"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <div class="mb-4"><a href="#">Forgot Password</a> <br /></div>
          <v-btn type="submit" color="primary" class="mr-4"> Login </v-btn>
          <v-btn @click="switchForm">Register Account</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "emailLogin",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    switchForm() {
      this.$emit("switchForm");
    },
    login() {
      // perform login logic here
      console.log("Username:", this.username);
      console.log("Password:", this.password);
    },
  },
};
</script>
