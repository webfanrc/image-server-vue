<template>
  <div class="app">
    <!--
    application/x-www-form-urlencoded: key-value tuples separated by '&'
    multipart/form-data: block of data(body part) 表单上传文件格式
    text/plain
    -->
    <form enctype="multipart/form-data" novalidata v-if="isInitial || isSaving">
      <h1>Upload images</h1>

      <div class="dropbox">
        <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount= $event.target.files.length" accept="image/*" class="input-file">

        <p v-if="isInitial">
          Drag your file(s) here to being
          <br>
          or click to browse
        </p>

        <p v-if="isSaving">
          Uploading {{fileCount}} files...
        </p>

      </div>

    </form>

    <div v-if="isSuccess">
      <h2>Uploaded {{fileCount}} file(s) successfully.</h2>
      <p>
        <a href="javascript:void(0)" @click="reset()">Upload again</a>
      </p>
    </div>
    <div v-if="isFailed">
      <h2>Uploaded failed.</h2>
      <p>
        <a href="javascript:void(0)" @click="reset()">Try again</a>
      </p>
      <pre>
        {{uploadError}}
      </pre>
    </div>
  </div>
</template>

<script>
  import {httpUpload} from '../utils/file-upload.servics' //http
  import axios from 'axios';

  const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAIL = 3;

  export default {
    name: 'App',
    data: function() {
      return {
        uploadedFiles: [],
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'photos',
        fileCount: 0,
      }
    },
    computed: {
      isInitial() {
        return this.currentStatus == STATUS_INITIAL;
      },
      isSaving() {
        return this.currentStatus == STATUS_SAVING;
      },
      isSuccess() {
        return this.currentStatus == STATUS_SUCCESS;
      },
      isFailed() {
        return this.currentStatus == STATUS_FAIL;
      }
    },
    methods: {
      reset() {
        this.currentStatus = STATUS_INITIAL;
        this.uploadedFiles = [];
        this.uploadError = null;
      },
      save(formData) {
        this.currentStatus = STATUS_SAVING;

        // console.log(formData); // 为啥没东西
        httpUpload(formData) // 为啥又有了
          .then( response => {
            if (response.data.code == 0) {
              this.currentStatus = STATUS_SUCCESS
            } else {
              this.currentStatus = STATUS_FAIL;
              this.uploadError = response.data.err;
            }
          });
      },
      filesChange(fieldName, fileList) {
        const formData = new FormData(); // 创建新的表单元素;

        if (fileList.length == 0) return;

        /*
        生成formData，模式：
        key
        value
        文件名称

        先生成数组[0,1,2,..., fileList.length - 1],然后借助这个数组遍历fileList，append到formData中
        感觉上比较冗余，就是看起来有点屌
         */
        // Array
        //   .from(Array(fileList.length).keys())
        //   .map(x => {
        //     formData.append(fieldName, fileList[x], fileList[x].name + 'kk');
        //   });

        // 感觉这个也行，而且更加清楚
        fileList.forEach(n => {
          formData.append(fieldName, n, n.name);
        });


        this.save(formData);

      }
    },
    mounted() {
      this.reset();
    }
  }
</script>

<style lang="less">
  .dropbox {
    outline: 2px dashed gray;
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    min-height: 200px;
    &:hover {
      cursor: pointer;
    }
    .input-file {
      opacity: 0; //*
      width: 100%;
      height: 200px;
      position: absolute;
      cursor: pointer;
    }
    p {
      font-size: 2.0em;
      text-align: center;
      padding: 50px 0;
    }
  }

</style>
