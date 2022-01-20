<template>
  <div class="goods-sku">
    <dl v-for="item in specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="changeSku(item.id, val.name, val.disabled)"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
          />
          <span
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="changeSku(item.id, val.name, val.disabled)"
            v-else
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from "@/vender/power-set.js";
//得到一个字典对象
const getPathMap = (skus) => {
  //1.的到所有的sku集合 props.goods.skus
  //2.从所有的sku中筛选出有效的sku
  //3.根据有效的sku使用power-set算法得到子集
  //4.根据子集往字典对象中存储key-value
  const pathMap = {};
  skus.forEach((item) => {
    if (item.inventory > 0) {
      //计算有库存的子集
      //例如 [1,2]===>[[1],[2],[1,2]]
      //可选值数组
      const valueArr = item.specs.map((val) => val.valueName);
      //可选值子集
      const valueArrPowerSet = powerSet(valueArr);
      //遍历子集往 pathMap里面插数据
      valueArrPowerSet.forEach((arr) => {
        //['蓝色','美国']===>'蓝色·美国'
        const key = arr.join("·");
        //给pathMap添加数据
        if (pathMap[key]) {
          pathMap[key].push(item.id);
        } else {
          pathMap[key] = [item.id];
        }
      });
    }
  });
  return pathMap;
};
const updateDisabledStatusItem = (specs) => {
  const arr = [];
  specs.forEach((item) => {
    //拿到我选中的按钮对象
    const seletedVal = item.values.find((val) => val.selected);
    arr.push(seletedVal ? seletedVal.name : undefined);
  });
  return arr;
};
//更新按钮禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((item, index) => {
    const values = updateDisabledStatusItem(specs);
    item.values.forEach((item2) => {
      //1.判断当前是否选中 是选中不用判断
      if (item2.selected) return;
      //2.拿到当前的值安装顺序逃入选中的值数组
      values[index] = item2.name;
      //3.消除undefined数据 拼接成key
      const key = values.filter((value) => value).join("·");
      //4.拿着key判断字典中是否有这个数据 true 禁用 false 可用
      item2.disabled = !pathMap[key];
    });
  });
};
//默认选中的方法
const defaultSelected = (skus, skuId, specs) => {
  const sku = skus.find((item) => (item.id = skuId));
  specs.forEach((item) => {
    item.values.forEach((item2) => {
      sku.specs.forEach((item3) => {
        if(item2.selected) return
         item2.name==item3.valueName?item2.selected=true:item2.selected=false
      });
    });
  });
};
export default {
  name: "GoodsSku",
  props: {
    specs: {
      type: Array,
    },
    skus: {
      type: Array,
    },
    skuId: {
      type: String,
    },
  },
  setup(props,{emit}) {
    const pathMap = getPathMap(props.skus);
    //★组件初始化更新按钮状态
    updateDisabledStatus(props.specs, pathMap);
    const changeSku = (id, name, disabled) => {
      if (disabled) return;
      let sku = props.specs.find((item) => item.id == id);
      sku.values.forEach((item) =>
        item.name == name ? (item.selected = true) : (item.selected = false)
      );
      //★点击时也要更新按钮状态
      updateDisabledStatus(props.specs, pathMap);
      //选择的信息通知父组件
      const selectedValues=updateDisabledStatusItem(props.specs).filter(item=>item)
      if(selectedValues.length==props.specs.length){
        const skuIds=pathMap[selectedValues.join('·')]
        const info=props.skus.find(item=>item.id==skuIds[0])
        emit('change',{
          skuId:info.id,
          price:info.price,
          oldPrice:info.oldPrice,
          inventory:info.inventory,
          specsText:info.specs.reduce((p,item)=>`${p} ${item.name}：${item.valueName}`,'')
        })
      }else{
        //选择不完整传递空对象
        emit('change',{})
      }
    };
    defaultSelected(props.skus, props.skuId, props.specs);
    return {
      changeSku,
    };
  },
};
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>