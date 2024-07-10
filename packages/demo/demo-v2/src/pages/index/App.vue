<!--
 * @Author: zhanganqi01
 * @Date: 2024-07-04 17:11:10
 * @LastEditTime: 2024-07-09 12:08:51
 * @FilePath: /configured-fe/packages/demo/demo-v2/src/pages/index/App.vue
 * @Description: 注释footer
-->
<template>
    <div :class="$style.wrap">
        <router-view></router-view>
        <!-- <footer :class="$style.footer">
            <a href="https://github.com/lljj-x/vue-json-schema-form">vue-json-schema-form</a>
        </footer> -->
    </div>
</template>

<script>
export default {
    name: 'App',
};
</script>

<style module>
    .footer {
        font-size: 14px;
        padding: 10px 0;
        text-align: center;
    }
</style>
