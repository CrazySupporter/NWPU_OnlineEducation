webpackJsonp([24],{Sonn:function(e,t){},cngk:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("pCWl"),s=a("1EKI"),o=a("mVAe"),l=(a("vlrw").randomString,{data:function(){return{class_id:null,CourseData:{title:null,name:null,type:null},resources:[],loading:!0,avaliable_resources:i.avaliable_resources,dialogImageUrl:"",dialogVisible:!1}},mounted:function(){var e=this;this.class_id=this.$route.params.class_id,this.$http.post("/api/class/info/query",{class_id:this.class_id}).then(function(t){"NOT FOUND."===t.body.status?e.$message("Room "+e.class_id+" not found!"):(e.CourseData=t.body.info,e.resources=t.body.resources,e.loading=!1,e.handleUpdate())})},methods:{handleRemove:function(e,t){},handlePictureCardPreview:function(e){this.dialogImageUrl=e.url,this.dialogVisible=!0},handleUpdate:function(){this.$refs.description_display.handleUpdate(this.CourseData.description),this.$refs.notice_display.handleUpdate(this.CourseData.notice)},onSubmit:function(){this.$http.post("/api/class/info/update",{resources:this.resources,info:this.CourseData,class_id:this.class_id}).then(function(e){this.$message("课程信息已更新"),location.reload()})},onEdit:function(e){this.$refs.editor.handleOpen(e)}},components:{ContentEditor:s.a,ContentDisplay:o.a}}),r={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-container",[a("el-header",[a("h2",[e._v("课程设置")])]),e._v(" "),a("el-main",[a("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"form",attrs:{model:e.CourseData,"label-width":"140px"}},[a("el-form-item",{attrs:{label:"课程名称："}},[a("el-input",{attrs:{placeholder:"请输入"},model:{value:e.CourseData.title,callback:function(t){e.$set(e.CourseData,"title",t)},expression:"CourseData.title"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"课程权限："}},[a("el-radio",{attrs:{label:1},model:{value:e.CourseData.type,callback:function(t){e.$set(e.CourseData,"type",t)},expression:"CourseData.type"}},[e._v("公开")]),e._v(" "),a("el-radio",{attrs:{label:2},model:{value:e.CourseData.type,callback:function(t){e.$set(e.CourseData,"type",t)},expression:"CourseData.type"}},[e._v("私密")])],1),e._v(" "),a("el-form-item",{attrs:{label:"课程资源："}},[a("el-transfer",{attrs:{data:e.avaliable_resources,titles:["可用资源","已选资源"]},model:{value:e.resources,callback:function(t){e.resources=t},expression:"resources"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"课程简介："}},[a("ContentDisplay",{ref:"description_display",attrs:{border:!0},nativeOn:{click:function(t){e.onEdit(e.CourseData.description)}}})],1),e._v(" "),a("el-form-item",{attrs:{label:"课程公告："}},[a("ContentDisplay",{ref:"notice_display",attrs:{border:!0},nativeOn:{click:function(t){e.onEdit(e.CourseData.notice)}}})],1),e._v(" "),a("el-form-item",{attrs:{label:"上传课程图片："}},[a("el-upload",{attrs:{action:"/api/file/uploadcourseimg","list-type":"picture-card",data:{class:e.class_id},"on-preview":e.handlePictureCardPreview,"on-remove":e.handleRemove}},[a("i",{staticClass:"el-icon-plus"})]),e._v(" "),a("el-dialog",{attrs:{visible:e.dialogVisible},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("img",{attrs:{width:"100%",src:e.dialogImageUrl,alt:""}})])],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:e.onSubmit}},[e._v("更新")])],1),e._v(" "),a("ContentEditor",{ref:"editor",on:{updated:e.handleUpdate}})],1)],1)],1)},staticRenderFns:[]};var n=a("VU/8")(l,r,!1,function(e){a("Sonn")},"data-v-108b8332",null);t.default=n.exports}});
//# sourceMappingURL=24.43e28059cebed81e7f5a.js.map