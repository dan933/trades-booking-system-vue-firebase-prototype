import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Router from "./router/router.js";
import store from "./store/bookingStore.js";
//auth needs to be imported here
import { auth } from "./services/firebase/firebaseConfig.js";

createApp(App).use(Router).use(store).mount("#app");
