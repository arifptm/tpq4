<template>
	<div>
		{{ student.fullname }}
	</div>
</template>

<script>

	export default{

		data() {
			return {
				student: {},
			}
		},

		created(){
			this.getStudent()
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