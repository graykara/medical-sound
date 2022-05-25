<script>
  import '../public/global.css';

  import Router from 'svelte-spa-router';
  import Header from './components/Header.svelte';
  // routes
  import Welcome from './components/Welcome.svelte';
  import Main from './components/Main.svelte';
  import Config from './components/Config.svelte';

  const routes = {
    '/': Welcome,
    '/main': Main,
    '/config': Config
  }
</script>

<Header />

<main>
  <Router {routes} />
</main>

<style>

</style>
