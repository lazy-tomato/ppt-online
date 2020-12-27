 <!--
 * @Author: lazy_tomato
 * @Date: 2020-12-27 15:26:05
 * @LastEditors: lazy_tomato
 * @LastEditTime:  2020-12-27 15:26:05
 * @Description: ppt编辑页
 -->

<template>
  <div
    v-loading="saveLoading"
    class="templateEdit"
    element-loading-text="上传中..."
    element-loading-spinner="el-icon-loading"
  >
    <!-- 1.配置菜单区域 -->
    <div class="config">
      <el-row>
        <div
          v-show="
            activeMaster.fileUuid &&
            (form.type === 'text' || form.type === 'title')
          "
          class="configMenu"
        >
          <div class="configMenuItem">
            <div class="lableTips">内容</div>
            <el-input v-model="form.content" size="mini" style="width: 150px" />
          </div>

          <div class="configMenuItem">
            <div class="lableTips">字体</div>
            <el-select
              v-model="form.font"
              placeholder="请选择字体"
              size="mini"
              style="width: 100px"
            >
              <el-option label="微软雅黑" value="微软雅黑" />
              <el-option label="黑体" value="黑体" />
              <el-option label="幼圆" value="幼圆" />
              <el-option label="等线" value="等线" />
              <el-option label="仿宋" value="仿宋" />
              <el-option label="楷体" value="楷体" />
              <el-option label="宋体" value="宋体" />
              <el-option label="隶书" value="隶书" />
            </el-select>
          </div>

          <div class="configMenuItem">
            <div class="lableTips">文字大小</div>
            <el-input-number
              v-model="form.size"
              style="width: 100px"
              size="mini"
              controls-position="right"
              :min="14"
              :max="1000"
            />
          </div>

          <div class="configMenuItem">
            <div class="lableTips">宽度(单位：px)</div>
            <el-input-number
              v-model="form.width"
              size="mini"
              style="width: 95px"
              controls-position="right"
              :min="50"
              :max="9999"
            />
          </div>

          <div class="configMenuItem">
            <div class="lableTips">高度(单位：px)</div>
            <el-input-number
              v-model="form.height"
              size="mini"
              style="width: 95px"
              controls-position="right"
              :min="50"
              :max="9999"
            />
          </div>

          <div class="configMenuItem">
            <div class="lableTips">颜色</div>
            <el-color-picker
              v-model="form.color"
              size="mini"
              color-format="rgb"
            />
          </div>
        </div>
        <div
          v-show="activeMaster.fileUuid && form.type === 'image'"
          class="configMenu"
        >
          <div class="configMenuItem">
            <div class="lableTips">宽度(单位：px)</div>
            <el-input-number
              v-model="form.width"
              size="mini"
              controls-position="right"
              :min="50"
              :max="9999"
            />
          </div>

          <div class="configMenuItem">
            <div class="lableTips">高度(单位：px)</div>
            <el-input-number
              v-model="form.height"
              size="mini"
              controls-position="right"
              :min="50"
              :max="9999"
            />
          </div>
        </div>

        <div class="addMenu">
          <el-button
            v-show="activeMaster.fileUuid"
            class="addMenuButton"
            type="primary"
            round
            size="mini"
            @click="addTitle"
            >添加标题</el-button
          >
          <el-button
            v-show="activeMaster.fileUuid"
            class="addMenuButton"
            type="primary"
            round
            size="mini"
            @click="addText"
          >
            添加正文</el-button
          >
          <el-button
            v-show="activeMaster.fileUuid"
            class="addMenuButton"
            type="primary"
            round
            size="mini"
            @click="addImage"
            >添加图片</el-button
          >

          <el-button
            type="primary"
            round
            size="mini"
            class="addMenuButton submit"
            @click="submit"
            >保存预览
          </el-button>
        </div>
      </el-row>
    </div>
    <!-- 2.ppt操作页面 -->
    <div class="play">
      <div class="playList">
        <!-- 母版图片列表 -->
        <div class="master">
          <el-scrollbar style="height: 100%">
            <!--使用draggable组件-->
            <draggable
              v-model="imageList"
              chosen-class="chosen"
              animation="1000"
            >
              <transition-group>
                <div
                  v-for="(element, index) in imageList"
                  :key="index"
                  class="masterItem"
                  :class="[activeMasterIndex === index ? 'activeClass' : '']"
                  @click="activeImage(index, element)"
                >
                  <!-- 删除按钮 -->
                  <i
                    v-if="activeMasterIndex === index"
                    class="el-icon-error close"
                    @click="closeMaster"
                  />

                  <!-- 复制按钮 -->
                  <i
                    v-if="activeMasterIndex === index"
                    class="el-icon-document-copy copyButton"
                    @click="enterCopy"
                  />
                  <img :src="element.url" alt="" class="masterImage" />
                  <div
                    class="masterImageConfig"
                    :style="{
                      width: slideWidth + 'px',
                      height: slideHeight + 'px',
                    }"
                  >
                    <div class="scaleFun" :style="masterScaleFun">
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
                        <!-- 2.1.1 标题 -->
                        <div v-if="item.type === 'title'">
                          <div>
                            {{ item.content }}
                          </div>
                        </div>
                        <!-- 2.1.2 正文 -->
                        <div v-if="item.type === 'text'">
                          <div>
                            {{ item.content }}
                          </div>
                        </div>
                        <!-- 2.1.3 图片 -->
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
              </transition-group>
            </draggable>

            <div class="masterAdd" @click="addMasterImage">
              <i class="el-icon-plus upload_icon" />
              <p class="upload_tips">
                添加模板
                <!-- <b>(仅支持png,jpg,gif等格式)</b> -->
              </p>
            </div>
          </el-scrollbar>
        </div>
        <!-- 模板图片展示区域 -->
        <div ref="show" class="show" @click="clear">
          <div class="showImage">
            <img
              v-show="activeMaster.url"
              ref="imgContent"
              :src="activeMaster.url"
              :style="{ width: imgWidth + 'px', height: imgHeight + 'px' }"
            />
            <div
              class="showImageConfig"
              :style="{
                width: slideWidth + 'px',
                height: slideHeight + 'px',
              }"
            >
              <div :style="configScaleFun" class="scaleFun">
                <!-- 添加的元素展示 :id用于双击事件-->
                <div
                  v-for="(item, index) in scaleDiv"
                  v-show="scaleDiv"
                  :key="index"
                  class="addItem"
                  :class="item.isActive ? 'configActive' : ''"
                  :style="{
                    left: item.marginLeft + 'px',
                    top: item.marginTop + 'px',
                    fontFamily: item.font,
                    fontSize: item.size + 'px',
                    color: item.color,
                    width: item.width + 'px',
                    height: item.height + 'px',
                  }"
                  @mousedown.stop="move($event, index)"
                  @dblclick="dbl($event, index)"
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
                    style="width: 100%; height: 100%"
                    alt=""
                  />

                  <!-- 4.删除图标 -->
                  <i
                    v-if="
                      (item.type === 'image' ||
                        item.type === 'text' ||
                        item.type === 'title') &&
                      item.isActive
                    "
                    :style="{
                      right: 0,
                      top: 0,
                    }"
                    class="el-icon-error configDelet"
                    @click.stop="configDelet(index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模板母版图片上传对话框 -->
    <upload-picture-dialog
      v-if="UploadPPTMasterDialogVisable"
      @close="UploadPPTMasterDialogVisable = false"
      @success="UploadPPTMaster"
    />

    <!-- 母版上添加图片的对话框 -->
    <upload-picture-dialog
      v-if="UploadPPTConfigDialogVisable"
      @close="UploadPPTConfigDialogVisable = false"
      @success="UploadPPTConfig"
    />
  </div>
