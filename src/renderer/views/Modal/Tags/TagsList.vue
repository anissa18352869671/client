<template lang="">
    <div>
      
        <div class="tagsDiv">
          <div
            class="list"
            v-for="(item,index) in reorderList"
            :class="[item.letter?activeClass:'',item.value?value:'',item.checked==1?checked:'']"

          >
            <div v-if="item.letter">
              {{item.letter}}
            </div>
            <span v-if="item.value" @click="change(index)"><i class="el-icon-check"></i>{{item.value}} </span>
          </div>
        </div>
  
    </div>
</template>
<script>
import { searchSn, getToken, getNowToken } from "~/api/login/loginDao";
import { addLabel, deleteLabel, getUserList } from "~/api/label/label";
import { insertUserLabel } from "~/api/label/labelDao";
export default {
  name: "TagsList",
  props: {
    tags: {
      type: Array,
      default: false
    },
    isSearch: {
      type: Boolean
    }
  },
  data() {
    return {
      reorderList: [],
      activeClass: "letter",
      value: "value",
      checked: "checked",
    };
  },
  methods: {
    sort(data) {
      var newTags = [];
      var tagsALL = data;

      function paixu() {
        //中文
        var tagsALL1 = [];
        //英文
        var tagsALL2 = [];
        //其他字符
        var tagsALL3 = [];

        //将中英转换成中文数组英文数组
        function spliceTwoList(arr, arr1, arr2, arr3) {
          for (var i = 0; i < arr.length; i++) {
            if (/[\u4e00-\u9fff]/.test(arr[i].value.slice(0, 1))) {
              arr1.push({
                value: arr[i].value,
                checked: arr[i].checked,
                label_no: arr[i].label_no
              });
            } else if (/[a-zA-Z]/.test(arr[i].value.slice(0, 1))) {
              arr2.push({
                value: arr[i].value,
                checked: arr[i].checked,
                label_no: arr[i].label_no
              });
            } else {
              arr3.push({
                value: arr[i].value,
                checked: arr[i].checked,
                label_no: arr[i].label_no,
                letter: "#"
              });
            }
          }
        }

        spliceTwoList(tagsALL, tagsALL1, tagsALL2, tagsALL3);

        var newList = [];

        var newList2 = [];

        /* 获取数组元素比较的值 */
        function getValue(option) {
          return option.value;
        }

        //中文首字母排序
        function chineseLetter(arr) {
          var letter = "abcdefghjklmnopqrstwxyz".split("");

          var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split("");

          /* 进行排序 */
          arr.sort(function(item1, item2) {
            return getValue(item1).localeCompare(getValue(item2), "zh-Hans-CN");
          });

          /* 判断需要排序的字符串是否含有中文字符 */
          if (/[\u4e00-\u9fff]/.test(arr[0].value)) pySegSort(0, 0);

          var newLetter;

          /* 给省列表中添加首字符 */
          function pySegSort(letterIndex, zhIndex) {
            var first = true; // 首次是否加 字母标识
            for (var i = zhIndex; i < arr.length; i++) {
              var item = arr[i].value;
              //      是否有值 && 当前值大于等于本次字母的最小值 && (最后一位 || 当前值小于下次字母的最小值)
              var state =
                zh[letterIndex] &&
                item.localeCompare(zh[letterIndex], "zh") >= 0 &&
                (letterIndex === letter.length - 1 ||
                  item.localeCompare(zh[letterIndex + 1], "zh") < 0);
              if (state) {
                // 满足条件，同一个首字母下的：例如 A 下的所有省份
                newLetter = letter[letterIndex].toUpperCase();
                first = false;
                newList[i] = {
                  value: arr[i].value,
                  checked: arr[i].checked,
                  letter: newLetter,
                  label_no: arr[i].label_no
                };
              } else {
                // 递归调用 函数，进行下次字母下的排列
                letterIndex++;
                if (letterIndex < letter.length) {
                  pySegSort(letterIndex, i);
                  break;
                }
              }
            }
          }
        }

        //英文首字母排序
        function englishLetter(arr) {
          var newLetter;
          arr.sort(function(a, b) {
            return getValue(a).localeCompare(getValue(b));
          });
          pySegSort(0, 0);
          /* 给省列表中添加首字符 */
          function pySegSort(letterIndex, zhIndex) {
            var first = true; // 首次是否加 字母标识
            for (var i = zhIndex; i < arr.length; i++) {
              var item = arr[i].value;
              newLetter = item.substr(0, 1).toUpperCase();
              newList2[i] = {
                value: item,
                letter: newLetter,
                checked: arr[i].checked,
                label_no: arr[i].label_no
              };
            }
          }
        }

        //将中英文联合排序
        function getList(tags, arr) {
          var letter = "abcdefghjklmnopqrstuvwxyz".split("");
          for (var i = 0; i < letter.length; i++) {
            var first = true; // 首次是否加 字母标识
            for (var j = 0; j < tags.length; j++) {
              if (letter[i].toUpperCase() == tags[j].letter) {
                if (first) {
                  first = false;
                  newTags.push({
                    letter: letter[i]
                  });
                }
                newTags.push({
                  value: tags[j].value,
                  checked: tags[j].checked,
                  label_no: tags[j].label_no
                });
              }
            }
          }

          var first = true; // 首次是否加 字母标识
          for (var j = 0; j < tags.length; j++) {
            if (tags[j].letter == "#") {
              if (first) {
                first = false;
                newTags.push({
                  letter: tags[j].letter
                });
              }
              newTags.push({
                value: tags[j].value,
                checked: tags[j].checked
              });
            }
          }
        }
        if (tagsALL1.length > 0) {
          chineseLetter(tagsALL1);
        }
        if (tagsALL2.length > 0) {
          englishLetter(tagsALL2);
        }
        // chineseLetter(tagsALL1);
        // englishLetter(tagsALL2);

        var listAll = newList.concat(newList2);
        listAll = listAll.concat(tagsALL3);

        getList(listAll, newTags);
      }

      paixu();

      this.reorderList = newTags;
    },
    change(index) {
      let value = "";
      let _index = "";
      let newIndex = index;
      let _new = {};
      if (this.reorderList[index].checked == "1") {
        value = "0";
        this.delete(index);
        //删除标签
      } else {
        value = "1";
        this.add(index);
      }
      for (let i = 0; i < this.tags.length; i++) {
        if (this.reorderList[index].value == this.tags[i].value) {
          this.tags[i].checked = value;
          _index = i;
          _new = this.tags[i];
        }
      }

      this.reorderList[index].checked = value;

      if (this.isSearch) {
        this.$emit("changeLabel", _new);
      }
    },
    delete(index) {
      let _this = this;
      getNowToken().then(function(token) {
        //删除当前选中的label
        deleteLabel(_this.reorderList[index].label_no, {
          Authorization: "Bearer " + token
        })
        // 没有联网就不再尝试了
        // .then(function(result) {
        //   if (result.data.code != 200) {
        //       _this.delete(index);
        //   }
        // });
      });
      insertUserLabel(_this.reorderList[index].label_no, 0);
    },
    add(index) {
      let _this = this;
      getNowToken().then(function(token) {
        //删除当前选中的label
        addLabel(_this.reorderList[index].label_no, {
          Authorization: "Bearer " + token
        })
        // .then(function(result) {
        //   if (result.data.code != 200) {
        //       _this.add(index);
        //   }
        // });
      });
      insertUserLabel(_this.reorderList[index].label_no, 1);
    }
  },
  mounted() {
    if (this.tags.length > 0) {
      this.sort(this.tags);
    }
  },
  watch: {
    tags: {
      handler(newValue, oldValue) {
        this.sort(this.tags);
        //父组件param对象改变会触发此函数
      },
      deep: true
    }
  }
};
</script>