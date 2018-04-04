<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
      	<v-card-title primary-title class="title">
      		<div>Santri ({{ filteredStudents.total }})</div>
      			<v-spacer></v-spacer>
      			<v-text-field label="Cari santri" v-model="keyword" persistent-hint hint="Tulis minimal 3 huruf"></v-text-field>
      			<v-spacer></v-spacer>
      		  <v-btn fab small right absolute color="green darken-1" class="white--text" @click.stop="dialog = true"> 
	          <v-icon>add</v-icon>
          </v-btn>      		
      	</v-card-title>

        <v-list dense two-line>   
        	<template v-for="(student, index) in filteredStudents.data">
        	  <v-divider v-if='index == 0'></v-divider>

	          <v-list-tile  :key="student.id" @click="">
	            <v-list-tile-avatar>
	              <img v-if="student.image" :src="$root.baseUrl+'/imgcc/small/'+student.image" :alt="student.nickname">
	              <img v-else :src="$root.baseUrl+'/imgcc/small/'+student.gender+'-avatar.jpg'" :alt="student.gender">
	            </v-list-tile-avatar>
	            <v-list-tile-content>
	              <v-list-tile-title v-html="student.fullname"></v-list-tile-title>
	              <v-list-tile-sub-title v-html="student.nickname"></v-list-tile-sub-title>
	            </v-list-tile-content>
	          </v-list-tile> 
	          <v-divider></v-divider>
					          	       
          </template>
        </v-list>
        <v-card-text>
        	<div class="text-xs-center">
				    <v-pagination @input="next" color="green" :length="filteredStudents.last_page" v-model="filteredStudents.current_page" :total-visible="7"></v-pagination>
				  </div>
      	</v-card-text>
      </v-card>      
    </v-flex>


    <v-dialog v-model="dialog" max-width="500px" origin="top center">
    	<v-card>
    		<v-card-text>
				 	<v-form v-model="valid">
	          <div class="text-xs-center">
	            <label v-show="showCroppie === false" for="customFile">
		            <v-chip v-show="student.image == '' "><v-icon>image</v-icon> Tambah Foto</v-chip>
		            <v-avatar size="128" v-show="student.image != ''">
		            	<img  :src="student.image" :alt="student.nickname" >
		            </v-avatar>
	            </label>
	            <input type="file" @change="getImage" style="display:none" id="customFile">
	          </div>
            
            <div v-show="showCroppie === true" >
              <vue-croppie 
                :boundary= boundary
                :viewport= viewport
                ref=croppieRef 
                :enableOrientation="true"
                @update="update"
                >
            	</vue-croppie> 
            	
            	<div class="text-xs-center">
	              <v-btn icon color="green lighten-3" @click="rotate(-90)">
	                <v-icon>rotate_left</v-icon>
	              </v-btn>
	              <v-btn icon color="green lighten-3" @click="rotate(90)">
	                <v-icon>rotate_right</v-icon>
	              </v-btn>
	              <v-btn round color="green lighten-3" @click.prevent="crop()">
	                <v-icon>save</v-icon> Simpan
	              </v-btn>
	            </div>	 
	          </div>           
				    <v-radio-group v-model="student.class_group_id" row>
				      <v-radio label="TPQ" value="1" ></v-radio>
				      <v-radio label="TPQD" value="2"></v-radio>
				    </v-radio-group>
						<hr />
						<v-radio-group v-model="student.gender" row>
				      <v-radio label="Pria" value="male" ></v-radio>
				      <v-radio label="Wanita" value="female"></v-radio>
				    </v-radio-group>						

				    <v-text-field label="Nomor induk" v-model="student.registration_number"></v-text-field>	

				    <v-menu ref="menu1" lazy :close-on-content-click="false" v-model="menu1" offset-y full-width min-width="200px" >
					    <v-text-field slot="activator" label="Tanggal terdaftar" v-model="inverseRegisteredDate" prepend-icon="event" readonly></v-text-field>
					    <v-date-picker ref="picker" locale="id" v-model="student.registered_date" @change="saveRegisteredDate" min="1950-01-01"
					      :max="new Date() | moment('YYYY-MM-DD')"></v-date-picker>
					  </v-menu>
				    
						<v-menu ref="menu2" lazy :close-on-content-click="false" v-model="menu2" offset-y full-width min-width="200px" >
					    <v-text-field slot="activator" label="Tanggal lahir" v-model="inverseBirthDate" prepend-icon="event" readonly></v-text-field>
					    <v-date-picker ref="picker" locale="id" v-model="student.birth_date" @change="saveBirthDate" min="1950-01-01"
					      :max="new Date() | moment('subtract', '3 year') | moment('YYYY-MM-DD')"></v-date-picker>
					  </v-menu>

						<v-text-field label="Tempat lahir" v-model="student.birth_place"></v-text-field>						

				    <v-text-field label="Nama lengkap" v-model="student.fullname"></v-text-field>	
				    <v-text-field label="Nama panggilan" v-model="student.nickname"></v-text-field>	

				    <v-text-field v-if="student.class_group_id == 1" label="Nama ayah" v-model="student.father"></v-text-field>	
				    <v-text-field v-if="student.class_group_id == 1" label="Nama bunda" v-model="student.mother"></v-text-field>	
				    <v-text-field label="Alamat" v-model="student.address"></v-text-field>	
				    <v-text-field :label="jobLabel" v-model="student.job"></v-text-field>	
				    <v-text-field :label="phoneLabel" v-model="student.phone"></v-text-field>	
				    				    

				    <v-text-field label="SPP per bulan" v-model="student.tuition"></v-text-field>	
				    <v-text-field label="Kesanggupan biaya Sapras" v-model="student.infrastructure_fee"></v-text-field>	
				    <v-text-field label="Biaya seragam" v-model="student.uniform_fee"></v-text-field>	

				    <v-text-field label="Catatan" v-model="student.notes"></v-text-field>	

				  </v-form>
    		</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Batal</v-btn>
          <v-btn color="blue darken-1" flat @click.native="storeStudent">Simpan</v-btn>
        </v-card-actions>    		
    	</v-card>
    </v-dialog>

  </v-layout>
