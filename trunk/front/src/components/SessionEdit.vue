<template>
  <div class="mx-auto mt-3">
    <b-container>
      <b-jumbotron>
        <template slot="header">
          Éditer {{round != null ? round.Session.title : "Session"}}
        </template>
        <session-form v-if="!showGroups" v-bind:round="round" v-on:submit="onEdit($event);showGroups=true"></session-form>
        <groups v-else v-on:submit="onGroup($event)"></groups>
      </b-jumbotron>
    </b-container>
  </div>
</template>

<script>
import Groups from './AddGroupSession.vue';
import SessionForm from './SessionForm';
import axios from 'axios';
import { fail } from 'assert';

export default {
  components:{
    Groups,
    SessionForm
  },
  data () {
    return {
      round : null,
      showGroups : false
    }
  },
  methods: {
    async getRound() {
      let id = this.$route.query.sid;
      let currentRound = null;
      await axios.get(this.$http + 'rounds',
                { headers: { 'Access-Control-Allow-Origin': '*'} })
      .then(rounds => { rounds.data.forEach( function (round) {
                        if (round.id == id)
                          currentRound = round;
                       });
                       this.round = currentRound;
                      }
            );
    },
    async onEdit (form) {
      
      let url = this.$http;
      
      await axios.post(url + "updateSession", {
        sessionID: this.round.sessionID,
        title: form.sessionName,
        startDate: form.start.date + 'T' + form.start.hour + ':00.000Z',
        endDate: form.end.date + 'T' + form.end.hour + ':00.000Z'
      });

      await axios.post(url + "updateRound", {
        roundID: this.round.id,
        pointer: form.pointer,
        startDate: form.start.date + 'T' + form.start.hour + ':00.000Z',
        endDate: form.end.date + 'T' + form.end.hour + ':00.000Z'
      });

      //this.$router.push({path: '/edit', query:{created : true,sid: id}});
    },
    async onGroup (groups) {

      

      let url = this.$http;
      let idRound = this.round.id;
      let failed = true
      groups.forEach(async function(g)  {
        var idGroup;
        if(g.groupCreated == null)
        {          
          await axios.post(url + "addGroup", {name: g.name})
          .then(res=>{
            idGroup = res.data.id;
          })
        } else {
          idGroup = g.groupCreated.id;
        }
        
        await axios.post(url + "linkGroupRound", {
          roundID: idRound,
          groupID: idGroup,
          privateCode: g.code,
          displayModeID: g.displayMode.id,
          voteMethodID: g.method.id
        })
        .then(res=>{
          let name = (g.groupCreated==null)?g.name:g.groupCreated.name
          if(res.data.error==true)
            alert("Le groupe  " + name + " n'a pas pu être ajouté au round! \n\nVérifiez votre code secret ")
          
          //location.reload();
        })
      });
      this.$router.push('/');
    },
  },
  created() {
    //console.log("hello");
    this.getRound();
    this.showGroups = this.$route.query.created;
  }
}
</script>