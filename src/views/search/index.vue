<template>
  <div class="app-container">
    <div class="search_input" style="text-align: center; margin-top: 100px;">
      <el-image style="width: 150px; height: 150px" :src="logo" />
      <h1 style="margin-top: 20px">Literature Search</h1>
      <el-input v-model="searchInput" placeholder="Please enter the content" class="input-with-select" style="width: 60%; font-size: 15px; margin-top: 20px">
        <el-select slot="prepend" v-model="searchWeb" style="font-size: 15px">
          <el-option label="Google Scholar" value="https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=" />
          <el-option label="ScienceDirect" value="https://www.sciencedirect.com/search?qs=" />
          <el-option label="Baidu Scholar" value="https://xueshu.baidu.com/s?wd=" />
          <el-option label="Taylor & Francis" value="https://www.tandfonline.com/action/doSearch?AllField=" />
          <el-option label="Springer" value="https://link.springer.com/search?query=" />
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
      </el-input>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Index',
  data() {
    return {
      searchInput: '',
      searchWeb: 'https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=',
      logo: require('@/assets/image/logo1.png')
    }
  },
  methods: {
    handleSearch() {
      window.open(this.searchWeb + this.searchInput)
    }
  }
}
</script>

<style lang="scss">
.el-select .el-input {
  width: 165px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.search_input .el-input--medium .el-input__inner {
  height: 50px;
  line-height: 50px;
}
</style>
