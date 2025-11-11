<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="110px"
    >
      <el-form-item label="发布者领头羊ID" prop="wtId">
        <el-input
          v-model="queryParams.wtId"
          placeholder="请输入用户领头羊ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布者昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="动态ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入动态ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="动态文案关键字" prop="friendsCircleKey">
        <el-input
          v-model="queryParams.friendsCircleKey"
          placeholder="请输入动态文案关键字"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="friendsCircleStatus">
        <el-select
          v-model="queryParams.friendsCircleStatus"
          placeholder="请选择状态"
          clearable
        >
          <el-option label="正常" :value="0" />
          <el-option label="隐藏" :value="1" />
          <el-option label="删除" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="动态类型" prop="friendsCircleType">
        <el-select
          v-model="queryParams.friendsCircleType"
          placeholder="请选择动态类型"
          clearable
        >
          <el-option label="文字" :value="1" />
          <el-option label="图文" :value="2" />
          <el-option label="视频" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="最小点赞数" prop="praiseMin">
        <el-input
          v-model="queryParams.praiseMin"
          placeholder="请输入最小点赞数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最大点赞数" prop="praiseMax">
        <el-input
          v-model="queryParams.praiseMax"
          placeholder="请输入最大点赞数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最小评论数" prop="commentsMin">
        <el-input
          v-model="queryParams.commentsMin"
          placeholder="请输入最小评论数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最大评论数" prop="commentsMax">
        <el-input
          v-model="queryParams.commentsMax"
          placeholder="请输入最大评论数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最小转发数" prop="forwardMin">
        <el-input
          v-model="queryParams.forwardMin"
          placeholder="请输入最小转发数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最大转发数" prop="forwardMax">
        <el-input
          v-model="queryParams.forwardMax"
          placeholder="请输入最大转发数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 220px"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <div v-loading="loading" :data="dataList">
      <el-card
        class="box-card"
        v-for="item in dataList"
        :key="item.id"
        body-style="display: flex"
      >
        <div class="box-card-preview">
          <div class="box-card-preview-basic">
            <el-image
              :src="baseUrl + item.avatar"
              fit="cover"
              class="box-card-preview-basic-avatar"
            ></el-image>
            <div class="box-card-preview-basic-right">
              <div class="box-card-preview-basic-right-name">
                {{ item.nickName }}
              </div>
              <div class="box-card-preview-basic-right-time">
                {{ item.createTime }}
              </div>
            </div>
          </div>
          <div class="box-card-preview-content">
            <div class="box-card-preview-content-text">
              {{ item.content }}
            </div>
            <div class="box-card-preview-content-images">
              <el-image
                v-for="imageSrc in item.images"
                :key="imageSrc"
                style="width: 100px; height: 100px; margin: 0 8px 6px 0"
                fit="cover"
                :src="imageSrc"
                :preview-src-list="item.images"
              />
            </div>
            <div v-if="item.video" class="box-card-preview-content-video">
              <el-image
                style="width: 200px; cursor: pointer"
                fit="cover"
                :src="item.coverImage"
                @click="openDialog(item)"
              />
              <i class="el-icon-video-play icon"></i>
            </div>
          </div>
        </div>
        <div class="box-card-info">
          <ul>
            <li>领头羊ID：{{ item.wtId }}</li>
            <li>动态ID：{{ item.id }}</li>
            <li>动态类型：{{ getMomentTypeText(item) }}</li>
            <li>权限：{{ getReleaseTypeText(item.releaseType) }}</li>
            <li>
              <span>{{ item.praiseNumber }}点赞</span>
              <span>{{ item.commentNumber }}评论</span>
              <span>{{ item.forwardNumber }}转发</span>
            </li>
            <li>处理人：{{ item.operatorBy || "--" }}</li>
            <li>处理时间：{{ item.operatorTime || "--" }}</li>
            <li v-if="item.friendsCircleStatus === 0">
              <el-button size="small" type="primary" @click="onHidden(item.id)"
                >隐藏动态</el-button
              >
              <el-button size="small" type="danger" @click="onDelete(item.id)"
                >删除动态</el-button
              >
            </li>
            <li v-if="item.friendsCircleStatus === 1">
              <el-button size="small" type="success" @click="onRecover(item.id)"
                >恢复动态</el-button
              >
            </li>
            <li v-if="item.friendsCircleStatus === 2">
              <el-tag type="danger">已删除</el-tag>
            </li>
          </ul>
        </div>
      </el-card>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog
      v-if="showDialog"
      title="视频预览"
      :visible.sync="showDialog"
      width="500px"
      :close-on-click-modal="true"
      append-to-body
      @close="onCloseDialog"
    >
      <div class="viedo-content">
        <video
          v-show="!videoLoadError"
          class="video"
          :src="currentVideoUrl"
          controls
          :poster="currentVideoPosterUrl"
          v-on:error.prevent="handleVideoError()"
        >
          您的浏览器不支持视频标签
        </video>
        <div v-show="videoLoadError">视频加载失败，请检查视频链接</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { listFriendsCircle, setFriendsCircle } from "@/api/app/friendsCircle";
