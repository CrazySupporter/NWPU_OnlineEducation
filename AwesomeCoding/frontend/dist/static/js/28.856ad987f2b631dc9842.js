webpackJsonp([28],{benw:function(t,i,n){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var e={undefined:"","NOT_LOGIN.":"请登录。","NOT_STUDENT.":"只有学生账户可以加入班级。","ALREADY_IN.":"你已经在班级中。","IN_BLACKLISTING.":"你在黑名单中，不能加入课程，请联系老师。"},s={data:function(){return{invitation_code:void 0,class_id:void 0}},computed:{},mounted:function(){var t=this;this.invitation_code=this.$route.params.invitation_code,this.$http.post("/api/class/invite/check",{invitation_code:this.invitation_code},null).then(function(t){return this.class_id=t.body.class_id,this.$confirm("你即将加入班级 "+t.body.class_title+". 是否继续?","提示",{confirmButtonText:"继续",cancelButtonText:"取消",type:"warning"})}).then(function(){return t.$http.post("/api/class/join",{class_id:t.class_id},null)}).then(function(i){t.$message.success("成功加入班级"),self.location=document.referrer}).catch(function(i){t.$message.error("加入班级失败。"+e[i.body])})}},o={render:function(){var t=this.$createElement,i=this._self._c||t;return i("div",[i("h2",[this._v("邀请")]),this._v(" "),i("p",[this._v(" 你的邀请码为："+this._s(this.invitation_code)+" ")]),this._v(" "),i("p",[this._v(" 正在为你重定向跳转... ")])])},staticRenderFns:[]},c=n("VU/8")(s,o,!1,null,null,null);i.default=c.exports}});
//# sourceMappingURL=28.856ad987f2b631dc9842.js.map