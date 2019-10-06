<template>
  <div class="mx-auto mt-3">
    <b-row>
      <b-col col-sm="10" offset-sm="1" lg="6" offset-lg="3">
        <b-jumbotron>
          <b-form v-on:submit.prevent="login">
            <b-form-group label="Username :" label-for="username">
              <b-form-input type="text" id="username" v-model="form.username"></b-form-input>
            </b-form-group>
            <b-form-group label="Password :" label-for="password">
              <b-form-input type="password" id="password" v-model="form.password"></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-button class="btn-info btn" type="submit">Se connecter</b-button>
            </b-form-group>
          </b-form>
          <b-alert
            variant="danger"
            dismissible
            :show="wrongPassword"
            @dismissed="wrongPassword=false"
          >Mauvais couple username/password</b-alert>
        </b-jumbotron>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import store from "../store";

import sha256 from "js-sha256";
import axios from "axios";

export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      wrongPassword: false
    };
  },
  methods: {
    login: function(event) {
      this.wrongPassword = false;
      const username = this.form.username;
      const password = this.form.password;
      const hashedPassword = sha256(username+password);
      const cookie = this.$store.getters.token;
      axios
        .post(this.$http + "login", { username: username, password: password, hash: hashedPassword, authcookie: cookie })
        .then(response => {
          if (response.data.valid==true){
            if (response.data.cookie != undefined) {
              localStorage.setItem("token", response.data.cookie)
            }
              
            this.wrongPassword = false;
            location.reload()
            //this.$router.push('/')
          } else {
            this.wrongPassword = true;
          }
        })
        .catch(error => {
          this.wrongPassword = true;
        });
    }
  }
};
</script>

<style>
</style>
