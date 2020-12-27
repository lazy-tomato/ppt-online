 <!--
 * @Author: lazy_tomato
 * @Date: 2020-12-27 15:26:05
 * @LastEditors: lazy_tomato
 * @LastEditTime:  2020-12-27 15:26:05
 * @Description: ppt预览
 -->

<template>
  <div class="ppt-preview" v-if="templateData" ref="preview">
    <div class="open-or-close" ref="buttons">
      <el-button
        v-show="isOpen"
        type="primary"
        icon="el-icon-open"
        circle
        @click="openOrClose"
      ></el-button>
      <el-button
        v-show="!isOpen"
        type="info"
        icon="el-icon-turn-off"
        circle
        @click="openOrClose"
      ></el-button>
    </div>
    <div v-show="isOpen">
      <el-radio-group v-model="radio">
        <el-radio-button label="1">Banner预览</el-radio-button>
        <el-radio-button label="2">模拟ppt预览</el-radio-button>
      </el-radio-group>
      <el-button type="primary" plain @click="backHmoe" class="back-hmoe"
        >重新编辑</el-button
      >
    </div>

    <div class="ppt-preview-show" v-if="previewHeight">
      <div v-show="radio === '1'">
        <p-p-t-preview
          :image-list="templateData"
          :preview-height="previewHeight"
        />
      </div>
      <div v-show="radio === '2'">
        <h3>
          还要在炫酷一点可以
          用Impress.js等框架，或者自己写个原生css的动画也可以，我就暂时使用轮播图
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
import PPTPreview from "@/components/PPTPreview/index";

export default {
  components: {
    PPTPreview,
  },
  data() {
    return {
      // 按钮的控制的变量
      isOpen: true,
      // 单选按钮
      radio: "1",
      // 预览的数据
      templateData: null,
      //   预览的高度
      previewHeight: 0,
    };
  },
  created() {
    if (JSON.parse(localStorage.getItem("template")).length > 0) {
      this.templateData = JSON.parse(localStorage.getItem("template"));
    } else {
      this.$confirm("本地缓存不存在ppt数据", "确认信息", {
        distinguishCancelAndClose: false,
        showCancelButton: false,
        confirmButtonText: "现在去创建",
      }).then(() => {
        this.$router.push({
          path: "/",
        });
      });
    }
  },
  methods: {
    openOrClose() {
      this.isOpen = !this.isOpen;
    },
    backHmoe() {
      this.$router.push({
        path: "/",
      });
    },
  },
  mounted() {
    if (this.isOpen) {
      this.previewHeight = this.$refs.preview.clientHeight - 40;
    }
  },
};
</script>


<style lang='scss' scoped>
.ppt-preview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .back-hmoe {
    float: right;
    margin-right: 80px;
  }
  .open-or-close {
    z-index: 999;
    position: fixed;
    right: 0px;
    top: 0px;
  }
}
</style>