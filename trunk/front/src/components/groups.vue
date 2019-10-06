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
      <template slot="id" slot-scope="row">{{row.item.id}}</template>
      <template slot="name" slot-scope="row">{{row.item.name}}</template>
      <template slot="links" slot-scope="row">{{row.item.links}}</template>
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->

        <b-button size="sm" :disabled="row.item.links>0" class="mr-1" v-b-modal.remove v-on:click="removeGroup(row.item.id, row.item)">
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
      fields: [
        { key: 'id', label: 'Identifiant', sortable: true, 'class': 'text-center' },
        { key: 'name', label: 'Nom', sortable: true, 'class': 'text-center' },
        { key: 'links', label: 'Nombre de liens', sortable: true, 'class': 'text-center' },
        { key: 'actions', label: 'Actions', 'class': 'text-center' }
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 100,
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
    async removeGroup(groupID, item) {
      
      var results = await axios.post(this.$http + 'deleteGroup',
      {
        groupID : groupID
      })
      .then(res => {
            var pos = this.items.map(e=> e.id).indexOf(groupID)
            this.items.splice(pos, 1)
            alert("succès !");
      })
      .catch(err => 
      {
          alert("erreur !");
      })
      
       
    },
    async getGroups() {
      
      await axios.get(this.$http + 'getGroupList')
      .then(groups => {this.items = groups.data})
    },
    onFiltered(filteredItems) {
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
    this.getGroups();
  }
}
</script>
