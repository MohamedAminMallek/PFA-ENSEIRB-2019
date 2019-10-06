<template>
  <div class="mx-auto mt-3">
    <!-- User Interface controls -->
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group horizontal :label-cols="2" label-size="sm" label="Chercher" class="mb-0">
        <b-form-input v-model="filter" placeholder="Session" size="sm"/>
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

      <template slot="sessionName" slot-scope="row">{{row.value}}</template>
      <template slot="date" slot-scope="row">{{ row.value | moment("DD/MM/YYYY") }}</template>
      <template slot="state" slot-scope="row">

        <b-button v-if="isInactive(row.value)"
                       variant="primary"
                       :disabled="true"
                       :key="row.item.id"
                       class="x-btn-text round">Inactive</b-button>

       <b-button v-if="isActive(row.value)"
                      variant="success"
                      :disabled="true"
                      :key="row.item.id"
                      class="x-btn-text round">Active</b-button>

      </template>
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <b-button :to="'RemoveCandidate2/?sid='+row.item.id" size="sm" class="mr-1">
          Afficher les candidats
        </b-button>
        <b-button :to="'RemoveVoter/?sid='+row.item.id" size="sm" class="mr-1">
          Afficher les votants
        </b-button>
        <b-button :to="'results/?sid='+row.item.id" size="sm" class="mr-1">
          Afficher les résultats
        </b-button>

      </template>
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>

  </div>
</template>

<script>
import axios from 'axios';

const items50 = [
  { id: 1,  state: "active",   date: new Date(2018,6,4).getTime(),  sessionName: "Info 3A" },
  { id: 2,  state: "inactive", date: new Date(2018,6,1).getTime(),  sessionName: "Elec 3A" },
  { id: 3,  state: "archived", date: new Date(2018,5,28).getTime(), sessionName: "MMK 3A"},
  { id: 4,  state: "inactive", date: new Date(2018,6,3).getTime(),  sessionName: "Telecom 3A" },
  { id: 5,  state: "active",   date: new Date(2018,4,3).getTime(),  sessionName: "Session 5" },
  { id: 6,  state: "inactive", date: new Date(2018,4,3).getTime(),  sessionName: "Session 6" },
  { id: 7,  state: "active",   date: new Date(2017,6,4).getTime(),  sessionName: "Session 7" },
  { id: 8,  state: "archived", date: new Date(2017,6,1).getTime(),  sessionName: "Session 8" },
  { id: 9,  state: "inactive", date: new Date(2017,5,28).getTime(), sessionName: "Session 9" },
  { id: 10, state: "archived", date: new Date(2017,6,3).getTime(),  sessionName: "Session 10" },
  { id: 11, state: "active",   date: new Date(2016,4,3).getTime(),  sessionName: "Session 11" },
  { id: 12, state: "inactive", date: new Date(2016,4,3).getTime(),  sessionName: "Session 12" }
]
/*function filterArchived(items){
  var items2;
  items.forEach(function(element) {
    if(element.state != "archived"){
      items2.push(element);
    }
  });
  return items2;
}
const items2 = filterArchived(items);
*/
export default {
  data () {
    return {
      items: [],
      fields: [
        { key: 'Session.title', label: 'Nom', sortable: true, 'class': 'text-center' },
        { key: 'startDate', label: 'Date', sortable: true, 'class': 'text-center' },
        { key: 'state', label: 'Statut', sortable: true, 'class': 'text-center' },
        { key: 'actions', label: 'Actions', 'class': 'text-center' }
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 9,
      pageOptions: [ 5, 10, 15 ],
      sortBy: 'date',
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
    filterArchived(items){
      var items2 = [];
      items.forEach(function(element) {
        if(element.state != "archived"){
          items2.push(element);
        }
      });
      return items2;
    },
    async getRounds() {
      axios.get(this.$http + 'rounds',
                { headers: { 'Access-Control-Allow-Origin': '*'} })
      .then(rounds => {console.log(rounds.data);
                       this.items = this.filterArchived(rounds.data)})


    },
    isActive(state) {
      return state === "active";
    },
    isInactive(state) {
      return state === "inactive";
    },
    isArchived(state) {
      return state === "archived";
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
  mounted() {
    this.$root.$on('bv::modal::hide', (bvEvent) => {
    if (bvEvent.target.id == "remove" && bvEvent.trigger == "ok")
      this.remove(this.removeItem);
    if (bvEvent.target.id == "archive" && bvEvent.trigger == "ok") {
      this.archiveItem.state = stateEnum.ARCHIVED;
    }
    })
  },
  created() {
    //console.log("hello");
    this.getRounds();
  }
}
</script>
<style scoped>
.round {
  padding: 3px 15px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
</style>
