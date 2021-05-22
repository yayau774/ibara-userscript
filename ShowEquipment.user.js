// ==UserScript==
// @name          Ibaracity - 戦闘設定に装備を表示するボタンをつけるやつ
// @namespace     http://tampermonkey.net/
// @version       0.2
// @description   やつ。
// @author        Yayau
// @match         http://lisge.com/ib/act_battle.php
// @updateURL     https://github.com/yayau774/ibara-userscript/raw/main/ShowEquipment.user.js
// @downloadURL  	https://github.com/yayau774/ibara-userscript/raw/main/ShowEquipment.user.js
// @grant         none
// ==/UserScript==


//  装備分類とか色設定（ゆふ氏にそろえる）とか
const CATEGORY = {
  title  : ["種類"],
  weapon : ["武器", "大砲", "呪器", "魔弾", "戦盾", "暗器", "宝珠", "肉球", "神器", "毒牙"],
  armor  : ["防具", "法衣", "重鎧", "衣装", "隔壁", "聖衣", "火衣", "水衣", "風衣", "地衣", "魔衣"],
  jewel  : ["装飾", "魔晶", "護符", "御守", "薬箱", "楽器", "光飾", "闇飾", "魔鏡"]
};
const CATEGORY_COLOR = {
  weapon : "deeppink",
  armor  : "cyan",
  jewel  : "yellowgreen"
}

//  自己結果url
const urlSelf = document.querySelector("a.F2").href;
let equipmentTable = null;

//  ボタン作製
const btn = document.createElement("button");
btn.type = "button";
btn.textContent = "結果ページから装備一覧を引っ張ってくるボタン";

//  ボタンの設置とクリックイベントの追加
document.querySelectorAll("table.BLK dl").forEach(v=>{
  v.parentNode.appendChild(btn.cloneNode(true))
  .addEventListener('click', function(e){
    if( !equipmentTable ){
      fetch(urlSelf)
      .then(response => response.text())
      .then(data =>{
        const parser = new DOMParser();
        const result = parser.parseFromString(data, "text/html");
        equipmentTable = createEquipmentTable(result);
        this.parentNode.appendChild(equipmentTable.cloneNode(true));
        this.parentNode.removeChild(this);
      });
    }else{
      this.parentNode.appendChild(equipmentTable.cloneNode(true));
      this.parentNode.removeChild(this);
    }
  });
});

function createEquipmentTable(result){

  //  かてごり確認　武器とか防具とかの大種別
  function checkCategory(cate){
    for (const key in CATEGORY) {
      if(CATEGORY[key].includes(cate)){
        return key;
      }
    }
    return false;
  }

  //  事前準備
  const equipmentItems = {
    title  : [],
    weapon : [],
    armor  : [],
    jewel  : []
  };

  const itemTab = result.querySelector("img[src$='t_item.png']").parentNode;
  const itemTr = itemTab.querySelectorAll("table tr");

  //  アイテムリストから見出しと装備とめしをtr要素単位でusableItemsにコピーしていく
  itemTr.forEach(function(v){
    const cate = checkCategory(v.querySelector("td:nth-of-type(3)").textContent);
    if(cate){
      v.style.color = CATEGORY_COLOR[cate];
      equipmentItems[cate].push(v.cloneNode(true));
    }
  });

  //  equipmentTableという名のtable要素を作成し、そこにusableItemsを詰めていく
  const equipmentTable = document.createElement("table");
  equipmentTable.style.padding = 2;

  for (const key in equipmentItems) {
    equipmentItems[key].forEach(function(item){
      equipmentTable.appendChild(item);
    });
  }

  return equipmentTable;
}


