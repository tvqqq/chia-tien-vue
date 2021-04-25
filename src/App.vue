<template>
  <div id="app" class="font-sans text-gray-800">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/participants">Người tham gia</router-link> |
      <router-link to="/expenses">Chi tiêu</router-link> |
      <router-link to="/balances">Tổng kết</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
