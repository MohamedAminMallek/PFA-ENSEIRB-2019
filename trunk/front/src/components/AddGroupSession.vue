<template>
  <b-form>
  <b-form-group id="groups"
                label="Gestion des groupes associés à la session"
                label-for=""
                description="">

  <b-card no-body>
    <b-tabs card>
      <b-tab v-for="group in form.groups" :key="`dyntab-${group.id}`" :title="`${(group.groupCreated === null)?group.name:group.groupCreated.name }`">
          <div class="mx-auto mt-3">
          <b-row>
            <b-col>

            <b-form-group id="group-display"
                      label="Liste des groupes existants :"
                      label-for=""
                      description="">
            <b-form-select :options="groupDataBase"
                        
                        v-model="group.groupCreated"/>
            </b-form-group>


            </b-col>
            <b-col >

              <b-form-group id="group-name"
                            label="Nom :"
                            label-for=""
                            description=""
                            v-if="group.groupCreated === null" show>
              <b-form-input id="tab-name"
                            type="text"
                            v-model="group.name"
                            required
                            :placeholder="`${group.name}`"
                            >
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="group-code"
                            label="Code secret :"
                            label-for=""
                            description="Le code nécessaire à l'identification du groupe">
              <b-form-input id="tab-secret"
                            type="number"
                            v-model="group.code"
                            :placeholder="`${group.code}`">
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group id="group-method"
                      label="Méthode de vote :"
                      label-for=""
                      description="Façon dont le groupe pourra voter">
        <b-form-select :options="voteMethods" required v-model="group.method"/>
        <div class="mt-3">
          <b-alert v-if="group.method!=null" show>{{group.method.description}}</b-alert>
        </div>
      </b-form-group>
        <b-form-group id="display-display"
                      label="Mode d'affichage :"
                      label-for=""
                      description="">
          <b-form-select :options="displayModes"
                        required
                        v-model="group.displayMode"/>
          <div class="mt-3">
            <b-alert v-if="group.displayMode!=null" show>{{group.displayMode.description}}</b-alert>
          </div>
        </b-form-group>

      <b-row>
        <b-col md="10"></b-col>
        <b-col md="2" class="my-1">
          <b-button size="sm" variant="danger" :disabled="false" @click="() => deleteLink(group)">
            Supprimer groupe
          </b-button>
        </b-col>
      </b-row>

      </div>
      </b-tab>
  <template slot="tabs">
    <b-nav-item @click.prevent="newTab" href="#"><b>+</b></b-nav-item>
  </template>
  </b-tabs>
  
  </b-card>
  <b-container class="mx-auto mt-3">
  <b-row>
    <b-col>
      <b-button v-on:click="$emit('submit', form.groups.slice(oldGroupsCounter))" variant="primary">Enregistrer</b-button>
    </b-col>
    <b-col>
      <b-button variant="danger" to="/">Retour</b-button>
    </b-col>
  </b-row>
  </b-container>
</b-form-group>
</b-form>
</template>


