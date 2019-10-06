<template>
<div class="mx-auto mt-3">
  <h1>Résultats</h1>
  <ul class="list-unstyled">
    <div :key="item.candidat" v-for="item in items" :if="(items.indexOf(item)+1) <= nbMaxCandidate">
      <b-jumbotron>
      <b-row>
        <b-col md="1" class="my-1">
          <h1>{{ items.indexOf(item)+1}}</h1>
        </b-col>
        <b-col md="11">
          <h3>{{item.candidat}}</h3>
          <p>{{item.candidat}}</p>
        </b-col>
      </b-row>
      </b-jumbotron>
  </div>
  </ul>
  <b-row>
      <b-col md="4" class="my-1">
        <b-button to="/" size="sm" variant='danger'>
          Retour
        </b-button>
      </b-col>
    </b-row>
</div>

</template>

<script>
import axios from 'axios';
/*
const items = [
  {rank: 1, id: 'toto@enseirb-matmeca.fr',     name: 'Mon stage chez les alpagas'},
  {rank: 2, id: 'tobozo@enseirb-matmeca.fr',   name: 'Étude d\'un canon à poulets pour l\'aéronautique'},
  {rank: 3, id: 'patrick@enseirb-matmeca.fr',  name: 'Dévelopement d\'un site pour l\'académi francaise'},
  {rank: 4, id: 'jean.bon@enseirb-matmeca.fr', name: 'Oui'},
  {rank: 5, id: 'jeanne@enseirb-matmeca.fr',   name: 'Le langage des baleines'}
]*/

export default {
  data () {
    return {
      items: [],
      fields: [],
      nbMaxCandidate : 3
    }
  },
  methods: {
    async getCandidates() {
      const sid = this.$route.query.sid;
      await axios.post(this.$http + 'getResultsAdmin',
          {
              "roundID": sid
          })
      .then(rounds => {
        
        this.items = rounds.data
        
        })
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    remove(item) {
      let index = items.indexOf(item);
      items.splice(index,1);
    }
  },
  created() {
    //console.log("hello");
    this.getCandidates();
  }
}
</script>
