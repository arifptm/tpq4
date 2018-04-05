<template>
  <v-container fluid>
    <v-text-field
      label="E-mail"
      v-model="tes.email"
      :error-messages="emailErrors"
      @input="$v.tes.email.$touch()"
      @blur="$v.tes.email.$touch()"
    ></v-text-field>  
  </v-container>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, email } from 'vuelidate/lib/validators'

  export default {
    mixins: [validationMixin],

    validations: {      
      tes:{
        email: { required, email },
      }
    },

    data: () => ({
      tes:{
        email: '',
      }
    }),

    computed: {
      emailErrors () {
        const errors = []
        if (!this.$v.tes.email.$dirty) return errors
        !this.$v.tes.email.email && errors.push('tidak valid')
        !this.$v.tes.email.required && errors.push('harus diisi')
        return errors
      }
    },
  }
</script>