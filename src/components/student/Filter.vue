<template>
  <v-dialog v-model="filterDialog" fullscreen scrollable transition="dialog-bottom-transition">
    	<v-card>
    		<v-toolbar fixed dark color="green">
					<v-toolbar-title>Pilihan</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="$emit('getFilteredStudents')">Tampilkan</v-btn>
          </v-toolbar-items>
          <v-btn icon @click="$emit('closeFilterDialog')" dark>
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
    		
    		<v-card-text class="mt-5">

    			<v-subheader>Kelompok</v-subheader>
    			<v-layout row>
    				<v-flex xs6>    		
    					<v-checkbox label="TPQ" value="1" v-model="filterBy.classGroupTpq"></v-checkbox>
    				</v-flex>
    				<v-flex xs6>    		
    					<v-checkbox label="TPQ Dewasa" value="1" v-model="filterBy.classGroupTpqd"></v-checkbox>
    				</v-flex>
    			</v-layout>
    			<v-divider></v-divider>

    			<v-subheader>Jenis kelamin</v-subheader>
    			<v-layout row>
    				<v-flex xs6>    		
    					<v-checkbox label="Laki-laki" value="1" v-model="filterBy.genderMale"></v-checkbox>
    				</v-flex>
    				<v-flex xs6>    		
    					<v-checkbox label="Perempuan" value="1" v-model="filterBy.genderFemale"></v-checkbox>
    				</v-flex>
    			</v-layout>
    			<v-divider></v-divider>

    			<v-subheader>Akti/Nonaktif</v-subheader>
    			<v-layout row>
    				<v-flex xs6>    		
    					<v-checkbox label="Aktif" value="1" v-model="filterBy.active"></v-checkbox>
    				</v-flex>
    				<v-flex xs6>    		
    					<v-checkbox label="Non Aktif" value="1" v-model="filterBy.nonActive"></v-checkbox>
    				</v-flex>
    			</v-layout>
    			<v-divider></v-divider>

    			<v-subheader>Urut berdasarkan</v-subheader>
    			<v-layout>    				
    				<v-radio-group v-model="orderBy" row class="pt-0">
    					<v-flex xs6>
    						<v-radio label="Terbaru dulu" value="newest"></v-radio>
    						<v-radio label="Terlama dulu" value="oldest"></v-radio>
    					</v-flex>   
    					<v-flex xs6> 					
    						<v-radio label="Urut A-Z" value="az"></v-radio>    					    					
    						<v-radio label="Urut Z-A" value="za"></v-radio>    					
    				</v-flex>
    				</v-radio-group>    				
    				
    			</v-layout>
    			<v-divider></v-divider>    			
    		
    		</v-card-text>
    	</v-card>
    </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        filterDialog: false,        
        filterBy:{
          classGroupTpq:'1',
          classGroupTpqd:'1',
          genderMale:'1',
          genderFemale: '1',
          active:'1',
          nonActive:''
        },
        
        orderBy:'newest',
      }
    },
  }
</script>