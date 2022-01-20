<template>
  <div class="goods-comment">
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span
          ><span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            v-for="(item, i) in commentInfo.tags"
            :key="item.title"
            href="javascript:;"
            :class="{ active: currTagIndex === i }"
            @click="changeTag(i)"
          >
            {{ item.title }}（{{ item.tagCount }}）
          </a>
        </div>
      </div>
    </div>
    <!-- 排序 -->
    <div class="sort">
      <span>排序：</span>
      <a
        @click="changeSort(null)"
        href="javascript:;"
        :class="{ active: reqParams.sortField === null }"
        >默认</a
      >
      <a
        @click="changeSort('praiseCount')"
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'praiseCount' }"
        >最热</a
      >
      <a
        @click="changeSort('createTime')"
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'createTime' }"
        >最新</a
      >
    </div>
    <!-- 评价列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img
            :src="item.member.avatar"
            alt=""
          />
          <span>{{formatNickname(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i v-for="i in item.score" :key="i+'s'" class="iconfont icon-xingxing1"></i><!-- 实星 -->
            <i v-for="i in 5-item.score" :key="i+'k'" class="iconfont icon-xingxing"></i><!-- 空星 -->
            <span class="attr">{{formatSpecs(item.orderInfo.specs)}}</span>
          </div>
          <div class="text">
            {{item.content}}
          </div>
          <!-- 图片组件 -->
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures"></GoodsCommentImage>
          <div class="time">
            <span>{{item.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页组件 -->
    <XtxPagination v-if="total" @currentPage='currenPage' :total="total" :pageSize="reqParams.pageSize" :currentPage="reqParams.page"></XtxPagination>
  </div>
</template>
<script>
import { findGoodsCommentInfo,findGoodsCommentList } from "@/api/product.js";
import { inject, reactive, ref, watch } from "vue";
import GoodsCommentImage from'./goods-comment-image.vue'
export default {
  name: "GoodsComment",
  components:{
    GoodsCommentImage
  },
  setup() {
    /* 获取评价信息 */
    const commentInfo = ref(null);
    const goods = inject("goods");
    findGoodsCommentInfo(goods.value.id).then((data) => {
      data.result.tags.unshift({
        title: "有图",
        tegCount: data.result.hasPictureCount,
      });
      data.result.tags.unshift({
        title: "全部评价",
        tegCount: data.result.evaluateCount,
      });
      commentInfo.value = data.result;
    });
    //激活tag
    const currTagIndex = ref(0);
    const changeTag = (i) => {
      currTagIndex.value = i;
      // 设置有图和标签条件
      const Tag = commentInfo.value.tags[i]
      if (Tag.type === 'all') {
        reqParams.hasPicture = false
        reqParams.tag = null
      } else if (Tag.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = false
        reqParams.tag = Tag.title
      }
      //重置页码1
      reqParams.page=1
    };
    //请求体
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: false,
      tag: null,
      sortField: null,
    });
    //请求来的数据
    const commentList = ref([]);
    const total =ref(0)
    //页码一变调用函数重获得数据
    watch(reqParams,() => {
        findGoodsCommentList(goods.value.id,reqParams).then(data=>{
          commentList.value=data.result.items
          total.value=data.result.counts
        })
      },
      { immediate: true }
    );
    //改变排序
    const changeSort = (type) => {
      reqParams.sortField = type;
      //重置页码1
      reqParams.page=1
    };
    //定义转换数据的函数(对呀vue2 的过滤器)
    const formatSpecs=(specs)=>{
      return specs.reduce((p,c)=> `${p} ${c.name}：${c.nameValue}`,'')
    }
    const formatNickname=(nickname)=>{
      return nickname.substr(0,1)+'****'+nickname.substr(-1)
    }
    const currenPage=(newPage)=>{
       reqParams.page=newPage
    }
    return {
      commentInfo,
      reqParams,
      currTagIndex,
      changeTag,
      changeSort,
      commentList,
      formatSpecs,
      formatNickname,
      total,
      currenPage
    };
  },
};
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
    }
  }
}
</style>