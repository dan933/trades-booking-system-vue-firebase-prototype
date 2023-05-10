import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Vuetify from "./plugins/vuetify.js";
import Router from "./router/router.js";
import { Calendar, DatePicker } from "v-calendar";
import { VDataTable } from "vuetify/labs/VDataTable";
//auth needs to be imported here
import { auth } from "./services/firebase/firebaseConfig.js";
import "v-calendar/style.css";
import store from "./store/bookingStore.js";

createApp(App)
  .use(Router)
  .use(store)
  .use(Vuetify)
  .component("VCalendar", Calendar)
  .component("VDatePicker", DatePicker)
  .component("VDataTable", VDataTable)
  .mount("#app");
