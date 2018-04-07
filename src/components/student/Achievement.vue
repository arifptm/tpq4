<template>
	<div>
				<v-list dense two-line>   
        	<template v-for="(achievement, index) in achievements">
        	  <v-divider v-if='index == 0'></v-divider>

	          <v-list-tile  :key="achievement.id" @click="">
	            
	            <v-list-tile-content>
	              <v-list-tile-title v-html="achievement.achievement_date"></v-list-tile-title>
	              <!-- <v-list-tile-sub-title v-html="student.nickname"></v-list-tile-sub-title> -->
	            </v-list-tile-content>
	            
	            <v-list-tile-action>
	              <v-btn icon ripple :to="'/achievement/'+achievement.id">
	                <v-icon color="grey lighten-1">remove_red_eye</v-icon>
	              </v-btn>
	            </v-list-tile-action>
	           	
<!-- 	           	<v-list-tile-action>
								<v-menu left>
			            <v-btn icon slot="activator" >
			              <v-icon>more_vert</v-icon>
			            </v-btn>
			            <v-list>
			              <v-list-tile @click="editStudent(student)">
			                <v-list-tile-title>Edit</v-list-tile-title>
			              </v-list-tile>
			              <v-list-tile>
			                <v-list-tile-title @click="deactivateStudent(student)">Non Aktifkan</v-list-tile-title>
			              </v-list-tile>
			              <v-list-tile>
			                <v-list-tile-title @click="deleteStudent(student)">Hapus</v-list-tile-title>
			              </v-list-tile>
				          </v-list>
      			    </v-menu>
	            </v-list-tile-action> -->
	          </v-list-tile> 
	          <v-divider></v-divider>
					          	       
          </template>
        </v-list>


		<v-dialog v-model="dialog" fullscreen>
    	<form ref="form">
    		<v-card tile>    	
          <v-toolbar fixed dark color="green">
            <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="saveAchievement">Simpan</v-btn>
            </v-toolbar-items>
            <v-btn icon @click="closeDialog()" dark>
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>

    			<v-card-text style="padding-top:72px;">				 	

				    <v-radio-group v-model='student.class_group_id' row required       
				    	:error-messages="classGroupErrors" @input="$v.student.class_group_id.$touch()" @blur="$v.student.class_group_id.$touch()">
				      <v-radio label="TPQ" :value='1' ></v-radio>
				      <v-radio label="TPQD" :value='2' ></v-radio>
				    </v-radio-group>
						<hr />
					
						<v-radio-group v-model="student.gender" row required
							:error-messages="genderErrors" @input="$v.student.gender.$touch()" @blur="$v.student.gender.$touch()">

				      <v-radio label="Pria" value="male" ></v-radio>
				      <v-radio label="Wanita" value="female"></v-radio>
				    </v-radio-group>						

				    <v-text-field label="Nomor induk" v-model="student.registration_number"></v-text-field>	

				    <v-menu ref="menu1" lazy :close-on-content-click="false" v-model="menu1" offset-y full-width min-width="200px" >
					    <v-text-field slot="activator" label="Tanggal terdaftar" v-model="inverseRegisteredDate" prepend-icon="event" readonly></v-text-field>
					    <v-date-picker ref="picker" locale="id" v-model="student.registered_date" @change="saveRegisteredDate" min="1950-01-01"
					      :max="new Date() | moment('YYYY-MM-DD')"></v-date-picker>
					  </v-menu>
					</v-card-text>
				</v-card>
			</form>
		</v-dialog>

				    



	</div>
</template>

<script>
	export default{
		data() {
			return {
				student:{},
				achievement:{}
			}
		},

		created(){
			this.getAchievement()
		},

		methods:{
			getAchievement(){
				this.axios.get('achievements/'+student.id+'student')
				.then(response=>console.log(response.data))
			},

			saveAchievement(){
				this.axios.post('achievements', this.achievement)
				.then(response=>console.log(response.data))
			}
		}
	}
</script>