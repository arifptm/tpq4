<template>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="$emit('setDrawer')"></v-toolbar-side-icon>      
      <v-toolbar-title>{{ this.$root.pageTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-icon>search</v-icon> -->
    </v-toolbar>
</template>