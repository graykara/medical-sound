<script>
  import '../public/global.css';

  import Router from 'svelte-spa-router';
  import { onMount } from "svelte";

  import Header from './components/Header.svelte';
  import Welcome from './components/Welcome.svelte';
  import Main from './components/Main.svelte';
  import Config from './components/Config.svelte';

  import { list_store } from './lib/Lists';

  const routes = {
    '/': Welcome,
    '/main': Main,
    '/config': Config
  }

  let promise;

  onMount(() => {
    promise = list_store.init();
  });
</script>

{#await promise }
  WAIT
{:then}
  <Header />

  <main>
    <Router {routes} />
  </main>
{:catch error}
  ERROR {error.message}
{/await}



<style>

</style>
