<template>
  <div class="tab-main">
    <el-upload
      class="upload-demo"
      action="http://34.142.40.169:8081/group-file/upload"
      accept=".pdf, .doc, .docx"
      :before-upload="handleUpload"
      :on-success="handleSuccess"
      :show-file-list="false"
      :file-list="fileList"
    >
      <el-button size="medium" type="primary" icon="el-icon-upload2">Upload</el-button>
      <div slot="tip" class="el-upload__tip">only pdf/doc file is accepted ( maximum size: 50MB )</div>
    </el-upload>

    <el-table
      :data="tableData"
      fit
      :row-class-name="tableRowClassName"
      style="width: 100%; padding-top: 20px"
    >
      <el-table-column label="Name" min-width="150">
        <template slot-scope="{row}">
          <el-input
            v-if="row.index === rowIndex && showEdit"
            ref="saveNameInput"
            v-model="temp.fileName"
            maxlength="50"
            show-word-limit
            @blur="handleInputConfirm(row)"
          >
            <template slot="append">{{ row.fileName.replace(/.+\./, ".").toLowerCase() }}</template>
          </el-input>
          <el-link v-else :href="row.filePath" type="primary" target="_blank" style="font-weight: 1;">{{ row.fileName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="Added Date" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.addedDate.substring(0, 10) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Added Person" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.uploader }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.uploader === $store.getters.name || $store.getters.roles[0] !== 'student'" type="primary" size="mini" @click="showNameInput(row)">
            Rename
          </el-button>
          <el-button v-if="row.uploader === $store.getters.name || $store.getters.roles[0] !== 'student'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deleteFile, getFile, getFileInfo, updateName } from '@/api/group'

export default {
  name: 'File',
  data() {
    return {
      temp: {
        id: undefined,
        groupId: undefined,
        fileName: '',
        addedDate: '',
        filePath: '',
        uploader: ''
      },
      fileList: [],
      tableData: [],
      showEdit: false,
      rowIndex: -1
    }
  },
  created() {
    this.fetchFile()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        groupId: undefined,
        fileName: '',
        addedDate: '',
        filePath: '',
        uploader: ''
      }
    },
    fetchFile() {
      const groupId = this.$route.params.id
      getFile(groupId).then(response => {
        this.tableData = response.data.items
      })
    },
    // handle file
    handleUpload(file) {
      return new Promise((resolve, reject) => {
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          this.$message.warning('The maximum upload file size is 50MB')
          return reject(false)
        }
        return resolve(true)
      })
    },
    handleSuccess(file) {
      const fileId = file.data.id
      const groupId = this.$route.params.id
      getFileInfo(fileId, groupId).then(response => {
        this.temp = response.data
        this.tableData.push(this.temp)
        this.$notify({
          title: 'Success',
          message: 'Upload Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },

    showNameInput(row) {
      this.rowIndex = row.index
      this.resetTemp()
      this.showEdit = true
      this.$nextTick(_ => {
        this.$refs.saveNameInput.focus()
      })
    },
    handleInputConfirm(row) {
      const nameValue = this.temp.fileName
      if (nameValue === '' || nameValue === undefined || nameValue === null) {
        this.showEdit = false
      } else {
        this.temp = Object.assign({}, row)
        const suffix = row.fileName.replace(/.+\./, '.').toLowerCase()
        this.temp.fileName = nameValue + suffix
        updateName(this.temp).then(() => {
          const index = this.tableData.findIndex(v => v.id === this.temp.id)
          this.tableData.splice(index, 1, this.temp)
          this.showEdit = false
          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
        })
      }
    },
    handleDelete(row, index) {
      this.$confirm('Are you sure you want to delete this file?').then(() => {
        this.temp = Object.assign({}, row)
        const tempData = Object.assign({}, this.temp)
        deleteFile(tempData).then(() => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.tableData.splice(index, 1)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
