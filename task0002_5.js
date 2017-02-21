window.onload = function(){
    var box = $('div');
    var height = document.getElementsByTagName('li')[0].offsetHeight;
    var width = document.getElementsByTagName('li')[0].offsetWidth;
    
    delegateEvent(box,'li','mousedown',function(ev){
        var allLi = document.getElementsByTagName('li');
        var allUl = document.getElementsByTagName('ul');
        var moveElement = this;
        var oEvent = ev||event;
        moveElement.style.opacity = 0.3;
        moveElement.style.zIndex = 2;
        
        //鼠标到移动元素左边距的距离
        var left = oEvent.clientX - moveElement.offsetLeft;
        //鼠标到移动元素上边距的距离
        var top = oEvent.clientY - moveElement.offsetTop;
        
        //在原位置创建新的li元素
        var newli = document.createElement('li');
        addClass(newli,'newli');
        newli.style.top = moveElement.offsetTop + 'px';
        newli.style.left = moveElement.offsetLeft + 'px';
        moveElement.parentNode.appendChild(newli);
        
        addEvent(document,'mousemove',mousemove);
        addEvent(document,'mouseup',mouseup);
        
        function mousemove(ev){
            var oEvent = ev||event;
            var newleft = oEvent.clientX - left;
            var newtop = oEvent.clientY - top;
            
            //使选择区域跟随鼠标移动
            moveElement.style.left = newleft + 'px';
            moveElement.style.top = newtop + 'px';
            
            //寻找有交集的元素
            var crossElement = findCrossElement(moveElement,allLi);
            
            //给交集元素添加active
            if(crossElement){
                if(document.getElementsByClassName('active')){
                    removeClass(document.getElementsByClassName('active')[0],'active');
                }
                addClass(crossElement,'active');
            }
            
        }
        
        function mouseup(ev){
            //移除事件
            removeEvent(document, "mousemove", mousemove);
            removeEvent(document, "mouseup", mouseup);
            
            //移动元素样式还原
            moveElement.style.zIndex = 1;
            moveElement.style.opacity = 1;
            
            //清除active
            if(document.getElementsByClassName('active')){
                removeClass(document.getElementsByClassName('active')[0],'active');
            }
            
            var crossLi = findCrossElement(moveElement,allLi);
            var crossUl = findCrossElement(moveElement,allUl);
            
            if(crossLi){//与成员碰撞的情况
                
                //移动元素定位
                moveElement.style.left = crossLi.offsetLeft + 'px';
                moveElement.style.top = crossLi.offsetTop + 'px';
                
                var crossLiParent = crossLi.parentNode;
                var moveElementParent = moveElement.parentNode;
                var inUlLi = crossLiParent.getElementsByTagName('li');
                var outUlLi = moveElementParent.getElementsByTagName('li');
            
                //移出元素下面的同胞元素上移(当移动元素在同一个容器内移动时循环要排除掉移动元素，不然移动元素的位置也会发生改变)
                for(var i = 0;i<outUlLi.length;i++){
                    if(outUlLi[i] != moveElement && outUlLi[i] != newli && outUlLi[i].offsetTop > newli.offsetTop){
                        outUlLi[i].style.top = outUlLi[i].offsetTop - height +'px';
                    }
                }
                newli.parentNode.removeChild(newli);

                //移入元素下的元素下移(当移动元素在同一个容器内移动时循环要排除掉移动元素，不然移动元素的位置也会发生改变)
                for(var i = 0;i<inUlLi.length;i++){
                    if(inUlLi[i].offsetTop >= moveElement.offsetTop && inUlLi[i] != moveElement){
                        inUlLi[i].style.top = inUlLi[i].offsetTop + height + 'px';
                    }
                }
                
                
                 //父节点转移
                moveElementParent.removeChild(moveElement);
                crossLiParent.appendChild(moveElement);
               
            }else if(crossUl){//未与成员碰撞，与父级容器碰撞
                
                var includeLi = crossUl.getElementsByTagName('li');
                var originalAllLi = moveElement.parentNode.getElementsByTagName('li');
                
                //移出元素同胞元素上移
                for(var i=0;i<originalAllLi.length;i++){
                    if(originalAllLi[i] != moveElement && originalAllLi[i] != newli && originalAllLi[i].offsetTop > newli.offsetTop){
                        originalAllLi[i].style.top = originalAllLi[i].offsetTop - height + 'px';
                    }
                }
                newli.parentNode.removeChild(newli);
                
                moveElement.parentNode.removeChild(moveElement);
                if(includeLi.length>0){
                    moveElement.style.top = includeLi[includeLi.length-1].offsetTop + height + 'px';
                    moveElement.style.left = crossUl.offsetLeft +1+ 'px';
                }else{
                    moveElement.style.top = 1 + 'px';
                    moveElement.style.left = crossUl.offsetLeft + 1 + 'px';
                }
                crossUl.appendChild(moveElement);
            }else{
                moveElement.style.top = newli.offsetTop + 'px';
                moveElement.style.left = newli.offsetLeft +'px';
                newli.parentNode.removeChild(newli);
            }
        }
        
        function findCrossElement(moveEle,checkEle){
            var minDistance = 999999999;
            var crossIndex;
            var r1 = moveEle.offsetLeft + width;
            var l1 = moveEle.offsetLeft;
            var t1 = moveEle.offsetTop;
            var b1 = moveEle.offsetTop + height;
            for(var i=0;i<checkEle.length;i++){
                if(checkEle[i] == moveEle){
                    continue;
                }else{
                    var r2 = checkEle[i].offsetLeft + checkEle[i].offsetWidth;
                    var l2 = checkEle[i].offsetLeft;
                    var t2 = checkEle[i].offsetTop;
                    var b2 = checkEle[i].offsetTop +checkEle[i].offsetHeight;
                    if(r1<l2||l1>r2||b1<t2||t1>b2){
                        continue;
                    }else{
                        var distance = Math.sqrt((l2-l1)*(l2-l1)+(t2-t1)*(t2-t1));
                        if(distance < minDistance){
                            minDistance = distance;
                            crossIndex = i;
                        }
                    }
                }
            }
            if(crossIndex >= 0){
                return checkEle[crossIndex];
            }
        }
    });
}