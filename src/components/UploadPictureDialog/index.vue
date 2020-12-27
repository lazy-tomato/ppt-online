<!--
 * @Author: lazy_tomato
 * @Date: 2020-12-27 15:26:05
 * @LastEditors: lazy_tomato
 * @LastEditTime:  2020-12-27 15:26:05
 * @Description: 图片本地上传组件
 -->

<template>
  <div class="picture-upload-dialog">
    <el-dialog
      title="上传图片"
      :visible="true"
      :before-close="close"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-row class="picture-upload-content" :gutter="10">
        <el-col class="upload-content" :span="8">
          <el-upload
            ref="fileUpload"
            drag
            :auto-upload="false"
            :multiple="false"
            action="/iconupload"
            :show-file-list="false"
            :on-change="autoUpload"
            accept="image/png, image/jpeg, image/gif"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text" style="position: relative">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-col>
        <el-col
          class="picture-content"
          :span="16"
          :class="{ focus: file && file.thumbnailViewUrl }"
        >
          <el-image
            v-if="file && file.thumbnailViewUrl"
            :src="file.thumbnailViewUrl"
            :preview-src-list="[file.thumbnailViewUrl]"
            title="点击查看大图"
            alt="缩略图"
          />
          <span v-else> 图片缩略图预览区域 </span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          :disabled="!file"
          @click="confirm"
          >确 定</el-button
        >
        <el-button size="small" @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存储上传后的图片数据
      file: {
        viewUrl: "",
        thumbnailViewUrl: "",
        uuid: "",
      },
    };
  },
  methods: {
    // 图片上传 change事件 。实际项目应该上传到服务器的，服务器会返回一个图片url等一系列数据
    // 这里用于本地展示，就没有请求接口，直接获取到图片直接转base64展示的
    autoUpload(req) {
      // req.raw input获取到的图片数据
      // 下面操作是 将图片数据转换成base64 url形式
      let reader = new FileReader();
      reader.readAsDataURL(req.raw);

      // 转换成功后的操作，reader.result即为转换后的DataURL ，
      reader.onload = () => {
        this.$message({
          message: "上传成功",
          type: "success",
        });

        /* 接口返回的标准图片对象是这样的,组件也是基于这个封装的，懒得改了，所以 后面就直接设置了。
         * fileType: "png"
         * thumbnailViewUrl: "图片url"
         * uuid: "图片唯一的iduuid"
         * viewUrl:"图片url"
         */

        this.file.viewUrl = reader.result; //图片url
        this.file.thumbnailViewUrl = reader.result; //图片url
        this.file.uuid = new Date().valueOf(); //图片唯一标识，必须要，因为后续的页面使用了这个id去做唯一标识，我这里用了当前时间戳
      };
    },

    confirm() {
      this.$emit("success", this.file);
      this.$emit("close");
    },
    close(done) {
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss" scoped>
.picture-upload-dialog {
  .picture-upload-content {
    display: flex;
    flex-direction: row;
    .upload-content {
      /deep/ .el-upload {
        width: 100%;
        .el-upload-dragger {
          display: flex;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          height: auto;
          height: 200px;
          .el-icon-upload {
            margin: 0;
          }
        }
      }
      /deep/ .el-progress-bar {
        transition: all 0.5s;
      }
    }
    .picture-content {
      height: 200px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      translate: width height 0.5s;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      padding: 0.5rem;
      transition: border 1s;
      /deep/ .el-image {
        height: 100%;
        width: 100%;
        img {
          object-fit: cover;
          max-width: 100%;
          max-height: 100%;
        }
      }
      &:hover {
        transition: border 1s;
      }
    }
    .focus {
      transition: border 1s;
    }
  }
}
</style>
