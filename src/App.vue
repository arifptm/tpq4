<template>
  <v-app>

    

    

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

import Toolbar from '@/components/layout/Toolbar'

export default {
  
  components: { Toolbar },

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
