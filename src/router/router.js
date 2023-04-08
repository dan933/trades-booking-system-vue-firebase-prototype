import Home from "../components/home/Home.vue";
import About from "../components/about/About.vue";
import Services from "../components/services/services.vue";
import Contact from "../components/contact/contact.vue";
import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "firebase/auth";

const routes = [
  {
    name: "Home",
    path: "/",
    component: Home,
  },
  {
    name: "About",
    path: "/about",
    component: About,
  },
  {
    name: "Services",
    path: "/services",
    component: Services,
  },
  {
    name: "Contact",
    path: "/contact",
    component: Contact,
  },
  {
    name: "Book",
    path: "/book",
    component: () => import("../components/book/Book.vue"),
  },
  {
    name: "Auth",
    path: "/auth",
    component: () => import("../components/book/auth/Auth.vue"),
  },
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});
router.beforeEach(async (to, from, next) => {
  const auth = getAuth().currentUser;

  let IsLoggedIn = !!auth;

  // console.log(IsLoggedIn);

  if (to.name === "Auth" && IsLoggedIn) next({ name: "Book" });
  if (to.name === "Book" && !IsLoggedIn) next({ name: "Auth" });
  else next();
});

export default router;
