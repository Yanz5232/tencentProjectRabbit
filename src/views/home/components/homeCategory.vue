<template>
  <div class="home-category" @mouseleave="catetoryId=null">
    <!-- 左侧列表 -->
    <ul class="menu">
      <li
        v-for="item in list"
        :key="item.id"
        @mouseenter="catetoryId = item.id"
        :class="{active:item.id==catetoryId}"
      >
        <router-link :to="`/category/${item.id}`">{{ item.name }}</router-link>
        <!-- 有值的时候在渲染 -->
        <template v-if="item.children">
          <router-link v-for="item2 in item.children" :key="item2.id" to="/">{{
            item2.name
          }}</router-link>
        </template>
        <!-- 没有值的时候渲染骨架 -->
        <template v-else>
            <XtxSkeleton width='60px' height='18px' bg="rgba(255,255,255,0.2)" style="margin-right:10px"></XtxSkeleton>
            <XtxSkeleton width='60px' height='18px' bg="rgba(255,255,255,0.2)"></XtxSkeleton>
        </template>
      </li>
    </ul>
    <!-- 弹层 -->
    <div class="layer">
      <h4>{{categoryGoods && categoryGoods.goods?'分类':'品牌'}}推荐 <small>根据您的购买或浏览记录推荐</small></h4>
      <!-- 分类推荐 -->
      <ul v-if="categoryGoods && categoryGoods.goods">
        <li v-for="item in categoryGoods.goods" :key="item.id">
          <RouterLink to="/">
            <img v-lazy="item.picture" alt="" />
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.desc }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <!-- 品牌推荐 -->
      <ul v-if="categoryGoods && categoryGoods.brands">
        <li class="brand" v-for="brand in categoryGoods.brands" :key="brand.id">
          <router-link to="/">
            <img v-lazy="brand.picture" alt="" />
            <div class="info">
              <p class="place">{{brand.place}}</p>
              <p class="name ellipsis">{{brand.name}}</p>
              <p class="desc ellipsis-2">{{brand.desc}}</p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { useStore } from "vuex";
import { findBrand } from "@/api/home.js";
export default {
  setup() {
    const store = useStore();
    //获取左侧分类导航 逻辑
    const brand = reactive({
      id: "brand",
      name: "品牌",
      children: [{ id: "brand-children", name: "品牌推荐" }],
    });
    const list = computed(() => {
      //把vuex里的数据加工一下
      const categoryList = store.state.category.list.map((item) => {
        return {
          id: item.id,
          name: item.name,
          //防止页面刚开始没用children属性导致赋值报错
          children: item.children && item.children.slice(0, 2),
          goods: item.goods,
        };
      });
      categoryList.push(brand);
      return categoryList;
    });
    //弹层数据 逻辑
    const catetoryId = ref(0);
    const categoryGoods = computed(() => {
      return list.value.find((item) => item.id == catetoryId.value);
    });
    //获取品牌goods逻辑
    findBrand().then((res) => {
      brand.brands = res.result;
    });
    return {
      list,
      catetoryId,
      categoryGoods,
    };
  },
  
};
</script>

<style lang="less" scoped>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,&.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
  /* 弹层样式 */
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;

        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover{
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      /* 品牌推荐样式 */
      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
.xtx-skeleton{
  animation: fade 1s linear infinite alternate;
}
@keyframes fade{
  from{
    opacity: 0.2;
  }
  to{
    opacity: 1;
  }
}
</style>