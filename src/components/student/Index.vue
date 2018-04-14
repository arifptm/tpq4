<template>
  <v-layout row>

  	<Drawer ref="drawer"></Drawer>
  	<Toolbar @setDrawer="setDrawer"></Toolbar>
    <v-flex xs12>
      <v-card>
      	<v-card-title primary-title class="title pb-1 pt-2">
      			<v-text-field  :label="'Cari santri ('+filteredStudents.total+')'" v-model="keyword" persistent-hint hint="Tulis minimal 3 huruf"></v-text-field>     
      					
      		  <v-btn fab small color="green" class="white--text" @click="openFilterDialog"> 
	          	<v-icon>filter_list</v-icon>
          	</v-btn>      		
          	<v-btn fab color="green darken-1" class="white--text" @click="newStudent"> 
	          	<v-icon>add</v-icon>
          	</v-btn>      		
      	</v-card-title>      

        <v-list dense two-line>   
        	<template v-for="(student, index) in filteredStudents.data">
        	  <v-divider v-if='index == 0'></v-divider>

	          <v-list-tile  :key="student.id" @click="">
	            <v-list-tile-avatar @click="$router.push('/students/'+student.id)">
	              <img v-if="student.image" :src="$root.baseUrl+'/imgcc/small-sq/'+student.image" :alt="student.nickname">
	              <img v-else :src="$root.baseUrl+'/imgcc/small-sq/'+student.gender+'-avatar.jpg'" :alt="student.gender">	              
	            </v-list-tile-avatar>
	            <v-list-tile-content @click="$router.push('/students/'+student.id)">
	              <v-list-tile-title >{{student.fullname}}</v-list-tile-title>
	              <v-list-tile-sub-title ><v-icon small dark color="orange">{{studentClassGroup(student.class_group_id)}}</v-icon> {{ student.nickname }} </v-list-tile-sub-title>
	            </v-list-tile-content>
	            
	            <v-list-tile-action>
	              <v-btn icon ripple :to="'/students/'+student.id">
	                <v-icon color="green darken-1">attach_money</v-icon>
	              </v-btn>
	            </v-list-tile-action>

	            <v-list-tile-action>
	              <v-btn icon ripple :to="'/students/'+student.id+'/achievement'">
	                <v-icon color="blue darken-1">school</v-icon>
	              </v-btn>
	            </v-list-tile-action>
	           	
	           	<v-list-tile-action>
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
	            </v-list-tile-action>
	          </v-list-tile> 
	          <v-divider></v-divider>
					          	       
          </template>
        </v-list>
        <v-card-text>
        	<div class="text-xs-center">
				    <v-pagination @input="next" color="green" :length="filteredStudents.last_page" v-model="filteredStudents.current_page" :total-visible="5"></v-pagination>
				  </div>
      	</v-card-text>
      </v-card>
    </v-flex>
	
    

    
  <StudentCreate ref="create" 
  	:editedIndex="editedIndex"
  	@closeDialog="closeDialog()"
  	@getStudents="getStudents()"  	
  	@commitEdited="commitEdited">
  </StudentCreate>    	
    
  <StudentFilter ref="filter"   	
  	@closeFilterDialog="closeFilterDialog()"
  	@getFilteredStudents="getFilteredStudents()">
  </StudentFilter>   
   


  </v-layout>
</template>

<script>

	import Toolbar from '@/components/layout/Toolbar'
	import Drawer from '@/components/layout/Drawer'
	import StudentCreate from '@/components/student/Create'
	import StudentFilter from '@/components/student/Filter'

  import Vue from 'vue'
  import VueCroppie from 'vue-croppie'
  import VueSweetalert2 from 'vue-sweetalert2';
  
  Vue.use(VueCroppie)
  Vue.use(require('vue-moment'));
	Vue.use(VueSweetalert2);


  export default {

  	components: {Toolbar, Drawer, StudentCreate, StudentFilter},



    data () {
      return {
      	keyword:'',
        label: { phone:'', job:''},
        editedIndex: -1,			 			

        students: [],
        filteredStudents: [],
               
      }
    },

    watch: {			
		
			keyword(){
				if (this.keyword.length > 2){
					this.axios.post('search/student', { keyword: this.keyword})
        			.then((response)=>{
        				this.filteredStudents = response.data
        			})
				} else {
					this.filteredStudents = this.students
				}
			}		

	  },

    created(){
    	this.$root.pageTitle = "Santri"
    	this.getStudents()
    },

    computed:{  
    },

    methods:{
    	studentClassGroup(student){
  			return (student == 1) ? 'child_care' : 'person';
    	},

    	setDrawer(){
    		this.$refs.drawer.drawer = !this.$refs.drawer.drawer
    	},
    	
  		getStudents(){
  			this.axios.get('students')
      	.then((response)=>{this.students = this.filteredStudents = response.data})
				.catch((error)=>this.errors = error.response.data.errors)       			
  		},    

  		getFilteredStudents(){
  			this.axios.post('students/filtered', { filterBy: this.$refs.filter.filterBy, orderBy: this.$refs.filter.orderBy })
      	.then((response)=>{
      		// console.log(response.data)
      		this.filteredStudents = response.data
      		this.$refs.filter.filterDialog = false
      	})
				
  		},

  		newStudent(){  			
  			this.$refs.create.$v.student.$reset()
  			this.cropieImage = ''			
  			this.$refs.create.dialog = true
  		},

    	editStudent(student){
    		this.editedIndex = this.filteredStudents.data.indexOf(student)
    		this.$refs.create.student = Object.assign({}, student)
    		this.$refs.create.dialog = true
    		this.$refs.create.cropieImage = ''	
    		// this.student.image=''
    	},  		

    	commitEdited(response){
    		Object.assign(this.filteredStudents.data[response.idx], response.data)    		
    		// console.log(response)
    	},

    	deleteStudent(student){
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
              this.axios.delete('students/'+student.id)
              .then(response=>{
                this.getStudents()
              })
            this.$swal({title:'Selesai', text:'Data berhasil dihapus..!', type:'success', showConfirmButton: false, timer: 1800})            
          }
        })
      },

      deactivateStudent(student){
        this.$swal({
          title: 'Yakin?',
          text: 'Status santri akan di set non-aktif!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Lanjutkan!',
          cancelButtonText: 'Batalkan',
          showCloseButton: true,
        }).then((result) => {
          if(result.value) {
              this.axios.post('students/deactivate', student)
              .then(response=>{
                this.getStudents()
                // console.log(response.data)
              })
            this.$swal({title:'Selesai', text:'Status santri berhasil di-set non-aktif..!', type:'success', showConfirmButton: false, timer: 1800})

          }
        })
      },

    	closeDialog(){
    		this.$refs.create.dialog = false
    		this.editedIndex = -1
    	},
    	openFilterDialog(){    		
    		this.$refs.filter.filterDialog = true
    	},
    	closeFilterDialog(){
    		this.$refs.filter.filterDialog = false
    	},

      next(page){
      	this.axios.get('students?page='+page)
      	.then((response)=>{this.students = this.filteredStudents = response.data})
      },

    }

  }
</script>