import { getBaseUrl } from "@/utils/auth";
export default {
  name: "FriendsCircle",
  data() {
    return {
      baseUrl: getBaseUrl(),
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 单聊聊天记录列表数据
      dataList: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        wtId: undefined,
        nickName: undefined,
        id: undefined,
        friendsCircleKey: undefined,
        friendsCircleStatus: undefined,
        friendsCircleType: undefined,
        praiseMin: undefined,
        praiseMax: undefined,
        commentsMin: undefined,
        commentsMax: undefined,
        forwardMin: undefined,
        forwardMax: undefined,
      },
      showDialog: false,
      currentVideoUrl: "",
      currentVideoPosterUrl: "",
      videoLoadError: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (to.query.groupId && to.query.groupId !== vm.queryParams.txgroupId) {
        (vm.queryParams = {
          pageNum: 1,
          pageSize: 20,
          wtId: undefined,
          nickName: undefined,
          id: undefined,
          friendsCircleKey: undefined,
          friendsCircleStatus: undefined,
          friendsCircleType: undefined,
          praiseMin: undefined,
          praiseMax: undefined,
          commentsMin: undefined,
          commentsMax: undefined,
          forwardMin: undefined,
          forwardMax: undefined,
        }),
          vm.getList();
      }
    });
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询封禁管理列表 */
    getList() {
      this.loading = true;
      const queryParams = { ...this.queryParams };
      if (this.dateRange && this.dateRange.length !== 0) {
        (queryParams.startTime = this.dateRange[0]),
          (queryParams.endTime = this.dateRange[1]);
      }
      listFriendsCircle(queryParams)
        .then((response) => {
          this.dataList = response.rows.map((item) => {
            item.images = item.images ? item.images.split(",") : [];
            item.images = item.images.map((image) => {
              if (image.search(/^http/) === 0) {
                return image;
              }
              return this.baseUrl + image;
            });
            if (item.video) {
              if (item.video.search(/^http/) != 0) {
                item.video = this.baseUrl + item.video;
              }
              if (item.coverImage.search(/^http/) != 0) {
                item.coverImage = this.baseUrl + item.coverImage;
              }
            }
            console.log(item);
            return item;
          });
          this.total = response.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getReleaseTypeText(type) {
      let text;
      switch (type) {
        case 1:
          text = "公开";
          break;
        case 2:
          text = "私密";
          break;
        case 3:
          text = "部分好友可见";
          break;
        case 4:
          text = "部分好友不可见";
          break;
        default:
          break;
      }
      return text;
    },
    getMomentTypeText(moment) {
      if (moment.video) {
        return "视频";
      } else if (moment.images.length > 0 && moment.content) {
        return "图文";
      } else {
        return "文字";
      }
    },
    onDelete(id) {
      this.$confirm("确定删除此动态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        setFriendsCircle({ id, friendsCircleStatus: 2 }).then(() => {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
    },
    onHidden(id) {
      this.$confirm("确定隐藏此动态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        setFriendsCircle({ id, friendsCircleStatus: 1 }).then(() => {
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
      });
    },
    onRecover(id) {
      this.$confirm("确定恢复此动态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        setFriendsCircle({ id, friendsCircleStatus: 0 }).then(() => {
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
      });
    },
    openDialog(moment) {
      this.showDialog = true;
      this.currentVideoUrl = moment.video;
      this.currentVideoPosterUrl = moment.coverImage;
    },
    // 关闭弹窗
    onCloseDialog() {
      // 恢复默认值
      this.currentVideoUrl = "";
      this.currentVideoPosterUrl = "";
      this.videoLoadError = false;
    },
    handleVideoError() {
      this.videoLoadError = true;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/app/friendsCircle/export",
        {
          ...this.queryParams,
        },
        `friendsCircle_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
