<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        Add
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      :data="list"
      fit
      style="width: 100%;"
    >
      <el-table-column label="Title" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Authors" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.authors }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Year" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.year }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Added Date" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.addedDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Info
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handlePageList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Authors" prop="authors">
          <el-input v-model="temp.authors" />
        </el-form-item>
        <el-form-item label="Year" prop="year">
          <el-input v-model="temp.year" />
        </el-form-item>
        <el-form-item label="Added Date">
          <el-date-picker v-model="temp.addedDate" type="date" value-format="yyyy-MM-dd" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="File">
          <el-upload
            ref="upload"
            action="http://34.142.40.169:8081/pdf/upload"
            :before-upload="handleUpload"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            accept=".pdf"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">Choose File</el-button>
            <div slot="tip" class="el-upload__tip">only one PDF file is accepted ( maximum size: 50MB )</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="URL" prop="urlPath">
<!--          <el-input v-model="temp.urlPath" />-->
<!--          <el-link href="https://element.eleme.io" target="_blank">https://element.eleme.io</el-link>-->
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            size="large"
            closable
            :disable-transitions="true"
            @close="handleClose(tag)">
            <el-link :href="tag" target="_blank" :underline="false">{{tag.length>30?tag.substring(0,29)+'...':tag}}</el-link>
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="temp.urlPath"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput" :style="{ display: buttonVisible }">+ New URL</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createDocument, deleteDocument, deletePdf, fetchList, getPdf, updateDocument } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DocumentList',
  components: { Pagination },
  directives: { waves },
  data() {
    const checkYear = (rule, value, cb) => {
      const regYear = /^\d{4}$/
      if(value === '' || value === undefined || value === null){
        return cb()
      }else{
        if(!regYear.test(value)){
          cb(new Error('Please enter the correct year'))
        }else{
          return cb()
        }
      }
    }

    const checkUrl = (rule, value, cb) => {
      const regUrl = /(http|https):\/\/([\w.]+\/?)\S*/
      if(value === '' || value === undefined || value === null){
        return cb()
      }else{
        if(!regUrl.test(value)){
          cb(new Error('Please enter the correct url'))
        }else{
          return cb()
        }
      }
    }

    return {
      tableKey: 0,
      allList: null,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        title: '',
      },
      temp: {
        id: undefined,
        title: '',
        authors: '',
        year: '',
        addedDate: '',
        type: '',
        fileId: 0,
        urlPath: '',
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Info',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        title: [
          { required: true, message: 'Title is required', trigger: 'blur' },
          { min: 0, max: 100, message: 'Title is too long', trigger: 'blur'}
        ],
        authors: [{ min: 0, max: 50, message: 'Input is too long', trigger: 'blur' }],
        year: [{validator: checkYear, trigger: 'blur'}],
        urlPath : [
          {validator: checkUrl, trigger: 'blur'},
          {max: 2048, message: 'Input is too long', trigger: 'blur'}
        ]
      },
      downloadLoading: false,
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      buttonVisible: 'none',
      fileList: [],
      file: {
        name: '',
        url:''
      }
    }
  },
  computed: {
    getPageList() {
      return this.allList.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchList(this.listQuery.title).then(response => {
        this.allList = response.data.items
        this.total = response.data.total
        this.list = this.getPageList
      })
    },
    handlePageList() {
      this.list = this.getPageList
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: 'Operation Success',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: '',
        title: '',
        authors: '',
        year: '',
        addedDate: '',
        type: '',
        fileId: 0,
        urlPath: '',
      }
      this.dynamicTags = []
    },
    handleCreate() {
      this.resetTemp()
      this.fileList = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.buttonVisible = '';
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs.upload.submit()
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createDocument(this.temp).then(response => {
            this.temp.id = response.data.id
            // this.allList.push(this.temp)
            this.getList()
            this.dialogFormVisible = false
            // this.total = this.total + 1
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      const pdfId = this.temp.fileId
      if (pdfId !== null && pdfId !== 0) {
        getPdf(pdfId).then(response => {
          this.file.name = response.data.pdfName
          this.file.url = response.data.pdfUrl
          this.fileList = [this.file]
        })
      }else{
        this.fileList = []
      }
      this.buttonVisible = 'none'
      //this.temp.addedDate = new Date(this.temp.addedDate)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.dynamicTags = []
      if (this.temp.urlPath !== '') {
        this.dynamicTags.push(this.temp.urlPath);
      }else {
        this.buttonVisible = '';
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.addedDate = +new Date(tempData.addedDate) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateDocument(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('Are you sure you want to delete this document?').then(() => {
        this.temp = Object.assign({}, row)
        const tempData = Object.assign({}, this.temp)
        deleteDocument(tempData).then(() => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
          this.total = this.total - 1
          this.getList()
        })
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'addedDate') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.buttonVisible = '';
      this.temp.urlPath = '';
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let urlValue = this.temp.urlPath;
      this.$refs.dataForm.validateField("urlPath", (errMsg) => {
        if(!errMsg) {
          if(urlValue === '' || urlValue === undefined || urlValue === null) {
            this.inputVisible = false;
          } else {
            this.dynamicTags.push(urlValue);
            this.buttonVisible = 'none';
            this.inputVisible = false;
          }
        }else {
          return false;
        }
      })
    },
    handleUpload(file) {
      return new Promise((resolve, reject) => {
        const isLt50M = file.size / 1024 / 1024 < 50
        if(!isLt50M) {
          this.$message.warning('The maximum upload file size is 50MB');
          return reject(false);
        }
        return resolve(true);
      })
    },
    handleSuccess(file) {
      this.temp.fileId = file.data.id;
      getPdf(this.temp.fileId).then(response => {
        this.file.name = response.data.pdfName
        this.file.url = response.data.pdfUrl
      })
    },
    handleRemove(file) {
      const pdfId = this.temp.fileId;
      if(pdfId !== 0) {
        deletePdf(this.temp.fileId).then(() => {
          this.temp.fileId = 0;
          const index = this.list.findIndex(v => v.id === this.temp.id)
          this.list.splice(index, 1, this.temp)
        })
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning('The current limit is 1 file, please delete it and continue uploading');
    },
    handlePreview() {
      window.open(this.file.url);
    },
    beforeRemove(file) {
      if (file && file.status==="success") {
        return this.$confirm(`Are you sure you want to delete ${ file.name }？`);
      }
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 95px;
  vertical-align: bottom;
}
.el-upload-list__item .el-icon-close-tip {
  display: none !important;
  transition: none !important;
}
.el-upload-list__item {
  transition: none !important;
}
</style>
