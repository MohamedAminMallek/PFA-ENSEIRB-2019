<template>
  <div class="mx-auto mt-3">
    <!-- User Interface controls -->
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group horizontal :label-cols="2" label-size="sm" label="Chercher" class="mb-0">
        <b-form-input v-model="filter" placeholder="Session" size="sm"/>
        </b-form-group>
      </b-col>
      <b-col md="2" class="my-1">
        <b-button to="create" size="sm">
          Ajouter une session
        </b-button>
      </b-col>
      <b-col md="2" class="my-1">
        <b-button to="groups" size="sm">
          Gestion des groupes
        </b-button>
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
      <template slot="startDate" slot-scope="row">{{ row.value | moment("DD/MM/YYYY") }}</template>
      <template slot="state" slot-scope="row">

        <b-button v-if="isArchived(row.value)"
                       :disabled="true"
                       :key="row.item.id"
                       class="x-btn-text round">Archivée</b-button>

        <toggle-button v-else
                       :value="isActive(row.value)"
                       :sync="true"
                       v-on:change="toggle(row.item)"
                       :labels="{checked: 'Active', unchecked: 'Inactive'}"
                       :width="95"
                       :height="30"
                       :font-size="14"
                       :color="{checked: '#5cb85c', unchecked: '#428bca'}"
                       :key="row.item.id"/>
      </template>
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <b-button :to="{path:'/edit', query:{sid: row.item.id}}"
                  size="sm"
                  class="mr-1"
                  :disabled="isArchived(row.item.state) || !row.item.editable"
                  >
          Modifier
        </b-button>
        
         
        
        <!--
        <b-button :to="'results/?sid='+row.item.id" size="sm" class="mr-1" :disabled="isArchived(row.item.state)">
          Consulter
        </b-button>
        -->
        <b-button size="sm" class="mr-1" v-b-modal.archive v-on:click="archiveItem = row.item" :disabled="isArchived(row.item.state)">
          Archiver
        </b-button>
        <b-button size="sm" class="mr-1" v-b-modal.remove v-on:click="removeItem = row.item">
          Supprimer
        </b-button>
        <b-dropdown id="dropdown-1" text="Plus d'options" size="sm" class="mr-1" :disabled="isArchived(row.item.state)">
          <b-dropdown-item :to="'results/?sid='+row.item.id">
          <!--
            <b-button :to="'results/?sid='+row.item.id" size="large" class="mr-1"  :disabled="isArchived(row.item.state)">
            -->
              Afficher les résultats
            <!--</b-button>-->
          </b-dropdown-item>
          <b-dropdown-item :to="'RemoveCandidate2/?sid='+row.item.id">Gérer les candidats</b-dropdown-item>
          <b-dropdown-item :to="'RemoveVoter/?sid='+row.item.id">Gérer les votants</b-dropdown-item>
         </b-dropdown>
      </template>
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>

    <b-modal id="remove" title="Supprimer la session">
      <p class="my-4">Etes-vous sûr ?</p>
    </b-modal>

    <b-modal id="archive" title="Archiver la session">
      <p class="my-4">Etes-vous sûr ?</p>
    </b-modal>

    
  </div>
</template>

<script>
import { ToggleButton } from 'vue-js-toggle-button'
import axios from 'axios';

const items = [/*
  { id: 1,  state: "active",   date: new Date(2018,6,4).getTime(),  sessionName: "Info 3A" },
  { id: 2,  state: "inactive", date: new Date(2018,6,1).getTime(),  sessionName: "Elec 3A" },
  { id: 3,  state: "stocked", date: new Date(2018,5,28).getTime(), sessionName: "MMK 3A"},
  { id: 4,  state: "inactive", date: new Date(2018,6,3).getTime(),  sessionName: "Telecom 3A" },
  { id: 5,  state: "active",   date: new Date(2018,4,3).getTime(),  sessionName: "Session 5" },
  { id: 6,  state: "inactive", date: new Date(2018,4,3).getTime(),  sessionName: "Session 6" },
  { id: 7,  state: "active",   date: new Date(2017,6,4).getTime(),  sessionName: "Session 7" },
  { id: 8,  state: "stocked", date: new Date(2017,6,1).getTime(),  sessionName: "Session 8" },
  { id: 9,  state: "inactive", date: new Date(2017,5,28).getTime(), sessionName: "Session 9" },
  { id: 10, state: "stocked", date: new Date(2017,6,3).getTime(),  sessionName: "Session 10" },
  { id: 11, state: "active",   date: new Date(2016,4,3).getTime(),  sessionName: "Session 11" },
  { id: 12, state: "inactive", date: new Date(2016,4,3).getTime(),  sessionName: "Session 12" }
*/]

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
      /*items: items,
      fields: [
        { key: 'sessionName', label: 'Nom', sortable: true, 'class': 'text-center' },
        { key: 'date', label: 'Date', sortable: true, 'class': 'text-center' },
        { key: 'state', label: 'Statut', sortable: true, 'class': 'text-center' },
        { key: 'actions', label: 'Actions', 'class': 'text-center' }
      ],*/
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      pageOptions: [ 5, 10, 15 ],
      sortBy: 'date',
      sortDesc: true,
      sortDirection: 'desc',
      filter: null,
      removeItem: null,
      archiveItem: null
    }
  },
  components: {
      ToggleButton
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
    getRounds() {
      axios.get(this.$http + 'rounds',
                { headers: { 'Access-Control-Allow-Origin': '*'} })
      .then(rounds => {this.items = rounds.data})
    },
    isActive(state) {
      return state === "active";
    },
    isArchived(state) {
      return state === "stocked";
    },
    async toggle(item) {
      if(item.state != "stocked")
        if(item.state == "active")
          item.state = "inactive";
        else
          item.state = "active";
      //console.log(item.state);
      //console.log(item.id);
      item.editable = false
      await axios.post(this.$http + 'changeRoundState', {roundID: item.id, state: item.state});
    },
    dateFormating(items) {
      for (let i = 0; i < items.length; i++) {
        items[i].startDate = items[i].startDate.getTime();
      }
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
  async mounted() {
    this.$root.$on('bv::modal::hide', async (bvEvent) => {
    if (bvEvent.target.id == "remove" && bvEvent.trigger == "ok"){
      await axios.post(this.$http + 'deleteRound', {roundID: this.removeItem.id});
      //console.log(this.removeItem.id);
      var pos = this.items.map(e=> e.id).indexOf(this.removeItem.id)
      //console.log(bvEvent.target);
      this.items.splice(pos, 1)
    }
    if (bvEvent.target.id == "archive" && bvEvent.trigger == "ok") {
      this.archiveItem.state = "stocked";
      axios.post(this.$http + 'archiveRound', {roundID: this.archiveItem.id})
      .then(file => {console.log(file);
                    let data = JSON.stringify(file.data);
                    //download(file, this.archiveItem.Session.title+".json", "text/json")
                    var fileDownload = require('js-file-download');
                    fileDownload(data, this.archiveItem.Session.title+".json");
                  });
    }
    })
  },
  created() {
    //console.log("hello");
    this.getRounds();
    this.dateFormating(this.items);
    this.totalRows = this.items.length;
  }
}
</script>
<style scoped>
.round {
  width: 95px;
  height: 30px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
</style>
