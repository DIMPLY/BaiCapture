angular.module('Bai',['ngRoute'])
//.value('pwd','http://offi.shenmawo.com.cn/')
.factory('imgDrawer',function(){
        var imgDrawer={
            c:undefined,    //the canvas dom element
            ctx:undefined,  //2d context of the canvas element
            //getCtx: set the object canvas of the imgDrawer
            getCtx:function(c){
                this.c = c;
                this.ctx = c.getContext("2d");
            },
            //draw: draw an img file to the canvas
            // 3 params = draw the whole file in raw w & h
            // 9 params = draw the scissored area
            draw:function(img,x,y,w,h,xx,yy,ww,hh){
                if(w===undefined)
                    this.ctx.drawImage(img,x,y);
                else
                    this.ctx.drawImage(img,xx,yy,ww,hh,x,y,w,h);
            },
            //drawRotated: draw an img file in a certain rotation
            drawRotated:function(img,x,y,deg){
                this.ctx.save();
                this.ctx.translate(x,y);
                this.ctx.rotate(deg*Math.PI/180);
                this.ctx.drawImage(img,-img.width/2,-img.height/2);
                this.ctx.restore();
            },
            //clear: clear the whole canvas
            clear:function(){
                this.ctx.clearRect(0,0,this.c.clientWidth,this.c.clientHeight);
            },
            //redrawBg: certain to my project
            // for the background redraw (bg, capture area, camera and cross)
            redrawBg:function(){
                this.clear();
                this.draw(gbg,0,0);
                this.draw(capture,96,220);
                this.draw(camera,239,800);
                this.draw(cross,288,411);
            },
            //clip: return the base64 code of the whole canvas
            clip:function(){
                return this.c.toDataURL();
            }
        };
        return imgDrawer;
    })
