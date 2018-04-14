<template>
			<v-dialog v-model="dialog" fullscreen>
    		<v-card flat>    	
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
		 				
		 				<v-text-field label="Nama santri" v-model="student.fullname+'/'+student.nickname" readonly></v-text-field>
			 
			 			<v-menu ref="menu1" lazy :close-on-content-click="false" v-model="menu1" offset-y full-width min-width="200px" >
						    <v-text-field slot="activator" label="Tanggal ujian" v-model="inverseAchievementDate" prepend-icon="event" readonly></v-text-field>
						    <v-date-picker ref="picker" locale="id" v-model="achievement.achievement_date" @change="saveAchievementDate" 
						    	:min="achievementMinDate"
						      :max="new Date() | moment('YYYY-MM-DD')" >						  
						    </v-date-picker>
						</v-menu>

		 				<v-select :readonly="readonly"
		          :items="stages" label="Kelas/jilid"
		          v-model="achievement.stage_id"	          
		          autocomplete item-text="name" item-value="id"
		        ></v-select></v-select>							

				    <v-text-field label="Catatan" v-model="achievement.notes"></v-text-field>	

					</v-card-text>
				</v-card>
		</v-dialog>
</template>

<script>
	export default {

		props: ['editedIndex', 'student'],

		data() {
			return {
				
				dialog: false,
				date: null,
			  menu1: false,
			  achievementMinDate: null,
			  achievementMaxDate: null,
			  readonly:false,
			  stages:[],
				students:[],
				achievement:{},				
				defAchievement:{
					achievement_date: null,
					student_id:'',
					stage_id:'',
					notes:'',
				}

			}
		},

		created(){		
		},

		computed:{
			dialogTitle () {
        return this.editedIndex === -1 ? 'Kelulusan baru' : 'Edit kelulusan'
      },

      inverseAchievementDate(){      	
    			return this.inverseDate(this.achievement.achievement_date)
    	},

    },

    methods:{

    	getStudents(){
				this.axios.get('students/select')
				.then(response=>{
					// console.log(response.data)
					this.students = response.data					
				})
			},

			getAchievementMinDate(index){    		
    		let la = this.student.achievements
    		let lal = la.length

  			if(index == -1){							
					this.achievementMinDate = (lal > 0) ? la[lal-1].achievement_date: this.student.registered_date
				} else {
					this.achievementMinDate = (lal > 0) ? this.student.achievements[index].achievement_date : this.student.registered_date
				}
			},

			getRestStages(student_id){

				this.axios.get('achievements/student/'+ student_id +'/stage-update-option')
					.then(response=>{
						// console.log(response.data)
						this.stages = response.data
						// this.stages.push(this.achievement)
					})      	
			},

      getStagesFromLast(student_id){				
					this.axios.get('achievements/student/'+ student_id +'/stage-new-option')
					.then(response=>{						
						// console.log(response.data)
						this.stages = response.data
						if (this.student.achievements.length > 0){
							this.achievement.stage_id = this.student.current_stage.id
							this.readonly = true;
						}						
						
					})      	
      },

    	inverseDate(dt){
    		return dt ? dt.split("-").reverse().join("-") : null
    	},
    	saveAchievementDate (date) {
	     	this.$refs.menu1.save(date)
			},	

    	saveAchievement(){
    		if(this.editedIndex > -1){
    			this.axios.put('achievements/'+this.achievement.id, this.achievement)
    			.then(response=>{
    				this.$emit('getStudentAchievements')		
    				// console.log(response.data)
    			})
    		} else {

					this.axios.post('achievements', this.achievement)
					.then(response=>{
						this.$emit('getStudentAchievements')		
					})
				}

				// this.getStages(this.student.id)
				
				this.dialog = false
				this.resetAchievement()
			},

			closeDialog(){
				if(this.editedIndex > -1){
					this.resetAchievement()
					this.$emit('resetEditedIndex')
				}
				this.dialog = false
			},

			resetAchievement(){
				this.stages = []
    		this.achievement = this.defAchievement
    	},    	
    }

	}
</script>