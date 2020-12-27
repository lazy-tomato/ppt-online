  <!--
 * @Author: lazy_tomato
 * @Date: 2020-12-27 15:26:05
 * @LastEditors: lazy_tomato
 * @LastEditTime:  2020-12-27 15:26:05
 * @Description:  PPT预览组件-根据后端参数,前端渲染出ppt效果，并且可拖拽
 -->

<template>
  <div class="previewPPT" ref="previewRef">
    <el-carousel :height="previewHeight + 'px'" class="list">
      <el-carousel-item v-for="element in imageList" :key="element.fileUuid" :loop='false'>
        <div class="listItem" :style="{ height: previewHeight + 'px' }">
          <img :src="element.url" alt="" class="masterImage" />
          <div
            class="showImageConfig"
            :style="{
              width: imgW + 'px',
              height: imgH + 'px',
            }"
          >
            <div class="scaleFun" :style="scaleFun">
              <!-- 添加的元素展示 -->
              <div
                v-for="(item, itemIndex) in element.templateParam"
                :key="itemIndex"
                class="addItem"
                :style="{
                  left: item.marginLeft + 'px',
                  top: item.marginTop + 'px',
                  fontFamily: item.font,
                  fontSize: item.size + 'px',
                  color: item.color,
                  width: item.width + 'px',
                  height: item.height + 'px',
                }"
              >
                <!-- 1.标题 -->
                <div v-if="item.type === 'title'">
                  <div>
                    {{ item.content }}
                  </div>
                </div>
                <!-- 2.正文 -->
                <div v-if="item.type === 'text'">
                  <div>
                    {{ item.content }}
                  </div>
                </div>
                <!-- 图片 -->
                <img
                  v-if="item.type === 'image'"
                  :src="item.subImage"
                  alt=""
                  style="width: 100%; height: 100%"
                />
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

  </div>
</template>

<script>
export default {
  props: {
    imageList: {
      required: false,
      type: Array,
      default: () => [],
    },
    previewHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      proportion: 1,
      // 修改前图片的宽高
      imgW: 0,
      imgH: 0,
    };
  },
  computed: {
    // 设置缩放比例
    scaleFun: function () {
      const scale = this.proportion;
      return `transform:scale(${scale},${scale})`;
    },
  },
  created() {
    this.gainImageWidthHeight();
  },
  methods: {
    // 获取图片列表第一张图片宽高比例获取
    gainImageWidthHeight() {
      const image = new Image();
      image.src = this.imageList[0].url;

      image.onload = () => {
        const imgW = image.width; // 图片自身宽
        const imgH = image.height; // 图片自身高
        this.imgW = imgW;
        this.imgH = imgH;
        this.proportion = this.previewHeight / imgH;
      };
    },  
  },
};
</script>
<style lang="scss" >
.previewPPT {
  user-select: none;

  .list {
    height: 100%;
    text-align: center;
    overflow: hidden;
    .listItem {
      text-align: left;
      position: relative;
      display: inline-block;
      overflow: hidden;
      width: auto;
      .masterImage {
        height: 100%;
        width: auto;
      }
      .showImageConfig {
        position: absolute;
        left: 0;
        top: 0;
        .scaleFun {
          position: relative;
          transform-origin: 0px 0px;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .addItem {
            position: absolute;
            display: inline-block;
            padding: 5px;
            min-width: 50px;
            min-height: 50px;
            word-break: break-all;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
