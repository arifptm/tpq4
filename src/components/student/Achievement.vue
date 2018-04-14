<template>
	<div>
		<Drawer ref="drawer"></Drawer>
  	<Toolbar @setDrawer="setDrawer"></Toolbar>
    
    <v-list class="green">
    	<v-list-tile>
    		<v-list-tile-avatar @click="$router.push('/students/'+studentAchievements.id)">
    			<img :src="$root.baseUrl+'/imgcc/tiny-sq/'+studentAchievementsImage" v-if="studentAchievements.image">
    		</v-list-tile-avatar>
    		<v-list-tile-content>
    			<v-btn block small class="green lighten-4" @click="newAchievement">Tambah kelulusan</v-btn>
    		</v-list-tile-content>
    		<v-list-tile-action>
    			<v-btn fab small>
                <v-icon>attach_money</v-icon>
              </v-btn>
    		</v-list-tile-action>
    	</v-list-tile>    	
    </v-list>
    <v-card>
    	<v-card-text class="text-xs-center" v-if="studentAchievements.current_stage">
    		<div><span class="subheading">Posisi saat ini:</span> <span class="title">{{ studentAchievements.current_stage.name }}</span></div>
    	</v-card-text>
    </v-card>
				

				<v-list dense three-line v-if="studentAchievements.achievements != 0">         	
        	<template v-for="(achievement, index) in studentAchievements.achievements">
        	  <v-divider v-if='index == 0'></v-divider>

	          <v-list-tile :key="achievement.id" @click="">	           

	            <v-list-tile-content>
	            	<v-list-tile-sub-title>{{ achievement.achievement_date | moment('DD-MM-YYYY')}}</v-list-tile-sub-title>
	            	<v-list-tile-title class="green--text text--darken-3 body-2">Lulus {{ achievement.name }}</v-list-tile-title>	             	
	              <v-list-tile-sub-title v-html="achievement.duration"></v-list-tile-sub-title>
	            </v-list-tile-content>

	            <v-list-tile-action>	            		           
	            	<v-btn icon ripple @click="editAchievement(achievement, index)">
	                <v-icon color="blue">edit</v-icon>
	              </v-btn>
	            </v-list-tile-action>

	            <v-list-tile-action>
	              <v-btn icon ripple @click="deleteAchievement(achievement)" :disabled="index != studentAchievements.achievements.length-1">
	                <v-icon color="red">delete </v-icon>	              
	              </v-btn>
	            </v-list-tile-action>	           	
	          </v-list-tile> 
	          <v-divider></v-divider>
					          	       
          </template>
        </v-list>

        <v-card v-else>        	
        	<v-card-text class="text-xs-center">
        		<p class="title">Siswa baru sejak {{ $moment(newStudentDuration).format('DD-MM-YYYY') }}</p>
        		<p>(Mendaftar sekitar {{ $moment(newStudentDuration).fromNow(true) }} yang lalu)</p>
        	</v-card-text>
        </v-card>

        <CreateAchievement 
        	ref="create"        	
        	:editedIndex="editedIndex"           	
        	:student = "studentAchievements"
        	@resetEditedIndex="resetEditedIndex"
        	@getStudentAchievements="getStudentAchievements">
        </CreateAchievement>


	</div>
</template>

<script>

	import Toolbar from '@/components/layout/Toolbar'
	import Drawer from '@/components/layout/Drawer'
	import CreateAchievement from '@/components/achievement/create'
	
	require('moment/locale/id')

	export default{

		components:{ Drawer,Toolbar, CreateAchievement },

		data() {
			return {				
				editedIndex:-1,
				studentAchievements:{},
			}
		},

		created(){
			this.getStudentAchievements()				
		},

		computed:{
    	newStudentDuration(){
    		return this.studentAchievements.registered_date ? this.studentAchievements.registered_date : this.studentAchievements.created_at
    	},
    	studentAchievementsImage(){
    		return this.studentAchievements.image ? this.studentAchievements.image : this.studentAchievements.gender+'-avatar.jpg'
    	},

		},

		methods:{
    	setDrawer(){
    		this.$refs.drawer.drawer = !this.$refs.drawer.drawer
    	},			

      newAchievement(){
      	this.$refs.create.achievement.student_id = this.studentAchievements.id
      	this.$refs.create.getStagesFromLast(this.studentAchievements.id)
      	this.$refs.create.getAchievementMinDate(-1)
      	this.$refs.create.dialog = true
      },

      editAchievement(achievement, index){      	
      	this.editedIndex = index
      	// this.$refs.create.getRestStages(this.studentAchievements.id)
      	this.$refs.create.achievement = achievement
      	this.$refs.create.getAchievementMinDate(index)
      	this.$refs.create.dialog = true
      },

			getStudentAchievements(){
				this.axios.get('students/'+this.$route.params.id+'/achievements')
				.then(response=>{
					// console.log(response.data)
					this.studentAchievements = response.data		
					this.$root.pageTitle = this.studentAchievements.nickname			
				})
			},

			deleteAchievement(achievement){
				 this.$swal({
          title: 'Yakin?',
          text: 'Data yang dihapus tidak dapat dikembalikan..!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batalkan',
          showCloseButton: true,
        }).then((result) => {
          if(result.value) {
              this.axios.delete('achievements/'+achievement.id)
              .then(response=>{
                // console.log(response.data)
                this.getStudentAchievements()
                this.$refs.create.getRestStages(this.studentAchievements.id)
              })
            this.$swal({title:'Selesai', text:'Data berhasil dihapus..!', type:'success', showConfirmButton: false, timer: 1800})            
          }
        })
			},

			resetEditedIndex(){
				this.editedIndex = -1
			}

		}
	}
</script>