.config(['$routeProvider', function($routeProvider){
    $routeProvider
       .when('/',{
            templateUrl:'templates/enter.html',
            controller:function($scope){
                $scope.mask=false;
                document.getElementsByTagName('body')[0].style.backgroundImage
                    = 'url('+pwd+'images/bg.jpg)';
                function oneMoreImg(){
                    $scope.sh++;
                    $scope.$apply();
                }
                $scope.pwd = pwd;
                $scope.sh = 0;
                coin = new Image();
                capture = new Image();
                coin.src = pwd+"images/coin.png";
                coin.onload = oneMoreImg;
                coin.crossOrigin = 'Anonymous';
                capture.src = pwd+"images/capture.png";
                capture.onload = oneMoreImg;
                capture.crossOrigin = 'Anonymous';
                gbg = new Image();
                gbg.src = pwd+"images/gbg.jpg";
                gbg.onload = oneMoreImg;
                gbg.crossOrigin = 'Anonymous';
                camera = new Image();
                camera.src = pwd+"images/camera.png";
                camera.onload = oneMoreImg;
                camera.crossOrigin = 'Anonymous';
                n1 = new Image();
                n1.src = pwd+"images/11.png";
                n1.onload = oneMoreImg;
                n1.crossOrigin = 'Anonymous';
                n2 = new Image();
                n2.src = pwd+"images/12.png";
                n2.onload = oneMoreImg;
                n2.crossOrigin = 'Anonymous';
                n3 = new Image();
                n3.src = pwd+"images/13.png";
                n3.onload = oneMoreImg;
                n3.crossOrigin = 'Anonymous';
                bai = [new Image(),new Image()];
                bai[0].src = pwd+"images/bai1.png";
                bai[0].onload = oneMoreImg;
                bai[0].crossOrigin = 'Anonymous';
                bai[1].src = pwd+"images/bai2.png";
                bai[1].onload = oneMoreImg;
                bai[1].crossOrigin = 'Anonymous';
                again = new Image();
                again.src = pwd + "images/again.png";
                again.onload = oneMoreImg;
                again.id = 'again';
                info = new Image();
                info.src = pwd + "images/info-forward.jpg";
                info.onload = oneMoreImg;
                info.id = 'info';
                arrow = new Image();
                arrow.src = pwd + "images/arrow-forward.png";
                arrow.onload = oneMoreImg;
                arrow.id = 'arrow';
                score = new Image();
                score.src = pwd + "images/score.png";
                score.onload = oneMoreImg;
                score.id = 'score';
                angular.element(score).wrap('<div class="score"></div>');
                angular.element(again).wrap('<button ng-click="game.again()" class="again"></button>');
                cross = new Image();
                cross.src = pwd + "images/cross.png";
                cross.onload = oneMoreImg;
                cross.crossOrigin = 'Anonymous';
            },
            controllerAs:'enter'
        })
       .when('/game', {
            templateUrl:'templates/game.html',
            controller:function(imgDrawer,$scope,$compile){
                getRecord();
                this.pwd = pwd;
                var game = this;
                var width = canvas.clientWidth;
                var dropperOn,baiN,coinsXY,baiXY,clip;
                var text = document.createTextNode('');
                score.parentNode.appendChild(text);
                startGame = function(){
                    dropperOn = false;
                    baiN = Math.floor(Math.random()*2);
                    coinsXY = [{y:0,x:Math.random()*(width-66)}];
                    baiXY = {y:-300,x:width/2,deg:0};
                    imgDrawer.getCtx(canvas);
                    imgDrawer.redrawBg();
                    imgDrawer.draw(n3,271.5,376);
                    setTimeout(function() {
                        imgDrawer.redrawBg();
                        imgDrawer.draw(n2,268,376.5);
                        setTimeout(function() {
                            imgDrawer.redrawBg();
                            imgDrawer.draw(n1,283.5,376.5);
                            dropperOn = true;
                            setTimeout(function() {
                                dropper();
                            },1000);
                        },1000);
                    },1000);
                };
                startGame();
                function dropper(){
                    //one loop
                    imgDrawer.redrawBg();
                    for(c in coinsXY){
                        imgDrawer.draw(coin,coinsXY[c].x,coinsXY[c].y);
                        coinsXY[c].y+=10;
                    }
                    imgDrawer.drawRotated(bai[baiN],baiXY.x,baiXY.y,baiXY.deg);
                    baiXY.y+=8;
                    baiXY.deg+=7;
                    imgDrawer.draw(camera,239,800);
                    if(baiXY.y>1562){
                        game.end(0);
                        return;
                    }
                    while(coinsXY[0].y>=1024)coinsXY.shift();
                    if(Math.random()<0.07)coinsXY.push({y:0,x:Math.random()*(width-66)});
                    if(Math.random()<0.07)coinsXY.push({y:0,x:Math.random()*(width-66)});
                    if(Math.random()<0.07)coinsXY.push({y:0,x:Math.random()*(width-66)});
                    //end one loop
                    if(dropperOn)
                    setTimeout(dropper,30);
                }
                this.end = function (num){
                    dropperOn=false;//stop

                    //clip the whole canvas into image object 'clip'
                    clip = new Image();
                    clip.onload = function(){
                        clip.onload = null;
                        imgDrawer.getCtx(canvas2);
                        imgDrawer.draw(clip,70,70,448,447,96,220,448,447);

                        //clip the whole canvas2 into image object 'clip'
                        clip.src = imgDrawer.clip();
                    };
                    clip.src = imgDrawer.clip();

                    //use another canvas2 to get the capture in image object 'clip'
                    var canvas2 = document.createElement('canvas');
                    canvas2.width=448+140;
                    canvas2.height=447+200;

                    //clear the canvas and set bg
                    document.getElementsByTagName('body')[0].style.backgroundImage
                        = 'url('+pwd+'images/bg.jpg)';
                    canvas.style.display='none';

                    //append 'clip' to 'section' and set id='clip' to apply css
                    var sec = document.getElementsByTagName('section')[0];
                    clip.id='clip';
                    sec.appendChild(clip);

                    //append others
                    text.data=num + '分';
                    sec.appendChild(info);
                    sec.appendChild(arrow);
                    $compile(again.parentNode)($scope);
                    sec.appendChild(again.parentNode);
                    sec.appendChild(score.parentNode);

                    //apply the transition class after 300ms
                    setTimeout(function(){
                        angular.element(clip).addClass('ani');
                    },300);
                };
                this.getScore = function(){
                    var baiHeight = [136,166][baiN];
                    var dist = Math.abs(baiXY.y+baiHeight/2-443.5);
                    var maxDist = 1062-443.5;
                    game.end(Math.round(100-dist*100/maxDist));
                };
                this.again = function(){
                    angular.element(info).detach();
                    angular.element(arrow).detach();
                    angular.element(clip).detach();
                    angular.element(score.parentNode).detach();
                    angular.element(again.parentNode).detach();
                    canvas.style.display='block';
                    startGame();
                }
            },
            controllerAs:'game'
       });
    }]
);