</template>

<script>
import draggable from "vuedraggable";
import UploadPictureDialog from "@/components/UploadPictureDialog";

export default {
  // 注册组件
  components: {
    draggable,
    UploadPictureDialog,
  },
  data() {
    return {
      // 模板id
      templateId: null,
      // 模板数据
      imageList: [],

      // 母版图片真实宽高
      slideWidth: 0,
      slideHeight: 0,
      // 母版预览列表的图片缩放比例
      masterProportion: 1,

      // PPT模板母版图片上传对话框控制变量
      UploadPPTMasterDialogVisable: false,
      // 选中的母版图片数据
      activeMaster: {},
      // 选中的母版图片索引
      activeMasterIndex: "",
      // 展示添加的元素的div
      scaleDiv: "",

      //  展示区域的宽高
      winWidth: 0,
      winHeight: 0,
      // 修改后图片的宽高
      imgWidth: 0,
      imgHeight: 0,

      // 母版大图展示的缩放比例
      configProportion: 0,

      // 编辑表单数据
      form: {
        type: "",
        content: "",
        marginLeft: "",
        marginTop: "",
        fontWeight: "",
        font: "",
        size: "",
        color: "",
        width: "",
        height: "",
        isActive: false,
      },

      // 在母版上添加图片的对话框控制变量
      UploadPPTConfigDialogVisable: false,
      // 保存loading
      saveLoading: false,
    };
  },
  computed: {
    // 母版列表缩放比例
    masterScaleFun: function () {
      const masterScale = this.masterProportion;
      return `transform:scale(${masterScale},${masterScale})`;
    },
    // 设置缩放比例
    configScaleFun: function () {
      const configScale = this.configProportion;
      return `transform:scale(${configScale},${configScale})`;
    },
  },
  created() {},
  mounted() {
    window.addEventListener("resize", this.$_imgResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.$_imgResize);
  },
  methods: {
    // 添加模板图片
    addMasterImage() {
      this.UploadPPTMasterDialogVisable = true;
    },

    //  添加模板图片对话框确认事件
    UploadPPTMaster(file) {
      // 图片上传的限制 保证母版图片大小一致
      if (this.imageList.length >= 1) {
        const newImage = new Image();
        newImage.src = file.viewUrl;
        newImage.onload = () => {
          const newImgW = newImage.width; // 上传的图片宽
          const newImgH = newImage.height; // 上传的图片高
          if (
            newImgW === parseFloat(this.slideWidth) &&
            newImgH === parseFloat(this.slideHeight)
          ) {
            this.imageList.push({
              url: file.viewUrl,
              fileUuid: file.uuid,
              templateParam: [],
            });
          } else {
            this.$message({
              showClose: true,
              message: "添加失败,图片尺寸不正确！",
              type: "error",
            });
          }
        };
      } else {
        this.imageList.push({
          url: file.viewUrl,
          fileUuid: file.uuid,
          templateParam: [],
        });

        const image = new Image();
        image.src = this.imageList[0].url;
        image.onload = () => {
          this.slideWidth = image.width; // 图片自身宽
          this.slideHeight = image.height; // 图片自身高
          this.masterProportion = 254 / this.slideWidth;
        };
      }
    },

    // 模板点击事件 选中图片索引，选中图片的详细信息
    activeImage(index, row) {
      this.activeMasterIndex = index;
      this.activeMaster = row;
      this.scaleDiv = this.imageList[index].templateParam;

      this.clear();
      // 等待dom加载完成(图片url替换完成后)后再去初始化图片的大小
      this.$nextTick(() => {
        this.$_imgResize();
      });
    },

    // 回车 复制事件
    enterCopy(index) {
      console.log(index, this.activeMasterIndex, "1203");
      this.$confirm("是否确认复制该页母版？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认复制",
        cancelButtonText: "取消",
      })
        .then(() => {
          let copy = {};
          copy = JSON.parse(
            JSON.stringify(this.imageList[this.activeMasterIndex])
          );
          console.log(copy);
          this.imageList.splice(this.activeMasterIndex + 1, 0, copy);
        })
        .catch((action) => {
          console.log("取消复制");
        });
    },

    // 模板母版删除事件
    closeMaster() {
      this.$confirm("是否确认删除该页母版？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
      })
        .then(() => {
          if (this.imageList.length === 1) {
            this.slideWidth = "";
            this.slideHeight = "";
          }
          this.imageList.splice(this.activeMasterIndex, 1);
          this.activeMaster = {};
          this.activeMasterIndex = "";
          this.scaleDiv = {};
        })
        .catch((action) => {
          console.log("取消删除");
        });
    },

    // 根据屏幕宽度，设置show高度的方法
    $_imgResize() {
      if (this.$refs.imgContent && this.$refs.imgContent.src) {
        this.winWidth = this.$refs.show.clientWidth;
        this.winHeight = this.$refs.show.clientHeight;

        const slideWidth = this.slideWidth; // 图片自身宽
        const slideHeight = this.slideHeight; // 图片自身高
        if (slideWidth < this.winWidth && slideHeight < this.winHeight) {
          this.imgWidth = slideWidth;
          this.imgHeight = slideHeight;
          this.configProportion = 1;
        } else {
          // 图片的宽高比例大于展示区域最大宽高比时，以展示区域的最大宽度为图片的宽度
          if (this.winWidth / this.winHeight <= slideWidth / slideHeight) {
            this.imgHeight = this.winWidth / (slideWidth / slideHeight);
            this.imgWidth = this.winWidth;
          } else {
            this.imgWidth = this.winHeight * (slideWidth / slideHeight);
            this.imgHeight = this.winHeight;
          }
          this.configProportion = this.imgHeight / slideHeight;
        }
        // };
      }
    },

    // 添加标题
    addTitle() {
      this.imageList[this.activeMasterIndex].templateParam.push({
        type: "title",
        content: "我是标题",
        marginLeft: "0",
        marginTop: "0",
        font: "宋体",
        size: 40,
        width: "600",
        height: "200",
        color: "#000000",
        isActive: false,
      });
    },
    // 添加正文
    addText() {
      this.imageList[this.activeMasterIndex].templateParam.push({
        type: "text",
        content: "我是正文",
        marginLeft: "0",
        marginTop: "0",
        font: "宋体",
        width: "600",
        height: "200",
        size: 30,
        color: "#000000",
        isActive: false,
      });
    },

    // 添加图片
    addImage() {
      this.UploadPPTConfigDialogVisable = true;
    },

    // 在母版上添加图片对话框确认事件
    UploadPPTConfig(file) {
      this.imageList[this.activeMasterIndex].templateParam.push({
        type: "image",
        id: file.uuid,
        marginLeft: "0",
        marginTop: "0",
        subImage: file.viewUrl,
        width: "200",
        height: "200",
        isActive: false,
      });
    },

    // 保存预览
    submit() {
      // this.saveLoading = true;
      if (this.slideHeight && this.slideWidth) {
        this.imageList[0].slideHeight = this.slideHeight;
        this.imageList[0].slideWidth = this.slideWidth;
      }

      console.log("所有ppt的数据", this.imageList);

      localStorage.setItem("template", JSON.stringify(this.imageList));
      this.$confirm("保存模板成功,是否预览？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "轮播图预览",
        cancelButtonText: "取消",
      })
        .then(() => {
          console.log("轮播图预览");
          this.$router.push({
            path: "/preview",
          });
        })
        .catch((action) => {
          console.log("取消");
        });
    },

    // 元素拖动事件
    move(e, index) {
      const element = e.currentTarget;
      //   阻止默认的图片拖拽事件
      e.preventDefault();
      // 算出鼠标相对元素的位置
      const disX = e.clientX - element.offsetLeft * this.configProportion;
      const disY = e.clientY - element.offsetTop * this.configProportion;

      document.onmousemove = (e) => {
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        // 移动当前元素

        this.imageList[this.activeMasterIndex].templateParam[
          index
        ].marginLeft = parseInt(left / this.configProportion);
        this.imageList[this.activeMasterIndex].templateParam[
          index
        ].marginTop = parseInt(top / this.configProportion);
      };
      document.onmouseup = (e) => {
        // 鼠标弹起来的时候不再移动
        document.onmousemove = null;
        // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
        document.onmouseup = null;
      };
    },

    // 双击事件
    dbl(e, index) {
      this.imageList[this.activeMasterIndex].templateParam.forEach((item) => {
        item.isActive = false;
      });
      this.imageList[this.activeMasterIndex].templateParam[
        index
      ].isActive = true;

      this.form = this.imageList[this.activeMasterIndex].templateParam[index];

      this.$forceUpdate();
    },

    // 清除选中效果
    clear() {
      this.imageList.forEach((item) => {
        if (item.templateParam) {
          item.templateParam.forEach((ele) => {
            ele.isActive = false;
          });
        }
      });

      this.form = {};

      this.$forceUpdate();
    },

    // 选项删除
    configDelet(index) {
      this.$confirm("是否确认删除此内容？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.imageList[this.activeMasterIndex].templateParam.splice(index, 1);
        })
        .catch((action) => {
          console.log("取消删除");
        });
    },
  },
};
</script>

