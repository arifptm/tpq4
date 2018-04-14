  <template>
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
  </template>

  <script>
  export default{
    data () {
      return {      
        drawer: null,
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