<script setup>
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
</script>

<template>
  <ParentLayout>
    <template #page-bottom>
      <div class="my-footer">
        <hr>
        <a href="/privacypolicy.html">Privacy Policy </a> - 
        <a href="/donate.html#sponsoring">Sponsors </a><br>
        <a href="https://www.digitalocean.com/" target="_blank"><img class="sponsor_logo" src="../public/images/DO_Powered_by_Badge_blue.svg"/></a>
        <a href="https://incube8games.com/" target="_blank" alt="Incube8 Games - Physical Retro Gaming Publisher"><img alt="Incube8 Games - Physical Retro Gaming Publisher" class="sponsor_logo incube8" src="../public/images/Incube8-Games-Logo.png"/></a>
      </div>
    </template>
  </ParentLayout>
</template>

<style lang="css">
.my-footer {
  font-size: 0.75rem;
  text-align: center;
  padding-top: 20px;
}
.sponsor_logo {
  padding-top: 10px;
  padding-left: 15px;
  height: 35px;
}
.incube8 {
  filter: drop-shadow(0 0 0.4rem white);
}
</style>
