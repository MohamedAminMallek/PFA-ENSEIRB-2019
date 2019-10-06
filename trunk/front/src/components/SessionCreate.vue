<template>
  <div class="mx-auto mt-3">
    <b-container>
      <b-jumbotron>
        <template slot="header">
          Créer nouvelle session
        </template>
        <session-form v-on:submit="onSubmit($event)"></session-form>
      </b-jumbotron>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios';
import SessionForm from './SessionForm';

export default {
  components:{
    SessionForm
  },
  data () {
    return {
    }
  },
  methods: {
    async onSubmit (form) {

      console.log("je suis submit")

      let url = this.$http;
      var id;
      //console.log(form);
      await axios.post(url + "addSession", {
        title: form.sessionName,
        startDate: form.start.date + 'T' + form.start.hour + ':00.000Z',
        endDate: form.end.date + 'T' + form.end.hour + ':00.000Z'
      })
      .then(res=>{
        id = res.data.id;
      })
      .catch(err=>{});

      await axios.post(url + "addRound", {
        sessionID: id,
        pointer: form.pointer,
        startDate: form.start.date + 'T' + form.start.hour + ':00.000Z',
        endDate: form.end.date + 'T' + form.end.hour + ':00.000Z'
      })
      .then(res=>{
        id = res.data.id;
        this.$router.push({path: '/edit/', query:{created: true, sid: id}});
      })
    }
  }
}
</script>
