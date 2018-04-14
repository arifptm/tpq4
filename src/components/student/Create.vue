<template>
	<v-layout row justify-center>
	<v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen scrollable :overlay="false"> 
    	<!-- <form ref="form"> -->
    		<v-card tile>    	
          <v-toolbar card dark color="green">
            <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn :disabled="showCroppie" dark flat @click="storeStudent">Simpan</v-btn>
            </v-toolbar-items>
            <v-btn icon @click="closeSelf" dark>
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>

    			<v-card-text>
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
    	<!-- </form> -->
    </v-dialog>
  </v-layout>
</template>

<script>

	import { validationMixin } from 'vuelidate'
  import { required, numeric } from 'vuelidate/lib/validators'

	export default{

		props: ['editedIndex'],

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

		data(){
			return {
				dialog: false,
				menu1: false,
			  menu2: false,
			  date: null,

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

        student:{
        	id:'',
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
        	id:'',
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

			}
		},

		created(){

		},

		watch:{
	    menu1 (val) {
	      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
	    },
	    menu2 (val) {
	      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
	    },
	    dialog (val) {
        val || this.$emit('closeDialog')        
      },
		},

		computed:{
    	studentImage(){
    		if (this.cropieImage){
    			return this.cropieImage
    		} else {
    			if (this.student.image){
    				return this.$root.baseUrl+'/imgcc/medium-sq/'+this.student.image
    			}
    		}
    	},			
			dialogTitle () {
        return this.editedIndex === -1 ? 'Santri baru' : 'Edit santri'
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

		methods: {
    	
    	inverseDate(dt){
    		if(dt){
    			return dt.split("-").reverse().join("-")
    		}
    	}, 

   	  saveRegisteredDate (date) {
	     	this.$refs.menu1.save(date)
			},

			saveBirthDate (date) {
	     	this.$refs.menu2.save(date)
			},    	     
      
      storeStudent(){
    		this.$v.$touch()    		
    		if (this.editedIndex > -1) {  
    			const idx = this.editedIndex
	    		this.axios.put('students/'+this.student.id, {student:this.student, image: this.cropieImage})
	    		.then(response=>{   	    	
              console.log(response.data)		
	    			this.$emit('commitEdited', {data: response.data, idx: idx})
	    		})
    		} else {
	    		this.axios.post('students', {student:this.student, image: this.cropieImage})
	    		.then(response=>{    			
	    			this.$emit('getStudents')
	    		})
	    	}
	    	this.student = this.defStudent
	    	this.$emit('closeDialog')
	    	this.cropieImage = ''
    	},

    	closeSelf(){
    		if (this.editedIndex > -1) { 
    			this.student = this.defStudent
    		}
    		this.$emit('closeDialog')
    	},

    	rotate(rotationAngle) {
        this.$refs.croppieRef.rotate(rotationAngle);
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
          // setZoom: 2
        }          
        this.showCroppie = false
        this.$refs.croppieRef.result(options, (output) => {
          this.cropieImage = output
          // this.student.image = this.cropieImage
        })                  
      },
		}
	}
</script>