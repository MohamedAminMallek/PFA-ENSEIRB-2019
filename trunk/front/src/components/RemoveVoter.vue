<template>
  <div class="mx-auto mt-3">
    <!-- User Interface controls -->
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group horizontal :label-cols="2" label-size="sm" label="Chercher" class="mb-0">
        <b-form-input v-model="filter" placeholder="Identifiant du Votant" size="sm"/>
        </b-form-group>
      </b-col>
      <b-col md="2">
      </b-col>
      
    </b-row>

    <!-- Main table element -->
    <!--
    <b-table show-empty
             stacked="md"
             :items="items"
             :fields="fields"
             :current-page="currentPage"
             :per-page="perPage"
             :filter="filter"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             :sort-direction="sortDirection"
             @filtered="onFiltered"
    >
      <template slot="voterName" slot-scope="row">{{row.items.voterId }}</template>
      <template slot="votes" slot-scope="row">{{row.item.CandidatID}}</template>
      <template slot="candidats" slot-scope="row">{{row.items.votes}}</template>
      <template slot="actions" slot-scope="row">
        
        <b-button size="sm" class="mr-1" v-b-modal.remove v-on:click="removeVoter(row.item.voterID, row.item)">
          Supprimer
        </b-button>

      </template>
    </b-table>
    -->
     <b-table 
          :items="items" 
          :fields="fields"
          :current-page="currentPage"
             :per-page="perPage"
             :filter="filter"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             :sort-direction="sortDirection"
             @filtered="onFiltered"
             striped>
     <template slot="voterId" slot-scope="row">
     {{ row.item.voterId }}
     </template>
     <template slot="candidatID" slot-scope="row">
     {{ row.item.candidatID }}
     </template>
     <template slot="votes" slot-scope="row">
     {{ row.item.votes }}
     </template>
     <template slot="delete" slot-scope="row">
     <b-button size="sm" class="mr-1" v-b-modal.remove v-on:click="removeVoter(row.item.voterId, row.item)">
          Supprimer
        </b-button>
     </template>
     </b-table>
    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
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


export default {
  data () {
    return {
      items: [],
      /*fields: [
        { key: 'Voter', label: 'Voter ID', sortable: true, 'class': 'text-center' },
        { key: 'candidats', label: 'Candidat', sortable: true, 'class': 'text-center' },
        { key: 'Votes', label: 'Votes', sortable: true, 'class': 'text-center' },
        { key: 'actions', label: 'Actions', 'class': 'text-center' }
      ]*/
       fields: [
         {key : 'voterId',label : 'Votants','class': 'text-center' },
         {key : 'candidatID', label : 'Candidats','class': 'text-center' } ,
         {key : 'votes',label : 'Voix','class': 'text-center' } ,
         {key : 'delete',label : 'Action','class': 'text-center' }],
      currentPage: 1,
      perPage: 5,
      totalRows: 1000,
      pageOptions: [ 5, 10, 15 ],
      sortBy: 'votes',
      sortDesc: true,
      sortDirection: 'desc',
      filter: null,
      removeItem: null,
      archiveItem: null
    }
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => { return { text: f.label, value: f.key } })
    }
  },
  methods: {
    async removeVoter(voterId, item) {
      var results = await axios.post(this.$http + 'deleteVoter',
      {
              voterId : voterId,
              roundID : this.$route.query.sid
      })
      var pos = this.items.map(e=> e.voterId).indexOf(voterId)
      this.items.splice(pos, 1)
      alert("Voter supprimer!");
    },
    async getVoter() {
      const sid = this.$route.query.sid;
      await axios.post(this.$http + 'getVoters',
          {
              "roundID": sid
          })
      .then(rounds => {
        this.items = rounds.data})
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
    this.getVoter();
  }
}
</script>
