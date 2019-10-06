<template>
  <div class="mx-auto mt-3">
    <!-- User Interface controls -->
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group horizontal :label-cols="2" label-size="sm" label="Chercher" class="mb-0">
        <b-form-input v-model="filter" placeholder="Identifiant du candidat" size="sm"/>
        </b-form-group>
      </b-col>
      <b-col md="2">
      </b-col>
      
    </b-row>

    <!-- Main table element -->
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
      <template slot="candidateName" slot-scope="row">{{row.items.candidatID}}</template>
      <template slot="votes" slot-scope="row">{{row.item.votes}}</template>

      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->

        <b-button size="sm" class="mr-1" v-b-modal.remove v-on:click="removeCandiate(row.item.candidat, row.item)">
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

const items50 = [
  { id: 1,  candidat: "m@ens", votes:  12 },
  { id: 2,  candidat: "a@ens", votes:  13 },
  { id: 3,  candidat: "t@ens", votes:  16 },
  { id: 5,  candidat: "t@ens", votes:  95 },
  { id: 4,  candidat: "h@ens", votes: 102 },
  { id: 6,  candidat: "i@ens", votes:  45 },
  { id: 7,  candidat: "e@ens", votes:   8 },
  { id: 8,  candidat: "u@ens", votes:  25 },
  { id: 9,  candidat: "1@ens", votes:  75 },
  { id: 10, candidat: "2@ens", votes:   2 },
  { id: 11, candidat: "3@ens", votes:   1 },
  { id: 12, candidat: "4@ens", votes:   3 }
]

export default {
  data () {
    return {
      items: [],
      fields: [
        { key: 'candidat', label: 'Nom', sortable: true, 'class': 'text-center' },
        { key: 'votes', label: 'votes', sortable: true, 'class': 'text-center' },
        { key: 'actions', label: 'Actions', 'class': 'text-center' }
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: items50.length,
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
    async removeCandiate(cid, id) {
      var results = await axios.post(this.$http + 'deleteCandidat',
      {
        roundID : this.$route.query.sid,
        candidatID : cid
      })
      .then(res => {
          res.data.message
      })
      var pos = this.items.map(e=> e.candidat).indexOf(id.candidat)
      this.items.splice(pos, 1)
      alert("Candidat supprimer!");
    },
    async getCandidates() {
      const sid = this.$route.query.sid;
      await axios.post(this.$http + 'getResultsAdmin',
          {
              "roundID": sid
          },
          {
            headers : {'Access-Control-Allow-Origin': '*'}
          }
          )
      .then(rounds => {console.log(rounds.data);
                        this.items = rounds.data})
      //this.items = items50;
      console.log("test");
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