<script>
import axios from 'axios';
export default {
    name: "Groups",
    props: [],
    data () {
      return {
        availableGroupId: 0,
        tabCounter: 0,
        oldGroupsCounter: 0,
        form: {
          groups: [/*
            { id: 0, name: 'defaut' , method:null, code:4242, displayMode: null, groupCreated: null}
            */]
        },
        voteMethods: [
          {
            value: null,
            disabled: true,
            text: 'Veuillez sélectionner une option'
          }
        ],
        displayModes : [
          {
            value: null,
            disabled: true,
            text: 'Veuillez sélectionner une option'
          }
        ],
        groupDataBase : [
          {
            value: null,
            disabled: false,
            text: 'Nouveau groupe'
          }
        ]
      }
    },
    methods: {
      closeTab(x) {
        for (let i = 0; i < this.form.groups.length; i++) {
          if (this.form.groups[i] === x) {
            this.form.groups.splice(i, 1)
          }
        }
      },
      deleteGroup(g) {
        //axios delete group
        this.closeTab(g);
        this.oldGroupsCounter--;
      },
      newAvailableGroupId() {
        let groupsIds = this.form.groups.map(group => group.id);
        while(groupsIds.includes(this.availableGroupId)) {
          this.availableGroupId++;
        }
      },
      newTab() {
        this.newAvailableGroupId();
        this.form.groups.push({linkID : null,id: this.availableGroupId, name:'nouveau'+this.tabCounter++, method:null, code:1234, displayMode: null,groupCreated:null})
      },
      async getVoteMethods() {
        await axios.get(this.$http + 'getVoteMethodList')
        .then(methods => {
          let temp = []
          methods.data.forEach(function(m){
            temp.push({
              value: {
              id : m.id,
              namePrivate: m.name,
              description: m.description},
            text: m.title
            });
          });
          this.voteMethods = this.voteMethods.concat(temp);
        });
      },
      getVoteMethodById(id) {
        for (let i = 1; i < this.voteMethods.length; i++) {
          if (this.voteMethods[i].value.id == id)
            return this.voteMethods[i];
        }
        return null;
      },
      async deleteLink(group)
      {
        if(group.linkID != null)
        {
          await axios.post(this.$http+'removeLink',{linkID : group.linkID})
          .catch(err => alert('une erreur est survenue. Veuillez contacter le responsable technique'))
        }
        this.deleteGroup(group)
        //console.log(group.linkID)
      },
      async getDisplayModes() {
        await axios.get(this.$http + 'getDisplayModeList')
        .then(display => {
          let temp = []
          display.data.forEach(function(d){
            temp.push({
              value: {
              id : d.id,
              namePrivate: d.name,
              description: d.description},
            text: d.title
            });
          });
          this.displayModes = this.displayModes.concat(temp);
        });
      },
      getDisplayModeById(id) {
        for (let i = 1; i < this.displayModes.length; i++) {
          if (this.displayModes[i].value.id == id)
            return this.displayModes[i];
        }
        return null;
      },
      async getGroups() {
        await axios.get(this.$http + 'getGroupList')
        .then(groups => {
          let temp = [];
          groups.data.forEach(function(group){
            temp.push({
              value: {
              id : group.id,
              name : group.name
              },
            text: group.name,
            disabled: false
            });
          });
          this.groupDataBase = this.groupDataBase.concat(temp);
          this.getRoundGroups();
        });
      },
      getGroupById(id) {
        for (let i = 1; i < this.groupDataBase.length; i++) {
          if (this.groupDataBase[i].value.id == id)
            return this.groupDataBase[i];
        }
        return null;
      },
      async getRoundGroups() {
        await axios.post(this.$http + 'getLinks', { roundID : this.$route.query.sid })
        .then(groups => { 
          for (let i = 0; i < groups.data.links.length; i++) {
            this.form.groups.push({
              linkID : groups.data.links[i].id,
              id: groups.data.links[i].GroupID,
              method: this.getVoteMethodById(groups.data.links[i].VoteMethodID).value,
              code: groups.data.links[i].privateCode,
              displayMode: this.getDisplayModeById(groups.data.links[i].DisplayModeID).value,
              groupCreated: this.getGroupById(groups.data.links[i].GroupID).value
            })
          }
          this.tabCounter = this.form.groups.length;
          this.oldGroupsCounter = this.form.groups.length;
          //be sure a group can't be selected twice in a session
          let groupsCreated = this.form.groups.map(g => g.groupCreated);
          for(let i = 0; i < this.groupDataBase.length; i++) {
            if (groupsCreated.includes(this.groupDataBase[i].value)) {
              this.groupDataBase[i].disabled = true;
            }
          }
        });
      }
    },
    created() {

      this.getDisplayModes();
      this.getVoteMethods();
      this.getGroups();
    }
  };
</script>
