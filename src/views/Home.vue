<template>
  <div class="home">
    <button
      class="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded text-xl"
      @click="$router.push('participants')"
    >
      START &#8594;
    </button>
    <hr class="mb-16" />
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

@Options({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {}
</script>
