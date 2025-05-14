per_side_time=10;
bg_size=800;

game_ended=false;
selected_node=0;
blue_turn=false;
no_of_blue_nodes=0;
no_of_red_nodes=0;
blue_score=0;
red_score=0;
middle_ring_unlocked=false;
inner_ring_unlocked=false;
between_turn="no";//no,blue,red
const locations={
1:[(310*bg_size)/1024,(146*bg_size)/1024],
2:[(729*bg_size)/1024,(151*bg_size)/1024],
3:[(931*bg_size)/1024,(515*bg_size)/1024],
4:[(730*bg_size)/1024,(876*bg_size)/1024],
5:[(306*bg_size)/1024,(875*bg_size)/1024],
6:[(96*bg_size)/1024,(517*bg_size)/1024],
11:[(373*bg_size)/1024,(260*bg_size)/1024],
22:[(665*bg_size)/1024,(262*bg_size)/1024],
33:[(810*bg_size)/1024,(515*bg_size)/1024],
44:[(668*bg_size)/1024,(766*bg_size)/1024],
55:[(371*bg_size)/1024,(766*bg_size)/1024],
66:[(232*bg_size)/1024,(514*bg_size)/1024],
111:[(439*bg_size)/1024,(376*bg_size)/1024],
222:[(604*bg_size)/1024,(377*bg_size)/1024],
333:[(678*bg_size)/1024,(514*bg_size)/1024],
444:[(597*bg_size)/1024,(652*bg_size)/1024],
555:[(431*bg_size)/1024,(653*bg_size)/1024],
666:[(357*bg_size)/1024,(512*bg_size)/1024]};



