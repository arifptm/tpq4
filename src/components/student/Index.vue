<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
      	<v-card-title primary-title class="title pb-1 pt-2">
      			<v-text-field  label="Cari santri" v-model="keyword" persistent-hint hint="Tulis minimal 3 huruf"></v-text-field>     
      			<v-spacer></v-spacer> 			
      		  <v-btn fab small right absolute color="green darken-1" class="white--text" @click="newStudent"> 
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
	            
	            <v-list-tile-action>
	              <v-btn icon ripple :to="'/students/'+student.id">
	                <v-icon color="grey lighten-1">remove_red_eye</v-icon>
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
			                <v-list-tile-title>Non Aktifkan</v-list-tile-title>
			              </v-list-tile>
			              <v-list-tile>
			                <v-list-tile-title>Hapus</v-list-tile-title>
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
				    <v-pagination @input="next" color="green" :length="filteredStudents.last_page" v-model="filteredStudents.current_page" :total-visible="7"></v-pagination>
				  </div>
      	</v-card-text>
      </v-card>      
    </v-flex>


    <v-dialog v-model="dialog" fullscreen>
    	<form>
    	<v-card tile>    	
          <v-toolbar fixed dark color="green">
            <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="storeStudent">Simpan</v-btn>
            </v-toolbar-items>
            <v-btn icon @click="resetStudent" dark>
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>

    			<v-card-text style="padding-top:72px;">				 	
	          <div class="text-xs-center">
	            <label v-show="showCroppie === false" for="customFile">		            
		            <v-avatar v-if="cropieImage || student.image" size="128">		            	
		            	<img :src="studentImage" alt="">
		            </v-avatar>
		            <v-chip><v-icon>image</v-icon> {{ cropieInputLabel }}</v-chip>
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
				    
						<v-menu ref="menu2" lazy :close-on-content-click="false" v-model="menu2" offset-y full-width min-width="200px" >
					    <v-text-field slot="activator" label="Tanggal lahir" v-model="inverseBirthDate" prepend-icon="event" readonly></v-text-field>
					    <v-date-picker ref="picker" locale="id" v-model="student.birth_date" @change="saveBirthDate" min="1950-01-01"
					      :max="new Date() | moment('subtract', '3 year') | moment('YYYY-MM-DD')"></v-date-picker>
					  </v-menu>

						<v-text-field label="Tempat lahir" v-model="student.birth_place"></v-text-field>						

				    <v-text-field label="Nama lengkap" v-model="student.fullname" required
				    	:error-messages="fullnameErrors" @input="$v.student.fullname.$touch()" @blur="$v.student.fullname.$touch()"></v-text-field>	
				    <v-text-field label="Nama panggilan" v-model="student.nickname" required
				    	:error-messages="nicknameErrors" @input="$v.student.nickname.$touch()" @blur="$v.student.nickname.$touch()"></v-text-field>	

				    <v-text-field v-if="student.class_group_id == 1" label="Nama ayah" v-model="student.father"></v-text-field>	
				    <v-text-field v-if="student.class_group_id == 1" label="Nama bunda" v-model="student.mother"></v-text-field>	
				    <v-text-field label="Alamat" v-model="student.address"></v-text-field>	
				    <v-text-field :label="jobLabel" v-model="student.job"></v-text-field>	
				    <v-text-field :label="phoneLabel" v-model="student.phone"></v-text-field>	
				    				    

				    <v-text-field label="SPP per bulan" v-model="student.tuition"
				    	:error-messages="tuitionErrors" @input="$v.student.tuition.$touch()" @blur="$v.student.tuition.$touch()"></v-text-field>	
				    <v-text-field label="Kesanggupan biaya Sapras" v-model="student.infrastructure_fee"
				    	:error-messages="infrastructureFeeErrors" @input="$v.student.infrastructure_fee.$touch()" @blur="$v.student.infrastructure_fee.$touch()"></v-text-field>	
				    <v-text-field label="Biaya seragam" v-model="student.uniform_fee"
				    	:error-messages="uniformFeeErrors" @input="$v.student.uniform_fee.$touch()" @blur="$v.student.uniform_fee.$touch()"></v-text-field>	

				    <v-text-field label="Catatan" v-model="student.notes"></v-text-field>	

				  
	    		</v-card-text>	        
    	</v-card>
    </form>
    </v-dialog>

  </v-layout>
</template>

