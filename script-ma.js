const szs=[0,1,1,1,1,2,2,2,3,3,4];
const dx=[-1,-1,0,1,1,1,0,-1];
const dy=[0,1,1,1,0,-1,-1,-1];
const ddx=[-1,-1,1,1];
const ddy=[-1,1,1,-1];
let ori=[0,1,1,1,1,1,1,1,1,1,1];
function inside(x,y){
    return x>=0 && y>=0 && x<10 && y<10;
}

function writeUp(s){
    const u=document.getElementById("writeinfo");
    u.innerHTML=s;
}

function writeSum(s,obj){
    obj.innerHTML=s;
}

function potPune(x,y,a,len,ori){ 

    if(ori==0)
    {
        // pe verticala
        if(x+len-1>=10){
            return 0;
        }

        for(let i=x; i<x+len; i++){
            if(a[i][y]!=0){
                return 0;
            }
            for(let d=0; d<8; d++){
                let xn=i+dx[d];
                let yn=y+dy[d];

                if(inside(xn,yn) && a[xn][yn]!=0){
                    return 0;
                }
            }
        }
        return 1;
    }
    else
    {
        // pe orizontala 
        if(y+len-1>=10){
            return 0;
        }

        for(let j=y; j<y+len; j++){
            if(a[x][j]!=0){
                return 0;
            }
            for(let d=0; d<8; d++){
                let xn=x+dx[d];
                let yn=j+dy[d];

                if(inside(xn,yn) && a[xn][yn]!=0){
                    return 0;
                }
            }
        }
        return 1;
    }
}

