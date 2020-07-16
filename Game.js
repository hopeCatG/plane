//游戏对象
 var  game = {
      box:'',
      title:'飞机大战 1.0',
      data:['简单模式','普通模式','困难模式','我开挂了'],
      fraction:0,  //分数   
      //初始化
      init:function (){
          this.box = document.querySelector('.box');
          this.box.style.borderWidth = '5px';
          
          var h3 = document.createElement('h3');
          h3.innerHTML = this.title;
          this.box.appendChild(h3);
          for (var i = 0; i < this.data.length ; i ++) {
              var a = document.createElement('a');
              a.href = 'javascript:;';
              a.innerHTML = this.data[i];
              a.dataset.index = i;
              this.box.appendChild(a);
              a.onclick = function (e){
                  //event 兼容
                  e = e || window.event;
                  game.start(this,e);
              }
              
          }
      },
      //游戏开始
      start: function(a,e){
          var index = a.dataset.index;
          this.box.innerHTML = "";
          this.box.classList.remove('boxFlex');
          //显示飞机
          this.plane(e,index);
          //显示分数
          var  span= document.createElement('span');
          span.style.cssText = "position: absolute;left: 5px;top: 5px;color: #fff;";
          span.innerHTML = game.fraction;
          game.box.appendChild(span);
          //显示敌军
          this.enemy(span,index);
          
      },
      //飞机
      plane:function(e,index){
          var plane_src = './images/me1.png';
          if (index == 3) {
              plane_src = './images/me3.png'
          }
          var img = new Image();
          img.src = plane_src;
          img.width = 50;
          img.height = 50;
          img.classList.add('plane');
          this.box.appendChild(img);
                  //box到浏览器上边框的距离 + box 边框的宽度 + 飞机图片吧宽度的一半
          var tY = this.box.offsetTop + parseInt(this.box.style.borderWidth) + img.height/2 ;
          var tX = this.box.offsetLeft + parseInt(this.box.style.borderWidth) + img.height/2 ;
          //页面宽度改变时
          window.onresize = function () {
              var tX = game.box.offsetLeft + parseInt(game.box.style.borderWidth) + img.height/2 ;    
          }
          var top = e.pageY  - tY;
          var left = e.pageX - tX;
          img.style.cssText = "position: absolute;top:"+ top +"px;left:"+ left +"px;";
          //飞机的活动范围
          var topMin = 0;
          var topMax = this.box.clientHeight - img.height + 5;
          var leftMin =  - img.width / 2;
          var leftMax = this.box.clientWidth - img.width / 2;
          //飞机跟着鼠标动
          window.onmousemove = function (e) {
              e = e || window.event;
              top = e.pageY  - tY;
              left = e.pageX  - tX;

              //飞机不能出框
              top = Math.min(top,topMax); // 相当于 if (top > topMax) { top = topMax}    
              top = Math.max(top,topMin);// 相当于 if (top < topMax) { top = topMin} 
              left = Math.min(left,leftMax);
              left = Math.max(left,leftMin);
              
              img.style.top = top  + "px";
              img.style.left = left + "px";
              //子弹
              
          }
          
          game.bullet(img,index);
          
      },
      //子弹的生成
      bullet:function(plane,index){
          var aa = 400;
          var bullet_img = "./images/bullet01.png";
          if (index > 1 && index < 3 ){
              aa = 300;
          } else if(index == 3) {
              aa = 80;
              bullet_img = "./images/bullet03.png";
          }
          game.bulletTime = setInterval(function(){
              var bullet = new Image();
              bullet.src = bullet_img;
              bullet.width = 35;
              bullet.height = 50;
              bullet.style.cssText = "position: absolute;transform: scale(0.5);"
              bullet.style.top = plane.offsetTop - (bullet.height / 2) + "px";
              bullet.className = 'bubu';
              bullet.style.left = (plane.offsetLeft + plane.offsetWidth/2 - bullet.offsetWidth/2 - 18 )  + "px";
              game.box.appendChild(bullet);
              
              var goTime = setInterval(function (){
                  //如果找不到父亲 也就是子弹已经碰撞后删除了 就清除定时器
                  if (!bullet.parentNode) {
                      clearInterval(goTime);
                  }
                  bullet.style.top = bullet.offsetTop - 3 + "px";
                  if (bullet.offsetTop < - bullet.height){
                      clearInterval(goTime);
                      bullet.parentNode.removeChild(bullet);
                      
                  }
                  
              },13)
              // console.log("子弹速度aa",aa);
          },aa) //子弹速度   
          
      },
      //敌军
      enemy:function(span,index){
          
          //控制游戏难度
          var aa = 500;
          aa = aa - (index * 100);
          var bb = 3;
          bb = bb + (index * 2);
          
          game.enemy_time = setInterval(function (){
              var enemy = new Image();
              enemy.src = "./images/enemy1.png";
              enemy.width = 40;
              enemy.height = 40;
              enemy.style.cssText = 'position: absolute;';
              var max = game.box.offsetWidth - enemy.width;
              var min = - enemy.width/2;
              enemy.style.left = parseInt(Math.random() * (max - min)  + min) + "px";
              var randm = parseInt(Math.random() * 1 + bb );
              
              // console.log('移动值：'+randm);
              
              var enemy_time2 = setInterval(function () {
          
                      enemy.style.top = enemy.offsetTop + randm + "px";
                      if (enemy.offsetTop > game.box.offsetHeight) {
                          
                          clearInterval(enemy_time2);
                          enemy.parentNode.removeChild(enemy);
                      }
              },35)  //速度
              game.box.appendChild(enemy);
              
              //检测子弹与敌人碰撞
              
              var bullets = game.getClass('bubu');
			  // var bullets =document.querySelectorAll('.bubu');
              console.log('长度为',bullets);
              var bomm_time = setInterval(function () {
                  for (var i = 0 ; i < bullets.length ; i++) {
                      if (game.boom(enemy,bullets[i])) {
                          //撞上了
                          game.fraction ++;
                          span.innerHTML = game.fraction;
                          clearInterval(bomm_time);
                          enemy.src = "./images/enemy1_down3.png";
                          //清除撞上的子弹
                          bullets[i].parentNode.removeChild(bullets[i]);
                          //清除飞机
                          setTimeout(function (){
                              if (enemy.parentNode) {
                                      enemy.parentNode.removeChild(enemy);
                              }
                          },300)
                      } else {
                          // console.log('没有')
                      }
                  }
              },100)
              
              //检测玩家飞机与敌人碰撞
              
              var plane = document.querySelector('.plane');
              var plane_bomm_time = setInterval(function () {
                  
                      if (game.boom(enemy,plane)) {
                          //撞上了
                          clearInterval(plane_bomm_time);
                          enemy.src = "./images/enemy1_down3.png";
                          plane.src = "./images/me_destroy_3.png";
                          clearInterval(game.enemy_time);
                          // clearInterval(game.enemy_time2);
                          clearInterval(game.bulletTime);
                          
                          //清除飞机
                          setTimeout(function (){
                              if (enemy.parentNode) {
                                      enemy.parentNode.removeChild(enemy);
                              }
                              game.over();
                          },500)
                      } else {
                          // console.log('没有')
                      }
                  
              },100)
              
          
              // console.log('aa',aa);
          },aa)   // ---控制数量
      },
      //检测碰撞
      boom:function (obj1,obj2) {
          var top1 = obj1.offsetTop;
          var buttom1 = top1 + obj1.clientHeight;
          var left1 = obj1.offsetLeft;
          var right1 = left1 + obj1.clientWidth;
          
          var top2 = obj2.offsetTop;
          var buttom2 = top2 + obj2.clientHeight;
          var left2 = obj2.offsetLeft;
          var right2 = left2 + obj2.clientWidth;
          
          if ( right2 < left1 || left2 > right1 || buttom2 < top1 || top2 > buttom1 ) {
              return false;
          } else {
              return true;
          }
      },
      getClass:function (cName,parent){
          parent = parent || document;
              if (document.getElementsByClassName) {
                  return parent.getElementsByClassName(cName);
              } else {
                  var all = parent.getElementsByTagName('*');
                  var arr = [];
                  for (var i = 0 ; i < all.length ; i ++ ){
                      var arrClass = all.className.split('');
                      for (var j = 0; j < arrClass.length; j++) {
                          if (arrClass[j] == cName ) {
                              arr.push( all[i]);
                              break;
                          }
                      }
                  }
                  return arr;
              }
          },
      over:function (){
          //清除各定时器 游戏结束
          
              
      
              game.box.innerHTML = "";
              var overBox = document.createElement('div');
              // overBox.width = "200px";
              // overBox.height = "300px";
              game.box.classList.add('boxFlex');
              overBox.style.cssText = "background-color: #FFF;width: 200px; height: 350px; align-self: center;";
              game.box.appendChild(overBox);
              var title = document.createElement('div');
              title.style.cssText = "width: 100%;height: 15px;line-height: 15px;text-align: center;color: #000000; padding: 10px 0; font-size: 18px;"
              title.innerHTML = "游戏结束";
              overBox.appendChild(title);
              var h3 = document.createElement('h3');
              h3.innerHTML = "得分" + game.fraction + "分";
              h3.style.cssText = "background-color: white;color: #000;";
              overBox.appendChild(h3);
              var button = document.createElement('button');
              // button.style.cssText = "margin:  0 auto; background-color: greenyellow;";
              button.classList.add('button');
              button.innerHTML = "重新开始";
              overBox.appendChild(button);
              button.onclick = function (){
                  game.box.innerHTML = "";
                  game.fraction = 0;
                  game.init();
              }
      
      }
                };