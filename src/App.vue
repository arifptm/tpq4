<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" enable-resize-watcher fixed app class="green darken-4">
      <v-toolbar color="green darken-4">
        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-avatar>
                <img src="http://i.pravatar.cc/300" alt="" />
              </v-avatar>
            </v-list-tile-action>
            <v-list-tile-content class="green--text text--lighten-4 subheading">
              <router-link to="/">Adminsitrator</router-link>
            </v-list-tile-content>
          </v-list-tile>          
        </v-list>
      </v-toolbar>

      <v-list>
        <v-list-tile v-for="(item, i) in items" :key="i" :to="item.path" color="white" active-class="green darken-3 yellow--text" >
          <v-list-tile-action >
            <v-icon v-html="item.icon" dark></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    

    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>      
      <v-toolbar-title>{{ this.$root.pageTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon>search</v-icon>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>    
    

    <v-bottom-nav
      fixed shift :value="true" color="grey darken-3"
      :active.sync="bottomNav"      
      class="hidden-md-and-up" >
      <v-btn dark v-for="(item, i) in items" :key="i" :value="item.title" :to="item.path">
        <span>{{ item.title }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-nav>


    <v-footer fixed height="auto" class="grey darken-3">
      <v-layout row wrap justify-center>
        <v-flex xs12 py-3 text-xs-center white--text>
          &copy;2018 — <strong>Vuetify</strong>
        </v-flex>
      </v-layout>
    </v-footer>
    

  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {      
      drawer: null,
      bottomNav: 'santri',
      items: [      
        { icon: 'person', title: 'Ustadz/ah', path: '1'},
        { icon: 'people', title: 'Santri', path: '/students'}, 
        { icon: 'school', title: 'Pendidikan', path: '3'},
        { icon: 'attach_money', title: 'Keuangan', path: '4'},        
      ],   
    }
  },
}
</script>
