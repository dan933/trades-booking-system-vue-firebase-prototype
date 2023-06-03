<template>
  <nav>
    <v-app-bar :elevation="2" class="nav">
      <v-btn v-if="!mdAndUp" @click.stop="drawer = !drawer">
        <v-icon icon="mdi:mdi-menu"></v-icon>
      </v-btn>
      <h4 class="header-text" :class="{ 'ma-5': mdAndUp }">
        Booking prototype
      </h4>
      <div v-if="mdAndUp">
        <v-btn
          @click="
            () => {
              navigate('/');
            }
          "
          variant="flat"
          >Overview</v-btn
        >
        <v-btn
          @click="
            () => {
              navigate('/about');
            }
          "
          variant="flat"
          >About</v-btn
        >
        <v-btn
          @click="
            () => {
              navigate('/services');
            }
          "
          variant="flat"
          >Services</v-btn
        >
        <v-btn
          @click="
            () => {
              navigate('/org/Okq3IGUln18QM90ObeI4/book');
            }
          "
          variant="flat"
          >Book Online</v-btn
        >
        <v-btn
          @click="
            () => {
              navigate('/contact');
            }
          "
          variant="flat"
          >Contact</v-btn
        >
      </div>
      <div v-if="!!currentUser" class="account-container">
        <v-btn color="primary">
          <v-icon>mdi:mdi-account</v-icon>
          <v-menu transition="slide-x-transition" activator="parent">
            <v-list>
              <v-list-item :title="currentUser.email"> </v-list-item>

              <v-list-item
                prepend-icon="mdi:mdi-logout"
                title="Sign Out"
                value="logoutButton"
                @click="logout"
              >
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </div>
    </v-app-bar>
  </nav>
  <v-navigation-drawer v-model="drawer" temporary>
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item
        @click="
          () => {
            navigate('/');
          }
        "
        prepend-icon="mdi:mdi-view-dashboard"
        title="Home"
        value="home"
      ></v-list-item>
      <v-list-item
        @click="
          () => {
            navigate('/about');
          }
        "
        prepend-icon="mdi:mdi-forum"
        title="About"
        value="about"
      ></v-list-item>
      <v-list-item
        @click="
          () => {
            navigate('/services');
          }
        "
        prepend-icon="mdi:mdi-wrench"
        title="Services"
        value="services"
      ></v-list-item>
      <v-list-item
        @click="
          () => {
            navigate('/org/Okq3IGUln18QM90ObeI4/book');
          }
        "
        prepend-icon="mdi:mdi-calendar-blank-outline"
        title="Book Online"
        value="Book"
      ></v-list-item>
      <v-list-item
        @click="
          () => {
            navigate('/contact');
          }
        "
        prepend-icon="mdi:mdi-account-box "
        title="Contact Us"
        value="contact"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="js">

import { useDisplay } from 'vuetify'
import { getAuth, signOut } from "firebase/auth";

export default {
    name: "NavBar",
    setup () {
      // Destructure only the keys we want to use
        const { mdAndUp } = useDisplay()

      return { mdAndUp }
    },
    data () {
      return {
            drawer: null,
            currentUser:null
      }
    },
    methods: {
        logout() {
            let auth = getAuth();

            signOut(auth).then(() => {
                this.$router.push('/');
            }).catch((err) => {console.log(err)})
        },
        navigate(route) {

            if (!this.mdAndUp) {

                this.drawer = !this.drawer;
            }

            this.$router.push(route);
        }
    },
    computed: {
    },
    mounted() {
        getAuth()
            .onAuthStateChanged((auth) => {
                this.currentUser = auth;
        })
    }
}
</script>

<style lang="scss">
.account-container {
  margin-left: auto;
  margin-right: 15px;
}

.v-toolbar__content {
  display: flex;
  column-gap: 5px;
}
</style>