window.onload=function() {

    localStorage.setItem("lastseen","ma.html");

    const gameCont=document.getElementsByClassName("game_container")[0];

    let a=[]; // the player matrix 
    let b=[]; // the bot matrix
    for(let i=0; i<10; i++){
        let auxx=[];
        for(let j=0; j<10; j++){
            auxx.push(0);
        }
        a.push(auxx);
    }

    if(localStorage.getItem("player")==null){
        writeUp("Login in order to play");
    }
    else {
        let ui=document.getElementById("userinfo");
        const user=this.localStorage.getItem("player");
        writeSum(user+" | wins: "+localStorage.getItem(user+"|points"),ui);
        writeUp("Place your ships");
        writeSum("Logout",document.getElementById("aici"));
        document.getElementById("aici").addEventListener("click", (event)=>{
            localStorage.removeItem("player");
        },once=true);
        setUp();
    }

    function rotateShip(ss){
        const l1=window.getComputedStyle(ss).getPropertyValue("width");
        const l2=window.getComputedStyle(ss).getPropertyValue("height");
        ss.style.width=l2;
        ss.style.height=l1;
    }

    function setUp() {
        writeUp("Place your ships");

        let rr=document.createElement("div");
        rr.classList.add("randomize");
        rr.innerHTML="Randomize";
        rr.addEventListener("click", (e)=>{
            a=genBoard();
            for(let i=0; i<10; i++){
                for(let j=0; j<10; j++){
                    if(a[i][j]>0){
                        let uu=document.getElementById("r"+i+"c"+j);
                        uu.style.backgroundColor="rgba(222, 184, 135, 0.5)";
                        uu.style.border="2px solid burlywood";
                    }
                }
            }
            for(let i=1; i<=10; i++){
                const uu=document.getElementById(String(i));
                uu.remove();
            }
            rr.remove();
        }, once=true);

        gameCont.appendChild(rr);

        let pp=document.createElement("div");
        pp.classList.add("ship_deck");
        gameCont.appendChild(pp);

        for(let i=1; i<=10; i++){
            let ss=document.createElement("div");
            ss.draggable="true";
            ss.id=i;
            if(i<=4){
                ss.classList.add("ship1");
                ss.lungime=1;
                ss.ori=1;
            }
            else if(i<=7){
                ss.classList.add("ship2");
                ss.lungime=2;
                ss.ori=1;
            }
            else if(i<=9){
                ss.classList.add("ship3");
                ss.lungime=3;
                ss.ori=1;
            }
            else {
                ss.classList.add("ship4");
                ss.lungime=4;
                ss.ori=1;
            }
            pp.appendChild(ss);
            ss.addEventListener("dragstart", (e)=>{
                e.dataTransfer.setData("text/plain",ss.id);
            });
            ss.addEventListener("click", function rotateShip(e){
                e.preventDefault();
                const l1=window.getComputedStyle(ss).getPropertyValue("width");
                const l2=window.getComputedStyle(ss).getPropertyValue("height");
                ss.style.width=l2;
                ss.style.height=l1;
                ori[Number(ss.id)]=1-ori[Number(ss.id)];
            });
        }

        let p=document.createElement("div");
        p.classList.add("board");
        gameCont.appendChild(p);
        for(let i=0; i<10; i++){
            for(let j=0; j<10; j++){
                let aux=document.createElement("div");
                aux.classList.add("block");
                aux.id="r"+i+"c"+j;
                p.appendChild(aux);
                aux.addEventListener("dragover", (e)=>{
                    e.preventDefault();
                    const shipId=Number(e.dataTransfer.getData("text/plain"));
                    const uwu=aux.id;
                    let x=Number(uwu[1]);
                    let y=Number(uwu[3]);

                    if(potPune(x,y,a,szs[shipId],ori[shipId])){
                        if(ori[shipId]==0){
                            for(let i=x; i<x+szs[shipId]; i++){
                                const tt=document.getElementById("r"+i+"c"+y);
                                tt.style.backgroundColor="rgba(144, 238, 144,0.5)";
                            }
                        }
                        else {
                            for(let j=y; j<y+szs[shipId]; j++){
                                const tt=document.getElementById("r"+x+"c"+j);
                                tt.style.backgroundColor="rgba(144, 238, 144,0.5)";
                            }
                        }
                    }
                });

                aux.addEventListener("dragleave", (e)=>{
                    e.preventDefault();
                    const shipId=Number(e.dataTransfer.getData("text/plain"));
                    const uwu=aux.id;
                    let x=Number(uwu[1]);
                    let y=Number(uwu[3]);
                    if(potPune(x,y,a,szs[shipId],ori[shipId])){
                        if(ori[shipId]==0){
                            for(let i=x; i<x+szs[shipId]; i++){
                                const tt=document.getElementById("r"+i+"c"+y);
                                tt.style.backgroundColor="white";
                            }
                        }
                        else {
                            for(let j=y; j<y+szs[shipId]; j++){
                                const tt=document.getElementById("r"+x+"c"+j);
                                tt.style.backgroundColor="white";
                            }
                        }
                    }
                });

                aux.addEventListener("drop", (e)=>{
                    e.preventDefault();
                    const shipId=Number(e.dataTransfer.getData("text/plain"));
                    const uwu=aux.id;
                    let x=Number(uwu[1]);
                    let y=Number(uwu[3]);
                    if(potPune(x,y,a,szs[shipId],ori[shipId])){
                        if(ori[shipId]==0){
                            for(let i=x; i<x+szs[shipId]; i++){
                                const tt=document.getElementById("r"+i+"c"+y);
                                tt.style.backgroundColor="rgba(222, 184, 135, 0.5)";
                                tt.style.border="2px solid burlywood";
                                a[i][y]=shipId;
                            }
                        }
                        else {
                            for(let j=y; j<y+szs[shipId]; j++){
                                const tt=document.getElementById("r"+x+"c"+j);
                                tt.style.backgroundColor="rgba(222, 184, 135, 0.5)";
                                tt.style.border="2px solid burlywood";
                                a[x][j]=shipId;
                            }
                        }
                        const yy=document.getElementById(String(shipId));
                        yy.remove();
                        const jj=document.getElementsByClassName("randomize")[0];
                        if(jj){
                            jj.remove();
                        }
                    }
                    else {
                         if(ori[shipId]==0){
                            for(let i=x; i<x+szs[shipId]; i++){
                                const tt=document.getElementById("r"+i+"c"+y);
                                tt.style.backgroundColor="white";
                            }
                        }
                        else {
                            for(let j=y; j<y+szs[shipId]; j++){
                                const tt=document.getElementById("r"+x+"c"+j);
                                tt.style.backgroundColor="white";
                            }
                        }
                    }
                });
            }
        }

        const shipDeck=document.getElementsByClassName("ship_deck")[0];
        const config = {childList: true, subtree: false };
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    // console.log("A child node has been added or removed.");
                    if(shipDeck.children.length==0){
                        const emptyShipDeck=new CustomEvent("emptyShipDeck");
                        shipDeck.dispatchEvent(emptyShipDeck);
                        break;
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(shipDeck, config);
        shipDeck.addEventListener("emptyShipDeck", (e)=>{
            shipDeck.remove();
            let p=document.createElement("div");
            p.classList.add("butonStart");
            p.innerHTML="Start Game";
            writeUp("Press the button to play");
            p.addEventListener("click", (e)=>{
                p.remove();
                gameLogic();
            });
            const jj=document.getElementsByClassName("randomize")[0];
            if(jj){
                jj.remove();
            }
            gameCont.appendChild(p);
        }, once=true);
    }

    function gameLogic() {
        b=genBoard();
        writeUp("");
        let bBoard=document.createElement("div");
        bBoard.classList.add("botboard");
        gameCont.appendChild(bBoard);
        for(let i=0; i<10; i++){
            for(let j=0; j<10; j++){
                let bt=document.createElement("div");
                bt.classList.add("botblock");
                bt.id="br"+i+"c"+j;
                bBoard.appendChild(bt);
            }
        }


        let turn=0;
        let sa=[];
        let sb=[];
        for(let i=0; i<10; i++){
            let aux1=[],aux2=[];
            for(let j=0; j<10; j++){
                aux1.push(0);
                aux2.push(0);
            }
            sa.push(aux1);
            sb.push(aux2);
        }

        function addClick(event){
            const s=event.target.id;
            let x=Number(s[2]),y=Number(s[4]);
            if(b[x][y]==0){
                event.target.innerHTML="M";
                event.target.style.backgroundColor="rgba(128, 128, 128, 0.3)";
                event.target.style.border="2px grey solid";
            }
            else {
                event.target.innerHTML="X";
                event.target.style.backgroundColor="rgba(255, 0, 0, 0.418)";
                event.target.style.border="2px red solid";
            }

            for(let i=0; i<10; i++){
                for(let j=0; j<10; j++){
                    if(sa[i][j]==0){
                        const uu=document.getElementById("br"+i+"c"+j);
                        uu.removeEventListener("click",addClick);
                    }
                }
            }
            sa[x][y]=1;
            if(b[x][y]==0){
                turn=1-turn;
                setTimeout(runGame,500);
            }
            else {
                let loccnt=0;
                for(let i=0; i<10; i++){
                    for(let j=0; j<10; j++){
                        if(sa[i][j]==1 && b[i][j]==b[x][y]){
                            loccnt++;
                        }
                    }
                }

                if(loccnt==szs[b[x][y]]){
                    for(let i=0; i<10; i++){
                        for(let j=0; j<10; j++){
                            if(sa[i][j]==1 && b[i][j]==b[x][y]){
                                for(let d=0; d<8; d++){
                                    let xn=i+dx[d];
                                    let yn=j+dy[d];
                                    if(inside(xn,yn) && b[xn][yn]==0){
                                        sa[xn][yn]=1;
                                        const ee=document.getElementById("br"+xn+"c"+yn);
                                        ee.innerHTML="M";
                                        ee.style.backgroundColor="rgba(128, 128, 128, 0.3)";
                                        ee.style.border="2px grey solid";
                                    }
                                }
                            }
                        }
                    }
                }

                for(let d=0; d<4; d++){
                    let xn=x+ddx[d];
                    let yn=y+ddy[d];
                    if(inside(xn,yn)){
                        const ee=document.getElementById("br"+xn+"c"+yn);
                        ee.innerHTML="M";
                        ee.style.backgroundColor="rgba(128, 128, 128, 0.3)";
                        ee.style.border="2px grey solid";
                        sa[xn][yn]=1;
                    }
                }
                setTimeout(runGame,500);
            }
        }

        function gameOver(a,b,sa,sb){
            let cnt=0;
            let cnt2=0;
            for(let i=0; i<10; i++){
                for(let j=0; j<10; j++){
                    if(sb[i][j]==1){
                        cnt++;
                    }
                    if(sa[i][j]==1){
                        cnt2++;
                    }
                }
            }

            if(cnt==100){
                return 1;
            }
            if(cnt2==100){
                return -1;
            }
            return 0;
        }   

        function chooseMove(a,sb){
            let posb=[];
            for(let i=0; i<10; i++){
                for(let j=0; j<10; j++){
                    if(sb[i][j]==0){
                        posb.push([0,i,j]);
                    }
                }
            }
            let rn=Math.floor(Math.random()*posb.length);
            return posb[rn];
        }

        function runGame(){
            if(gameOver(a,b,sa,sb)!=0){

                if(gameOver(a,b,sa,sb)==1){
                    const user=this.localStorage.getItem("player");
                    let cnt=localStorage.getItem(user+"|points");
                    cnt++;
                    localStorage.setItem(user+"|points",cnt);
                    writeSum(user+" | wins: "+cnt,document.getElementById("userinfo"));
                }

                setTimeout(()=>{
                    let p1=document.getElementsByClassName("board")[0];
                    let p2=document.getElementsByClassName("botboard")[0];
                    p1.remove();
                    p2.remove();
                    setUp();
                }, 3000);
            }
            else 
            {
                if(turn==0){
                    for(let i=0; i<10; i++){
                        for(let j=0; j<10; j++){
                            if(sa[i][j]==0){
                                const x=document.getElementById("br"+i+"c"+j);
                                x.addEventListener("click",addClick);
                            }
                        }
                    }
                }
                else {
                    let posibilitati=chooseMove(a,sb);
                    let x=posibilitati[1],y=posibilitati[2];
                    const yy=document.getElementById("r"+x+"c"+y);
                    sb[x][y]=1;

                    if(a[x][y]>0){
                        let loccnt=0;
                        for(let i=0; i<10; i++){
                            for(let j=0; j<10; j++){
                                if(sb[i][j]==1 && a[i][j]==a[x][y]){
                                    loccnt++;
                                }
                            }
                        }

                        if(loccnt==szs[a[x][y]]){
                            for(let i=0; i<10; i++){
                                for(let j=0; j<10; j++){
                                    if(sb[i][j]==1 && a[i][j]==a[x][y]){
                                        for(let d=0; d<8; d++){
                                            let xn=i+dx[d];
                                            let yn=j+dy[d];
                                            if(inside(xn,yn) && a[xn][yn]==0){
                                                sb[xn][yn]=1;
                                                const ee=document.getElementById("r"+xn+"c"+yn);
                                                ee.innerHTML="M";
                                                ee.style.backgroundColor="rgba(128, 128, 128, 0.3)";
                                                ee.style.border="2px grey solid";
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        for(let d=0; d<4; d++){
                            let xn=x+ddx[d];
                            let yn=y+ddy[d];
                            if(inside(xn,yn)){
                                sb[xn][yn]=1;
                                const ee=document.getElementById("r"+xn+"c"+yn);
                                ee.innerHTML="M";
                                ee.style.backgroundColor="rgba(128, 128, 128, 0.3)";
                                ee.style.border="2px grey solid";
                            }
                        }
                        yy.innerHTML="X";
                        yy.style.backgroundColor="rgba(255, 0, 0, 0.418)";
                        yy.style.border="2px red solid";
                        setTimeout(runGame,500);
                    }   
                    else {
                        turn=1-turn;
                        yy.innerHTML="M";
                        yy.style.backgroundColor="rgba(128, 128, 128, 0.3)";
                        yy.style.border="2px grey solid";
                        setTimeout(runGame,500);
                    }
                }
            }
        }
        runGame();
    }

    function genBoard() {
        let v=[];
        for(let i=1; i<=10; i++){
            let p=[];
            for(let j=1; j<=10; j++){
                p.push(0);
            }
            v.push(p);
        }

        for(let k=10; k>=1; k--){
            // caut toate pozitiile valide
            let valid=[];
            for(let i=0; i<10; i++){
                for(let j=0; j<10; j++){
                    if(v[i][j]==0 && i+szs[k]-1<10){
                        let ok=1;
                        for(let z=i; z<i+szs[k]; z++){
                            if(!ok){
                                break;
                            }
                            if(v[z][j]!=0){
                                ok=0;
                                break;
                            }
                            for(let d=0; d<8; d++){
                                let xn=z+dx[d];
                                let yn=j+dy[d];
                                if(inside(xn,yn) && v[xn][yn]!=0){
                                    ok=0;
                                    break;
                                }
                            }
                        }
                        if(ok){
                            valid.push([i,j,0]);
                        }
                    }

                    if(v[i][j]==0 && j+szs[k]-1<10){
                        let ok=1;
                        for(let z=j; z<j+szs[k]; z++){
                            if(!ok){
                                break;
                            }
                            if(v[i][z]!=0){
                                ok=0;
                                break;
                            }
                            for(let d=0; d<8; d++){
                                let xn=i+dx[d];
                                let yn=z+dy[d];
                                if(inside(xn,yn) && v[xn][yn]!=0){
                                    ok=0;
                                    break;
                                }
                            }
                        }
                        if(ok){
                            valid.push([i,j,1]);
                        }
                    }
                }
            }
            let rn=Math.floor(Math.random()*valid.length);
            if(valid[rn][2]==0){
                for(let z=valid[rn][0]; z<valid[rn][0]+szs[k]; z++){
                    v[z][valid[rn][1]]=k;
                }
            }
            else {
                for(let z=valid[rn][1]; z<valid[rn][1]+szs[k]; z++){
                    v[valid[rn][0]][z]=k;
                }
            }
        }
        return v;
    }
}