webpackJsonp([22],{ILjA:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=o("8BMS"),r=o("tLnF"),n={data:function(){return{problemData:[],class_id:this.$route.params.class_id}},props:["course_status"],sockets:{alert:function(t){"REFRESH."===t.operation&&"train_area"==t.target&&this.reload()}},mounted:function(){this.reload()},methods:{reload:function(){this.$http.post("/api/problem/list",{class_id:this.class_id,type:"student"}).then(function(t){this.problemData=t.body.results,this.problemData.forEach(function(t,e){t.index=e+1,0===t.type&&(t.type_title="选择题"),1===t.type&&(t.type_title="编程题")})}).catch(function(t){this.$message(t)})}},components:{ChoiceProblem:a.a,ProgramProblem:r.a}},s={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",t._l(t.problemData,function(e){return o("el-card",{key:e.code},[e&&0===e.type?o("ChoiceProblem",{attrs:{default_code:e.code}}):t._e(),t._v(" "),e&&1===e.type?o("ProgramProblem",{attrs:{default_code:e.code}}):t._e()],1)}))},staticRenderFns:[]};var i=o("VU/8")(n,s,!1,function(t){o("aNh9")},null,null);e.default=i.exports},aNh9:function(t,e){}});
//# sourceMappingURL=22.55a9ce3d58ff6a1c76c1.js.map