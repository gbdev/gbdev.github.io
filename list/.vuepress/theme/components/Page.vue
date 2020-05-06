<template>
  <main class="page">
    <slot name="top" />

    <Content class="theme-default-content" />
    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" ><center><div style="font-size:13px; color:#4a4a4a">
            Game Boy is a registered trademark. This project is not endorsed by Nintendo.<br>
            © 2015-2020 <a href="https://avivace.com" target="_blank">Antonio Vivace</a> and <a href="https://github.com/gbdev/awesome-gbdev/graphs/contributors">contributors</a>. <br> <br><a href="https://digitalocean.com" target="_blank"> <img style="height: 30px" src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/PoweredByDO/DO_Powered_by_Badge_black.svg"></a>
        </div></center></slot>
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'

export default {
  components: { PageEdit, PageNav },
  props: ['sidebarItems']
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'

.page
  padding-bottom 2rem
  display block

</style>
