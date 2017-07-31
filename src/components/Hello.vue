<template>
  <div class="hello">
    <div class="header">wechat auth</div>
  
    abcedf
  
  </div>
</template>

<script>

$.extend({
  getUrlVars: function () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function (name) {
    return $.getUrlVars()[name];
  }
});

$(document).ready(function () {
  var _self = this;

  var code = $.getUrlVar('code');
  console.log("code = " + code);
  console.log("url = " + window.location.href);




  // $.post("http://localhost:9191/test", { code: code })
  //       .done(function (data) {

  //         alert('test');

  //       })
  //      .fail(function () {

  //         alert('fail');

  //       });








  if (code) {

    $.post("http://119.29.187.201:9191/wx", { code: code })
      .done(function (data) {

        currentUserId = data.userid;


        $.post("http://localhost:9191/test", { code: code })
          .done(function (data) {

            alert('test');

          })
          .fail(function () {

            alert('fail test');

          });


        // $.post("http://119.29.187.201:9191/tryCreateOdooUser", { user: data })
        //   .done(function (data) {

        //     console.log("data = " + data);

        //   }); 
      }).fail(function () {

            alert('wx');

          });

  }
  else {

    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wwbf94872d6daf233a&redirect_uri=auth.cq-tct.com&response_type=code&scope=SCOPE&agentid=1000012&state=STATE#wechat_redirect';

  }


});
export default {
  name: 'hello',
  data() {
    return {
      data: []
    }
  },
  mounted() {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  text-align: center;
  height: 30px;
  line-height: 30px;
  color: #777;
}

.card {
  width: 90%;
  margin: 10px auto;
  border: 1px solid #eee;
  border-radius: 5px;
  font-size: 14px;
  padding: 5px;
}

.card div {
  display: flex;
}

div span:nth-of-type(1) {
  width: 100px;
}
</style>
