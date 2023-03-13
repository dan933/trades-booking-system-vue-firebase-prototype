<template>
    <div class="contact-container">

        <div class="text-h3">Contact</div>

        <div class="text-body">
            We would love to hear from you please leave us a message and we will get back to you as soon as possible
        </div>

    </div>

    <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
      <v-text-field v-model="name" :rules="nameRules" label="Name"></v-text-field>
      <v-text-field v-model="email" :rules="emailRules" label="Email"></v-text-field>
      <v-textarea v-model="message" :rules="messageRules" label="Message"></v-textarea>
      <v-btn type="submit" color="primary">Submit</v-btn>
    </v-form>
</template>
  
  <script>
  export default {
    name:'Contact',
    data() {
      return {
        name: '',
        email: '',
        message: '',
        valid: false,
        nameRules: [
          (v) => !!v || 'Name is required',
          (v) => v.length <= 50 || 'Name must be less than 50 characters'
        ],
        emailRules: [
          (v) => !!v || 'Email is required',
          (v) =>  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Email must be valid'
        ],
        messageRules: [
          (v) => !!v || 'Message is required',
          (v) => v.length <= 500 || 'Message must be less than 500 characters'
        ]
      }
    },
    methods: {
      submitForm() {
        if (this.$refs.form.validate()) {
          const formData = {
            name: this.name,
            email: this.email,
            message: this.message,
          }
          // Here you can use axios or any other library to make a post request to your backend
          console.log(formData)
        }
      }
    }
  }
  </script>
<style lang="scss">
    .contact-container{
        display: flex;
        row-gap: 20px;
        flex-direction: column;
        max-width: 400px;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        padding-left: 5px;
        padding-right: 5px;
        text-align: center;
    }
</style>