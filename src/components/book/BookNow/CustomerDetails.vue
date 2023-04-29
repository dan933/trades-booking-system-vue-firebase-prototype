<template>
  <v-card flat rounded="0" class="service-card">
    <h3>Your Details</h3>
    <v-container>
      <v-form v-model="valid" @submit.prevent="storeCustomerDetails">
        <v-container class="name-container">
          <v-text-field
            style="width: 150px"
            v-model="firstName"
            label="First name"
            :rules="[(v) => !!v || 'First name is required']"
          ></v-text-field>
          <v-text-field
            style="width: 150px"
            v-model="lastName"
            label="Last name"
            :rules="[(v) => !!v || 'Last name is required']"
          ></v-text-field>
        </v-container>
        <v-text-field
          v-model="phoneNumber"
          label="Phone number"
          type="tel"
          :rules="[(v) => !!v || 'Phone number is required']"
        ></v-text-field>
        <v-textarea
          v-model="address"
          label="Address"
          :rules="[(v) => !!v || 'Address is required']"
        ></v-textarea>
        <v-btn color="primary" type="submit">Next</v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import { getCustomerDetails } from "../../../services/api/customerService.js";
export default {
  name: "CustomerDetails",
  data() {
    return {
      valid: false,
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
    };
  },
  props: ["selectedDateTimeSlot"],
  methods: {
    storeCustomerDetails() {
      // Store the customers details
      //todo add a feature to store customer addresses in a firestore database
      //todo add check to see if the customer is within the service range
      if (this.valid) {
        let customerDetails = {
          firstName: this.firstName,
          lastName: this.lastName,
          phoneNumber: this.phoneNumber,
          addressList: [this.address],
        };

        this.$emit("storeCustomerDetails", customerDetails);
      }
    },
    async getCustomer() {
      return await getCustomerDetails(this.orgId);
    },
    async init() {
      //check if the customers details are in the database

      let customer = await this.getCustomer();

      //if the details exist populate the form
      if (customer) {
        this.firstName = customer?.firstName || "";
        this.lastName = customer?.lastName || "";
        this.phoneNumber = customer?.phoneNumber || "";
        this.address =
          customer?.addressList?.length > 0 ? customer.addressList[0] : "";
      }
    },
  },
  computed: {
    orgId() {
      return this.$route.params.id;
    },
  },
  async mounted() {
    await this.init();
  },
};
</script>

<style lang="scss">
.name-container {
  display: flex;
  flex-wrap: wrap;
  column-gap: 3px;
  padding: 0px;
  margin: 0px;
}
.service-card {
  overflow: auto;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.service-form-container {
  overflow: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 5px;
  overflow: auto;
}
.border {
  border: black solid 2px !important;
  border-radius: 5px;
}
.service-item-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  column-gap: 10px;
  row-gap: 30px;
  margin-bottom: 10px;
}
</style>