<script>

  import Vue from 'vue'
  import VueCroppie from 'vue-croppie'
  Vue.use(VueCroppie)
  Vue.use(require('vue-moment'));

  import { validationMixin } from 'vuelidate'
  import { required, numeric } from 'vuelidate/lib/validators'

  export default {
  	mixins: [validationMixin],
  	validations: {
  		student:{
	      class_group_id: { required },
	      gender: { required },
	      fullname: { required },
	      nickname: { required },
	      tuition: { numeric },
	      infrastructure_fee: { numeric },
	      uniform_fee: { numeric },
	    }
    },

    data () {
      return {
      	keyword:'',

      	//croppie
      	cropieImage:'',
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
        editedIndex: -1,
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

        defStudent:{
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

			dialog (val) {
        val || this.closeDialog()
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
    	studentImage(){
    		if (this.cropieImage){
    			return this.cropieImage
    		} else {
    			if (this.student.image){
    				return this.$root.baseUrl+'/imgcc/large/'+this.student.image
    			}
    		}
    	},
    	cropieInputLabel(){
    		if(this.student.image || this.cropieImage ){ return "Ganti foto" }
				else { return "Tambah foto" }
    	},
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
    	},

    	dialogTitle () {
        return this.editedIndex === -1 ? 'Santri baru' : 'Edit santri'
      },

 			classGroupErrors () {
        const errors = []
        if (!this.$v.student.class_group_id.$dirty) return errors
        !this.$v.student.class_group_id.required && errors.push('Harus dipilih salah satu!')
        return errors
      },
      genderErrors () {
        const errors = []
        if (!this.$v.student.gender.$dirty) return errors
        !this.$v.student.gender.required && errors.push('Harus dipilih salah satu!')
        return errors
      },
      fullnameErrors () {
        const errors = []
        if (!this.$v.student.fullname.$dirty) return errors
        !this.$v.student.fullname.required && errors.push('Nama lengkap harus diisi!')      	
        return errors
      },
      nicknameErrors () {
        const errors = []
        if (!this.$v.student.nickname.$dirty) return errors
        !this.$v.student.nickname.required && errors.push('Nama panggilan harus diisi!')
        return errors
      },
      tuitionErrors () {
        const errors = []
        if (!this.$v.student.tuition.$dirty) return errors
        !this.$v.student.tuition.numeric && errors.push('Hanya boleh diisi dengan angka!')
        return errors
      },
      infrastructureFeeErrors () {
        const errors = []
        if (!this.$v.student.infrastructure_fee.$dirty) return errors
        !this.$v.student.infrastructure_fee.numeric && errors.push('Hanya boleh diisi dengan angka!')
        return errors
      },
      uniformFeeErrors () {
        const errors = []
        if (!this.$v.student.uniform_fee.$dirty) return errors
        !this.$v.student.uniform_fee.numeric && errors.push('Hanya boleh diisi dengan angka!')
        return errors
      },


    },

    methods:{
    	
  		getStudents(){
  			this.axios.get('students')
      	.then((response)=>{this.students = this.filteredStudents = response.data})
				.catch((error)=>this.errors = error.response.data.errors)       			
  		},    		

  		newStudent(){
  			this.dialog = true
  			this.cropieImage = ''
  		},

    	storeStudent(){
    		this.$v.$touch()    		
    		if (this.editedIndex > -1) {    			
	    		this.axios.put('students/'+this.student.id, this.student)
	    		.then(response=>{   
	    			// console.log(response.data) 			
	    			this.closeDialog()
	    			Object.assign(this.students.data[this.editedIndex], response.data)	    			
	    			// this.getStudents()
	    			this.student = this.defStudent
	    		})
    		} else {
	    		this.axios.post('students', this.student)	    		
	    		.then(response=>{    			
	    			this.closeDialog()
	    			this.getStudents()
	    			this.student = this.defStudent
	    		})
	    	}	    	
    	},

    	editStudent(student){
    		this.editedIndex = this.students.data.indexOf(student)
    		this.student = Object.assign({}, student)
    		this.dialog = true
    		this.cropieImage = ''	
    	},

    	resetStudent(){
    		if(this.editedIndex > -1 ){
    			this.student = this.defStudent
    		}
    		this.dialog = false
    		this.showCroppie = false
    	},

    	inverseDate(dt){
    		if(dt){
    			return dt.split("-").reverse().join("-")
    		}
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
          this.cropieImage = output
          this.student.image = this.cropieImage
        })                  
      },

   	  saveRegisteredDate (date) {
	     	this.$refs.menu1.save(date)
			},

			saveBirthDate (date) {
	     	this.$refs.menu2.save(date)
			},

			update(val) {
        console.log(val);
      },
      rotate(rotationAngle) {
        this.$refs.croppieRef.rotate(rotationAngle);
      },
      next(page){
      	this.axios.get('students?page='+page)
      	.then((response)=>{this.students = this.filteredStudents = response.data})
      },
      closeDialog () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.student)
          this.editedIndex = -1
        }, 300)
      },
    }

  }
</script>

