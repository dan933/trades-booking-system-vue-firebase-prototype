import Home from "../components/home/Home.vue";
import About from "../components/about/About.vue";
import Services from "../components/services/services.vue";
import Contact from "../components/contact/contact.vue";
import NotFound from "../components/not-found/NotFound.vue";
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
    path: "/org/:id/book",
    component: () => import("../components/book/BookNow/Book.vue"),
  },
  {
    name: "Auth",
    path: "/org/:id/auth",
    component: () => import("../components/book/auth/Auth.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
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

  //The organisation id from the previous page
  let org = from.params.id || to.params.id;

  console.log("org", org);

  if (to.name === "Auth" && IsLoggedIn) next({ path: `/org/${org}/book` });
  if (to.name === "Book" && !IsLoggedIn) next({ path: `/org/${org}/auth` });
  else next();
});

export default router;