</template>

<script>

  import Vue from 'vue'
  import VueCroppie from 'vue-croppie'
  Vue.use(VueCroppie)
  Vue.use(require('vue-moment'));

  export default {


    data () {
      return {
      	valid: true,
      	keyword:'',

      	//croppie
      	showCroppie: false,
      	boundary: {
          width:250,
          height:250
        },
        viewport:{
          width:200,
          height:200,
          type:'circle'
        },

        label: { phone:'', job:''},

        student:{
          image:'',
          registered_date: '',
          registration_number: '',
          birth_date: '',
          birth_place: '',
          gender: '',
          class_group_id: '',
          fullname: '',
          nickname: '',
          father: '',
          mother: '',
          job: '',
          phone: '',
          address: '',
          tuition: '',
          infrastructure_fee: '',
          uniform_fee: '',
          notes:'',
          stop_date: null
        },                

        ///picker
        date: null,
			  menu1: false,
			  menu2: false,
			 			

        students: [],
        filteredStudents: [],

        dialog: false
      }
    },

    watch: {
	    menu1 (val) {
	      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
	    },
	    menu2 (val) {
	      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
	    },
		
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
    	// this.$root.pageTitle = ""
    	this.getStudents()
    },

    computed:{    	
    	phoneLabel(){
    		if (this.student.class_group_id == '1'){
    			return 'No. Telepon orang tua'
    		} else { return 'No. Telepon' }
    	},
    	jobLabel(){
    		if (this.student.class_group_id == '1'){
    			return 'Pekerjaan orang tua'
    		} else { return 'Pekerjaan' }
    	},
    	inverseRegisteredDate(){
    		return this.inverseDate(this.student.registered_date)
    	},
    	inverseBirthDate(){
    		return this.inverseDate(this.student.birth_date)
    	}
    },

    methods:{
    	
  		getStudents(){
  			this.axios.get('students')
      	.then((response)=>{this.students = this.filteredStudents = response.data})
				.catch((error)=>this.errors = error.response.data.errors)       			
  		},    		

    	storeStudent(){
    		this.axios.post('students', this.student)
    		.then(response=>{
    			console.log(response.data)
    			this.dialog = false
    			this.filteredStudents.data.push(response.data)
    		})
    	},
    	inverseDate(dt){
    		return dt.split("-").reverse().join("-")
    	},
    	getImage(e){
        this.showCroppie = true            
        let image = e.target.files[0]
        let reader = new FileReader()            
        reader.readAsDataURL(image)
        reader.onload = e => {
          this.$refs.croppieRef.bind({
            url: e.target.result
          })                
        } 
      },
      crop(){
        let options = {
          format: 'jpeg', 
          circle: false,
          setZoom: 2
        }          
        this.showCroppie = false
            this.$refs.croppieRef.result(options, (output) => {
                this.student.image = output
        })                  
      },

   	  saveRegisteredDate (date) {
	     	this.$refs.menu1.save(date)
			},

			saveBirthDate (date) {
	     	this.$refs.menu2.save(date)
			},

			update(val) {
        // console.log(val);
      },
      rotate(rotationAngle) {
        this.$refs.croppieRef.rotate(rotationAngle);
      },
      next(page){
      	this.axios.get('students?page='+page)
      	.then((response)=>{this.students = this.filteredStudents = response.data})
      }
    }

  }
</script>

