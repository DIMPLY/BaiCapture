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
                this.draw(gbg.prototype,0,0);
                this.draw(capture.prototype,96,220);
                this.draw(camera.prototype,239,800);
                this.draw(cross.prototype,288,411);
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
                //TODO: can this below be more concise by using prototype?
                $scope.pwd = pwd;
                $scope.sh = 0;
                preImage = function(str){
                    this.prototype = new Image();
                    this.prototype.onload = function(){
                        $scope.sh++;
                        $scope.$apply();
                    };
                    this.prototype.crossOrigin = 'Anonymous';
                    this.prototype.src = pwd+str;
                };
                coin = new preImage("images/coin.png");
                capture = new preImage("images/capture.png");
                gbg = new preImage("images/gbg.jpg");
                camera = new preImage("images/camera.png");
                n1 = new preImage("images/11.png");
                n2 = new preImage("images/12.png");
                n3 = new preImage("images/13.png");
                bai = [new preImage("images/bai1.png"),new preImage("images/bai2.png")];
                again = new preImage("images/again.png");
                again.prototype.id = 'again';
                info = new preImage("images/info-forward.jpg");
                info.prototype.id = 'info';
                arrow = new preImage("images/arrow-forward.png");
                arrow.prototype.id = 'arrow';
                score = new preImage("images/score.png");
                score.prototype.id = 'score';
                angular.element(score.prototype).wrap('<div class="score"></div>');
                angular.element(again.prototype).wrap('<button ng-click="game.again()" class="again"></button>');
                cross = new preImage("images/cross.png");
                //TODO END
            },
            controllerAs:'enter'
        })
       .when('/game', {
            templateUrl:'templates/game.html',
            controller:function(imgDrawer,$scope,$compile){
                this.pwd = pwd;
                var game = this;
                var width = canvas.clientWidth;
                var dropperOn,baiN,coinsXY,baiXY,clip;
                var text = document.createTextNode('');
                score.prototype.parentNode.appendChild(text);
                startGame = function(){
                    dropperOn = false;
                    baiN = Math.floor(Math.random()*2);
                    coinsXY = [{y:0,x:Math.random()*(width-66)}];
                    baiXY = {y:-300,x:width/2,deg:0};
                    imgDrawer.getCtx(canvas);
                    imgDrawer.redrawBg();
                    imgDrawer.draw(n3.prototype,271.5,376);
                    setTimeout(function() {
                        imgDrawer.redrawBg();
                        imgDrawer.draw(n2.prototype,268,376.5);
                        setTimeout(function() {
                            imgDrawer.redrawBg();
                            imgDrawer.draw(n1.prototype,283.5,376.5);
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
                        imgDrawer.draw(coin.prototype,coinsXY[c].x,coinsXY[c].y);
                        coinsXY[c].y+=10;
                    }
                    imgDrawer.drawRotated(bai[baiN].prototype,baiXY.x,baiXY.y,baiXY.deg);
                    baiXY.y+=8;
                    baiXY.deg+=7;
                    imgDrawer.draw(camera.prototype,239,800);
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
                    sec.appendChild(info.prototype);
                    sec.appendChild(arrow.prototype);
                    $compile(again.prototype.parentNode)($scope);
                    sec.appendChild(again.prototype.parentNode);
                    sec.appendChild(score.prototype.parentNode);

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
                    angular.element(info.prototype).detach();
                    angular.element(arrow.prototype).detach();
                    angular.element(clip).detach();
                    angular.element(score.prototype.parentNode).detach();
                    angular.element(again.prototype.parentNode).detach();
                    canvas.style.display='block';
                    startGame();
                }
            },
            controllerAs:'game'
       });
    }]
);