function get_node_weight(n1,n2){
    if(n1>n2){
        let temp=n1;
        n1=n2;
        n2=temp;
    }
    node_pairs=[[1,2],[2,3],[3,4],[4,5],[5,6],[1,6],[11,22],[22,33],[33,44],[44,55],[55,66],[11,66],[111,222],[222,333],[333,444],[444,555],[555,666],[111,666],[2,22],[4,44],[6,66],[11,111],[33,333],[55,555]];
    weights=[1,2,1,1,3,2,6,4,5,6,4,5,8,9,8,8,9,8,1,1,1,1,1,1];
    for(let i=0;i<node_pairs.length;i++){
        if(node_pairs[i][0]==n1 && node_pairs[i][1]==n2){
            return weights[i];
        }
    }
    return 0;
}
function start(){
    document.body.removeChild(document.getElementById("start_button"));
    
    rbdiv=document.createElement('div');
    document.body.appendChild(rbdiv);
    rbdiv.style.display="flex";
    rbdiv.style.width="800px";

    
    
    red_div=document.createElement('div');
    rbdiv.appendChild(red_div);
    red_div.id="red_div";
    //red_div.style.position="relative";
    //red_div.style.left="0px";
    //red_div.style.top="20px";
    red_div.style.float="left";
    red_div.style.width="250px";
    red_div.style.height="100px";
    red_div.style.backgroundColor="#ffdddd";
    red_div.style.border="5px solid #ff0000";
    
    blue_div=document.createElement('div');
    rbdiv.appendChild(blue_div);
    blue_div.id="blue_div";
    blue_div.style.position="relative";
    blue_div.style.left="280px";
    //blue_div.style.top="-89px";
    blue_div.style.width="250px";
    blue_div.style.height="100px";
    //blue_div.style.float="right";
    
    blue_div.style.backgroundColor="#ddddff";
    blue_div.style.border="5px solid #0000ff";

    const common_timer=document.createElement('h4');
    common_timer.id="common_timer";
    document.body.appendChild(common_timer);

    const red_timer=document.createElement('h4');
    red_timer.id="red_timer";
    red_div.appendChild(red_timer);
    let red_time=per_side_time;

    const red_score_ele=document.createElement('h4');
    red_score_ele.id="red_score";
    red_div.appendChild(red_score_ele);

    const blue_timer=document.createElement('h4');
    blue_timer.id="blue_timer";
    blue_div.appendChild(blue_timer);
    let blue_time=per_side_time;

    const blue_score_ele=document.createElement('h4');
    blue_score_ele.id="blue_score";
    blue_div.appendChild(blue_score_ele);

    const turn_info=document.createElement('h4');
    turn_info.id="turn_info";
    document.body.appendChild(turn_info);
    document.getElementById("turn_info").innerHTML="Red's turn-pick a node";
    document.getElementById("turn_info").style.color="#aa0000";

    document.getElementById("common_timer").innerHTML="Total time left: "+(blue_time+red_time)+"s";
    document.getElementById("red_timer").innerHTML="Red time left: "+red_time+"s";
    document.getElementById("blue_timer").innerHTML="Blue time left: "+blue_time+"s";
    document.getElementById("red_score").innerHTML="Red score is 0 points";
    document.getElementById("blue_score").innerHTML="Blue score is 0 points";
    var x=setInterval(function(){
        document.getElementById("common_timer").innerHTML="Total time left: "+(red_time+blue_time)+"s";
    },1000);
    var red_x=setInterval(function(){
        if(!blue_turn){
        document.getElementById("red_timer").innerHTML="Red time left: "+red_time--+"s";
        }
        if(red_time<=0){
            clearInterval(red_x);
            clearInterval(x);
            winner("blue");
        }
    },1000);
    
    var blue_x=setInterval(function(){
        if(blue_turn){
        document.getElementById("blue_timer").innerHTML="Blue time left: "+blue_time--+"s";
        }
        if(blue_time<=0){
            clearInterval(blue_x);
            clearInterval(x);
            winner("red");
        }
    },1000);
    const game=document.createElement('div');
    game.id="game";
    game.height=bg_size+"px";
    game.width=bg_size+"px";

    const bg=document.createElement('img');
    game.appendChild(bg);
    bg.src="board.png";
    bg.className="bg";
    bg.style.width=bg_size+"px";
    bg.style.height=bg_size+"px";
    document.body.appendChild(game);
    for (let i=1;i<=6;i++)
        addNode("gray",i*11);
    for (let i=1;i<=6;i++)
        addNode("gray",i);
    for (let i=1;i<=6;i++)
        addNode("gray",i*111);
    
    
}
function addNode(color,loc){
    const game=document.getElementById("game");
    const im=document.createElement('img'); 
    im.onclick=function(){doMove(loc);};
    im.src=color+"_node.png";
    im.className="node";
    im.style.zIndex=2;
    im.id="nodeAt"+loc;
    s=0.05*bg_size;
    
    im.style.width=s+"px";
    im.style.height=s+"px";
    im.style.left=(locations[loc][0]-s/2)+"px";
    im.style.top=(locations[loc][1]-s/2)+"px";
    
    game.appendChild(im);
}
function postMove(){
    if(selected_node!=0){
        document.getElementById("nodeAt"+selected_node).style.border="5px solid green";
        document.getElementById("turn_info").innerHTML=(blue_turn?"Blue":"Red")+"'s turn-pick a node to place titan";
    }else{
        if(blue_turn){
            document.getElementById("turn_info").innerHTML="Red's turn-pick a node";
            document.getElementById("turn_info").style.color="#aa0000";
            blue_turn=!(blue_turn);
        }else{
            document.getElementById("turn_info").innerHTML="Blue's turn-pick a node";
            document.getElementById("turn_info").style.color="#0000aa";
            blue_turn=!(blue_turn);
        }
        nodes=Object.keys(locations)
        blue_score=0;red_score=0;
        for(let i=0;i<nodes.length;i++){
            for(let j=i+1;j<nodes.length;j++){
                e1=document.getElementById("nodeAt"+nodes[i]);
                e2=document.getElementById("nodeAt"+nodes[j]);
                if(e1.src.endsWith("blue_node.png") && e2.src.endsWith("blue_node.png")){
                    blue_score+=get_node_weight(nodes[i],nodes[j]);
                }
            }
        }
        for(let i=0;i<nodes.length;i++){
            for(let j=i+1;j<nodes.length;j++){
                e1=document.getElementById("nodeAt"+nodes[i]);
                e2=document.getElementById("nodeAt"+nodes[j]);
                if(e1.src.endsWith("red_node.png") && e2.src.endsWith("red_node.png")){
                    red_score+=get_node_weight(nodes[i],nodes[j]);
                }
            }
        }
        document.getElementById("red_score").innerHTML="Red score is "+red_score+" points";
        document.getElementById("blue_score").innerHTML="Blue score is "+blue_score+" points";

        temp=0;
        for(let i=1;i<=6;i++){
            if(document.getElementById("nodeAt"+i).src.endsWith("gray_node.png")){
                break;
            }
            temp++;
        }
        if(temp==6){
            middle_ring_unlocked=true;
        }

        temp=0;
        for(let i=11;i<=66;i+=11){
            if(document.getElementById("nodeAt"+i).src.endsWith("gray_node.png")){
                break;
            }
            temp++;
        }
        if(temp==6){
            inner_ring_unlocked=true;
        }

        temp=0;
        for(let i=111;i<=666;i+=111){
            if(document.getElementById("nodeAt"+i).src.endsWith("gray_node.png")){
                break;
            }
            temp++;
        }
        if(temp==6){
            if(blue_score>red_score){
                winner("blue");
            }else if(red_score>blue_score){
                winner("red");
            }else{
                winner("tie");
            }
        }
    }

}