<style lang="scss" >
.templateEdit {
  position: relative;
  width: 100%;
  height: 100%;
  .config {
    height: 90px;
    width: 100%;
    background-color: #f3f3f3;
    .configMenu {
      float: left;
      width: 70%;
      border: 1px solid transparent;
      overflow: hidden;
      display: flex;
      .configMenuItem {
        display: inline-block;
        padding: 10px 5px;
        .lableTips {
          width: 100%;
          padding: 0 0 10px 5px;
          font-size: 14px;
          font-family: 幼圆;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .addMenu {
      float: right;
      display: flex;
      width: 30%;
      height: 90px;
      justify-content: space-around;
      padding: 30px 0;
      overflow: hidden;
      .addMenuButton {
        padding: 2px 12px;
        background-image: linear-gradient(to left, #589ffa, #60beff);
        border: none;
      }
      .submit {
        background-image: linear-gradient(to left, #3acf3a, #82ea88);
      }
    }
  }
  .play {
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
    .playList {
      position: relative;
      width: 100%;
      height: 100%;
      .master {
        width: 280px;
        height: 100%;
        background-color: #ffffff;
        overflow: hidden;
        .el-scrollbar__wrap {
          overflow-x: hidden;
          /*被拖拽对象的样式*/
          .masterItem {
            position: relative;
            padding: 5px 10px;
            border: solid 3px #eee;
            margin-bottom: 10px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            .close {
              color: crimson;
              z-index: 999;
              font-size: 30px;
              position: absolute;
              right: 0;
              top: 0;
            }
            .copyButton {
              color: #82ea88;
              z-index: 999;
              font-size: 30px;
              position: absolute;
              left: 0;
              top: 0;
            }
            .masterImage {
              width: 254px;
              height: auto;
            }
            .masterImageConfig {
              position: absolute;
              left: 10px;
              top: 5px;
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
                  white-space: nowrap;
                  word-break: break-all;
                  overflow: hidden;
                }
              }
            }
          }
          /*拖动选中样式*/
          .chosen {
            border: solid 3px #23a9f2;
          }
          // 点击选中样式
          .activeClass {
            background-color: #888;
          }

          .masterAdd {
            margin: 5px 10px;
            display: block;
            border: 1px dashed #d9d9d9;
            padding-top: 40px;
            border-radius: 6px;
            cursor: pointer;
            width: 254px;
            height: 150px;
            text-align: center;
            background-color: #fff;
            .upload_icon {
              font-size: 40px;
              color: #8c939d;
              margin-bottom: 10px;
            }
            .upload_tips {
              font-size: 14px;
              color: #8c939d;
            }
          }
          .masterAdd:hover {
            border-color: #409eff;
          }
        }
      }
      // 图片展示区域
      .show {
        position: absolute;
        top: 0;
        left: 280px;
        right: 0;
        bottom: 0;
        background-color: #e6e6e6;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        .showImage {
          position: relative;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
          .showImageConfig {
            position: absolute;
            top: 0;
            left: 0;
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
                overflow: hidden;
                border: 2px transparent solid;
                word-break: break-all;

                .configDelet {
                  position: absolute;
                  font-size: 24px;
                  color: crimson !important;
                }
              }
              .configActive {
                border: 2px dashed;
              }
            }
          }
        }
      }
    }
  }
}
</style>
