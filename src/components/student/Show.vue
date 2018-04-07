<template>
	<div>

		<v-card>
      <v-container
        fluid
        style="min-height: 0;"
        grid-list-lg
      >
        <v-layout row wrap>          
          <v-flex xs12>
            <v-card color="green" class="white--text">
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs8>
                    <div>
                      <div class="headline">{{ student.nickname }}</div>
                      <div>{{ student.fullname }}</div>
                      <div>{{ genderTitle }} <span v-if="genderTitle && student.birth_date" >-</span> {{ student.birth_date | moment("from", true) }}</div>                      
                    </div>

                  </v-flex>
                  <v-flex>                  	
                    <v-card-media :src="$root.baseUrl+'/imgcc/large-sq/'+student.image" height="5rem" contain >
                    </v-card-media>
                  
                  </v-flex>
                </v-layout>
              </v-container>
              <v-card-actions class="green darken-2">              	
              	<v-btn small class="blue lighten-4" :to="'/students/'+student.id+'/achievement'"> Prestasi &nbsp; <v-icon>school</v-icon></v-btn>
              	<v-spacer></v-spacer>
              	<v-btn small class="green lighten-4"><v-icon>attach_money</v-icon> Keuangan</v-btn>
              </v-card-actions>

            </v-card>
          </v-flex>					
					<v-flex xs12>
					
					<v-card flat color="red lighten-3" v-if="student.stop_date">
						<v-card-text class="text-xs-center">
								<b>Non Aktif</b> mulai <b>{{ student.stop_date | moment('DD-MM-YYYY')}}</b>
						</v-card-text>
					</v-card>

					<v-card flat color="green lighten-4">
						<v-card-text class="text-xs-center">
								<b>Alamat:</b> {{ student.address || '- - -'}}
						</v-card-text>
					</v-card>
						<v-list dense>

							<v-list-tile>
		            <v-list-tile-content>
		              Nomor induk
		            </v-list-tile-content>
		            <div class="subheading">
		              {{ student.registration_number || '--' }}
		            </div>
		          </v-list-tile>
		          <v-divider></v-divider>

		          <v-list-tile>
		            <v-list-tile-content>
		              Terdaftar
		            </v-list-tile-content>
		            <div class="subheading">
		              {{ student.registered_date | moment('DD-MM-YYYY') || '--' }}
		            </div>
		          </v-list-tile>
		          <v-divider></v-divider>

							<v-list-tile>
		            <v-list-tile-content>
		              Tp/tgl lahir
		            </v-list-tile-content>
		            <div class="subheading">
		              {{ student.birth_place }}<span v-if="student.birth_place">,</span> {{ student.birth_date | moment('DD-MM-YYYY') || '--'}}
		            </div>
		          </v-list-tile>
		          <v-divider></v-divider>		          

		          <v-list-tile v-if="student.class_group_id == 1">
		            <v-list-tile-content>
		              Orang tua
		            </v-list-tile-content>
		            <v-list-tile-action class="subheading">
		              {{ student.father | '--' }} 
		            </v-list-tile-action>
		          </v-list-tile>
		          <v-divider v-if="student.class_group_id == 1"></v-divider>
							
		          <v-list-tile v-if="student.class_group_id == 1">
		            <v-list-tile-content>
		              Nama bunda
		            </v-list-tile-content>
		            <v-list-tile-action class="subheading">
		              {{ student.mother || '--' }}
		            </v-list-tile-action>
		          </v-list-tile>
		          <v-divider v-if="student.class_group_id == 1"></v-divider>

		          <v-list-tile>
		            <v-list-tile-content>
		              <div v-if="student.class_group_id == 1">Pekerjaan ortu</div>
		              <div v-else >Pekerjaan</div>
		            </v-list-tile-content>
		            <v-list-tile-action class="subheading">
		              {{ student.job || '--' }}
		            </v-list-tile-action>
		          </v-list-tile>
		          <v-divider></v-divider>

		          <v-list-tile>
		            <v-list-tile-content>
		              <div v-if="student.class_group_id == 1">No. HP ortu</div>
		              <div v-else >No. handphone</div>
		            </v-list-tile-content>
		            <v-list-tile-action class="subheading">
		              {{ student.phone || '--' }}
		            </v-list-tile-action>
		          </v-list-tile>
		          <v-divider></v-divider>

		          <v-list-tile class="yellow lighten-4">
		            <v-list-tile-content>
		              SPP
		            </v-list-tile-content>
		            <v-list-tile-action class="subheading">
		              {{ student.tuition || '0' }} / bulan
		            </v-list-tile-action>
		          </v-list-tile>
		          <v-divider></v-divider>

		          <v-list-tile class="yellow lighten-4">
		            <v-list-tile-content>
		              Sapras
		            </v-list-tile-content>
		            <v-list-tile-action class="subheading">
		              {{ student.infrastructure_fee || '--' }}
		            </v-list-tile-action>
		          </v-list-tile>
		          <v-divider ></v-divider>

		          <v-list-tile class="yellow lighten-4">
		            <v-list-tile-content>
		              Seragam
		            </v-list-tile-content>
		            <v-list-tile-action class="subheading">
		              {{ student.uniform_fee || '--' }}
		            </v-list-tile-action>
		          </v-list-tile>
		          <v-divider class="mb-5"></v-divider>		          

		        </v-list>
          </v-flex>          
        </v-layout>
      </v-container>
    </v-card>		
		
		
	</div>
</template>

<script>
	
	import Vue from 'vue'
	Vue.use(require('vue-moment'));
	require('moment/locale/id')

	export default{

		data() {
			return {
				student: {},
			}
		},

		created(){
			this.getStudent()
		},

		computed:{
			genderTitle(){
				if(this.student.gender == 'male'){
					return "Laki-laki"
				} 
				if(this.student.gender == 'female'){
					return "Perempuan"
				} 
			},

			classGroup(){
				if(this.student.class_group_id == '1'){
					return "TPQ"
				} 
				if(this.student.class_group_id == '2'){
					return "TPQD"
				} 
			},


		},

		methods: {
			getStudent(){
				this.axios.get('students/'+ this.$route.params.id)
				.then(response=>{
					this.student = response.data
				})
			}
		}
	}
</script>