<template>
  <div class="mx-auto mt-3">
    <!-- User Interface controls -->
    <!--
    <b-row>
      <b-col md="4" class="my-1">
        <b-button to="/vote" size="sm" variant='danger'>
          Retour
        </b-button>
      </b-col>
    </b-row>
    -->
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

    </b-table>

  </div>
</template>

<script>
import axios from 'axios';



export default {
  data () {
    return {
      param : null,
      items: [],
      fields: [
        { key: 'candidat', label: 'Nom', sortable: true, 'class': 'text-center' },
        { key: 'votes', label: 'votes', sortable: true, 'class': 'text-center' }
      ],
      currentPage: 1,
      perPage: 2000,
     // totalRows: items50.length,
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
    async getResults() {
      const sid = this.$route.query.sid;
      await axios.post(this.$http + 'getResults',
          {
              pointer : this.param.pointer,
              candidatID : this.param.candidatID,
              privateCode : this.param.privateCode
          }
      )
      .then(res => {this.items = res.data})
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
  async created() {
    console.log("i am top");
    this.param = {
      pointer : this.$route.query.pointer,
      candidatID : this.$route.query.cid,
      privateCode : localStorage.getItem('code')
    }
    await this.getResults();
    
  }
}
</script>