function winner(player){
    game_ended=true;
    rdiv=document.getElementById("red_div");
    bdiv=document.getElementById("blue_div");
    rdiv.innerHTML="";
    bdiv.innerHTML="";
    
    if(player=="blue"){
        rdiv.innerHTML="<h2 class=\"finalres\">Red lost!</h2>";
        bdiv.innerHTML="<h2 class=\"finalres\">Blue won!</h2>";
    }
    if(player=="red"){
        bdiv.innerHTML="<h2 class=\"finalres\">Blue lost!</h2>";
        rdiv.innerHTML="<h2 class=\"finalres\">Red won!</h2>";
    }
    if(player=="tie"){  
        rdiv.innerHTML="<h2 class=\"finalres\">It's a tie!</h2>";
        bdiv.innerHTML="<h2 class=\"finalres\">It's a tie!</h2>";
    }
    console.log("game ended");
    console.log(player);
}

function winnerCopy(player){
    game_ended=true;
    document.body.innerHTML = '';
    const win_ele=document.createElement('h1');
    win_ele.id="win_ele";
    document.body.appendChild(win_ele);
    if(player=="blue"){
        document.getElementById("win_ele").innerHTML="Blue wins!";
        win_ele.style.color="#0000aa";
    }
    if(player=="red"){
        document.getElementById("win_ele").innerHTML="Red wins!";
        win_ele.style.color="#aa0000";
    }
    if(player=="tie"){  
        document.getElementById("win_ele").innerHTML="It's a tie!";
    }
}

function doMove(loc){
    if(game_ended){
        return null;
    }
    if(loc%11==0 && middle_ring_unlocked==false){
        return null;
    }
    if(loc%111==0 && inner_ring_unlocked==false){
        return null;
    }
    console.log(selected_node);
    turn=blue_turn?"blue":"red";
    const ele=document.getElementById("nodeAt"+loc);
    if(ele.src.endsWith("gray_node.png")){
        if(selected_node!=0){
            if(get_node_weight(selected_node,loc)==0){
                return null;
            }
            selected_ele=document.getElementById("nodeAt"+selected_node)
            selected_ele.style.border="";
            selected_ele.src="gray_node.png";
            selected_node=0;
            ele.src=turn+"_node.png";
        }else{
            
            if(blue_turn){
                if(no_of_blue_nodes==4){
                    return null;
                }

                no_of_blue_nodes++;
            }else{
                if(no_of_red_nodes==4){
                    return null;
                }
                no_of_red_nodes++;
            }
            
            ele.src=turn+"_node.png";
        }
    }else if(ele.src.endsWith(turn+"_node.png")){
        if(selected_node!=0){
            console.log("here"+selected_node);
            document.getElementById("nodeAt"+selected_node).style.border="";
            selected_node=0;
            blue_turn=!(blue_turn);
        }else{
        selected_node=loc;
        
        }
    }else{
        return null;
    }
    console.log(turn);
    postMove();
}
function doMoveCopy(loc){
    if(blue_turn){
        const ele=document.getElementById("nodeAt"+loc);
        if(ele.src.endsWith("gray_node.png")){
            ele.src="blue_node.png";
            document.getElementById("turn_info").innerHTML="Red's turn-pick a node";
            document.getElementById("turn_info").style.color="#aa0000";
        }else if(ele.src.endsWith("blue_node.png")){
            document.getElementById("turn_info").innerHTML="Blue's turn-pick a node to move to";
            document.getElementById("turn_info").style.color="#0000aa";
        }
        blue_turn=false;
    }else{
        const ele=document.getElementById("nodeAt"+loc);
        if(ele.src.endsWith("gray_node.png")){
            ele.src="red_node.png";
            document.getElementById("turn_info").innerHTML="Blue's turn-pick a node";
            document.getElementById("turn_info").style.color="#0000aa";
        }
        blue_turn=true;
    }
    
}
 /*const im=document.createElement('img');
        im.src="red_node.png";
        im.className="node";
        im.style.zIndex=2;
        document.body.appendChild(im);*/