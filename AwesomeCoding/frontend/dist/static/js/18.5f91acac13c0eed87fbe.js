webpackJsonp([18],{Kstj:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("BO1k"),i=n.n(a),l=n("mvHQ"),o=n.n(l),s=n("kvL4"),r=n("3IC3"),d={name:"DataVisualizer",data:function(){return{table_name:"",heads:[],table_data:[],input:{table_name:"users",items:{}},edit_dialog:{visual:!1,row:{}},loadingQ:!1,loadedQ:!1}},methods:{showUnknownError:function(t){var e;e="操作失败。"+o()(t.details),this.$message.error(e)},handleLoad:function(){var t=this;this.loadingQ=!0,this.table_name=this.input.table_name,this.heads=[],this.input.items={},Object(r.getSQLColumns)(this,this.table_name).then(function(e){var n,a=!0,l=!1,o=void 0;try{for(var s,d=i()(e.results);!(a=(s=d.next()).done);a=!0)n=s.value,t.heads.push(n.COLUMN_NAME),t.input.items[n.COLUMN_NAME]=""}catch(t){l=!0,o=t}finally{try{!a&&d.return&&d.return()}finally{if(l)throw o}}return Object(r.showSQL)(t,t.table_name)}).then(function(e){t.table_data=e.results,t.loadingQ=!1,t.loadedQ=!0}).catch(function(e){t.loadingQ=!1,t.loadedQ=!1,t.showUnknownError(e)})},handleAdd:function(){var t=this;this.loadingQ=!0,Object(r.insertSQL)(this,this.table_name,this.input.items).then(function(e){return Object(r.showSQL)(t,t.table_name)}).then(function(e){t.table_data=e.results,t.loadingQ=!1}).catch(function(e){t.loadingQ=!1,t.showUnknownError(e)})},handleDelete:function(t){var e=this;this.loadingQ=!0,Object(r.deleteSQL)(this,this.table_name,t).then(function(t){return Object(r.showSQL)(e,e.table_name)}).then(function(t){e.table_data=t.results,e.loadingQ=!1}).catch(function(t){e.loadingQ=!1,e.showUnknownError(t)})},handleEdit:function(t){this.edit_dialog.row=Object(s.copy)(t),this.edit_dialog.visual=!0},handleChange:function(){var t=this;this.loadingQ=!0,this.edit_dialog.visual=!1,Object(r.updateSQL)(this,this.table_name,this.edit_dialog.row).then(function(e){return Object(r.showSQL)(t,t.table_name)}).then(function(e){t.table_data=e.results,t.loadingQ=!1}).catch(function(e){t.loadingQ=!1,t.showUnknownError(e)})}}},c={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("el-container",[n("el-header",[n("h2",[t._v("数据库查看器")])]),t._v(" "),n("el-container",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingQ,expression:"loadingQ"}],attrs:{id:"DataVisualizer"}},[n("el-header",{staticClass:"sticky-top"},[n("div",{staticStyle:{width:"50%",margin:"auto"},attrs:{id:"load-table"},on:{keydown:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?t.handleLoad(e):null}}},[n("el-input",{attrs:{"prefix-icon":"el-icon-search",placeholder:"输入数据库名称..."},model:{value:t.input.table_name,callback:function(e){t.$set(t.input,"table_name",e)},expression:"input.table_name"}},[n("el-button",{attrs:{slot:"append",icon:"el-icon-refresh"},on:{click:t.handleLoad},slot:"append"},[t._v("载入数据")])],1)],1)]),t._v(" "),n("el-collapse-transition",[t.loadedQ?n("div",{attrs:{id:"visualizer"}},[n("el-table",{staticStyle:{width:"100%",margin:"auto",padding:"5px"},attrs:{id:"display-table",data:t.table_data,"highlight-current-row":"",stripe:""}},[t._l(t.heads,function(t,e){return n("el-table-column",{key:e,attrs:{label:t,align:"center",prop:t}})}),t._v(" "),n("el-table-column",{attrs:{align:"center",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{attrs:{type:"warning",icon:"el-icon-edit",circle:""},on:{click:function(n){t.handleEdit(e.row)}}}),t._v(" "),n("el-button",{attrs:{type:"danger",icon:"el-icon-delete",circle:""},on:{click:function(n){t.handleDelete(e.row.id)}}})]}}])})],2),t._v(" "),n("div",{staticClass:"sticky-bottom",staticStyle:{width:"100%",margin:"auto"},attrs:{id:"inputs-add"},on:{keydown:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?t.handleAdd(e):null}}},[n("el-row",[n("el-col",{attrs:{span:2}},[n("label",[t._v("添加数据：")])]),t._v(" "),t._l(t.heads,function(e,a){return n("el-col",{key:a,attrs:{span:2}},[n("el-input",{staticStyle:{width:"98%"},attrs:{type:"text",size:"mini",placeholder:e},model:{value:t.input.items[e],callback:function(n){t.$set(t.input.items,e,n)},expression:"input.items[col]"}})],1)}),t._v(" "),n("el-col",{attrs:{span:2}},[n("el-button",{attrs:{size:"mini"},on:{click:t.handleAdd}},[t._v("添加")])],1)],2)],1),t._v(" "),n("el-dialog",{attrs:{id:"dialog-edit",title:"修改行",visible:t.edit_dialog.visual,width:"30%"},on:{"update:visible":function(e){t.$set(t.edit_dialog,"visual",e)}}},[n("div",{attrs:{id:"change-inputs"},on:{keydown:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?t.handleChange(e):null}}},t._l(t.heads,function(e,a){return n("el-input",{key:a,staticStyle:{width:"98%","margin-bottom":"10px"},attrs:{type:"text",size:"mini",placeholder:e},model:{value:t.edit_dialog.row[e],callback:function(n){t.$set(t.edit_dialog.row,e,n)},expression:"edit_dialog.row[col]"}})})),t._v(" "),n("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:function(e){t.edit_dialog.visual=!1}}},[t._v("取 消")]),t._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:t.handleChange}},[t._v("确 认")])],1)])],1):t._e()])],1)],1)},staticRenderFns:[]};var u=n("VU/8")(d,c,!1,function(t){n("sF7B")},"data-v-5d0789ea",null);e.default=u.exports},sF7B:function(t,e){}});
//# sourceMappingURL=18.5f91acac13c0eed87fbe.js.map