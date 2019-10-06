<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" id="title">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand>Mon beau Post'eirb</b-navbar-brand>
      <!--img v-bind:style="{marginRight : '20px'}" align=right src="/static/logo.png"-->
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item v-if="loggedIn" to="/">Liste sessions</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <!-- Using button-content slot -->
          <b-nav-item to="/about">À propos</b-nav-item>
          <b-nav-item v-if='loggedIn' v-on:click="logout()">Se déconnecter</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!--b-jumbotron header="Mon Beau Post'eirb"></b-jumbotron-->
    <!--session-list></session-list-->
    <b-container>
      <router-view/>
    </b-container>
  </div>
</template>

<script>
import store from "./store";
import axios from "axios";

export default {
  methods: {
    logout: function(event) {
      localStorage.removeItem('token')
      location.reload()
    }
  },
  computed: {
    
    loggedIn: function() {
      var token = localStorage.getItem('token')
      return (token != undefined)
    }
    
  },
  mounted() {
    this.$store.dispatch("init");
    //this.$router.push("/login")
  }
};
</script>

<style>
#title {
  background-color: #f29400;
}
</style>
