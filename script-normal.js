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
    // scrie in bara de sus 
    const u=document.getElementsByTagName("header")[0];
    u.innerHTML=s;
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
    const gameCont=document.getElementsByClassName("game_container")[0];

    // functia setup pregateste fereastra ca jucatorul (uman sa isi puna piesele)
    // trebuie ca aici sa adaug tabla de joc pentru jucator si piesele pe care sa le puna pe ea
    // trebuie sa gener de asemenea un buton care sa apara doar atunci cand toate piesele au fost asezate
    
    let a=[]; // the player matrix 
    let b=[]; // the bot matrix
    for(let i=0; i<10; i++){
        let auxx=[];
        for(let j=0; j<10; j++){
            auxx.push(0);
        }
        a.push(auxx);
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
                        uu.style.backgroundColor="rgba(0, 0, 255, 0.5)";
                        uu.style.border="2px solid blue";
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
                                tt.style.backgroundColor="rgba(0, 0, 255, 0.5)";
                                tt.style.border="2px solid blue";
                                a[i][y]=shipId;
                            }
                        }
                        else {
                            for(let j=y; j<y+szs[shipId]; j++){
                                const tt=document.getElementById("r"+x+"c"+j);
                                tt.style.backgroundColor="rgba(0, 0, 255, 0.5)";
                                tt.style.border="2px solid blue";
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
            let ok=1;
            for(let i=0; i<10; i++){
                for(let j=0; j<10; j++){
                    if(b[i][j]>0 && sa[i][j]==0){
                        ok=0;
                    }
                }
            }
            if(ok){
                return 1;
            }

            ok=1;
            for(let i=0; i<10; i++){
                for(let j=0; j<10; j++){
                    if(a[i][j]>0 && sb[i][j]==0){
                        ok=0;
                    }
                }
            }
            if(ok){
                return -1;
            }
            return 0;
        }   

        function chooseMove(a,sb){
            // caut cea mai ok mutare pentru calculator (cumva tot random o sa fie)
            // singura chestie care chiar trebuie bagata e ca atunci cand nimereste o nava sa o caute pana la capat
            fq=[];
            for(let i=0; i<=10; i++){
                fq.push(0);
            }
            for(let i=0; i<10; i++){
                for(let j=0; j<10; j++){
                    if(sb[i][j]==1 && a[i][j]>0){
                        fq[a[i][j]]++;
                    }
                }
            }
            for(let p=10; p>=1; p--){
                if(fq[p]>0 && fq[p]<szs[p]){
                    if(fq[p]==1){
                        for(let i=0; i<10; i++){
                            for(let j=0; j<10; j++){
                                if(sb[i][j]==1 && a[i][j]==p){
                                    //console.log(i,j);
                                    let posb=[];
                                    if(inside(i-1,j) && sb[i-1][j]==0){
                                        posb.push([i-1,j]);
                                    }
                                    if(inside(i+1,j) && sb[i+1][j]==0){
                                        posb.push([i+1,j]);
                                    }
                                    if(inside(i,j+1) && sb[i][j+1]==0){
                                        posb.push([i,j+1]);
                                    }
                                    if(inside(i,j-1) && sb[i][j-1]==0){
                                        posb.push([i,j-1]);
                                    }

                                    let rp=Math.floor(Math.random()*posb.length);
                                    return [67,posb[rp][0],posb[rp][1]];
                                }
                            }
                        }
                        break;
                    }
                    else {
                        // vreau sa aflu daca caut ceva vertical sau orizontal 
                        let mn=100,mx=-100;
                        let p1=-1,p2=-1;
                        for(let i=0; i<10; i++){
                            for(let j=0; j<10; j++){
                                if(sb[i][j]==1 && a[i][j]==p){
                                    if(i<mn){
                                        mn=i;
                                        p1=j;
                                    }
                                    if(i>=mx){
                                        mx=i;
                                        p2=j;
                                    }
                                }
                            }
                        }

                        if(mx==mn){
                            // trebuie sa caut pe orizontala
                            for(let i=0; i<10; i++){
                                for(let j=0; j<10; j++){
                                    if(sb[i][j]==1 && a[i][j]==p){
                                        if(j<mn){
                                            mn=j;
                                            p1=i;
                                        }
                                        if(j>=mx){
                                            mx=j;
                                            p2=i;
                                        }
                                    }
                                }
                            }

                            if(mn!=mx-1 && (sb[p1][mn+1]==0 || sb[p2][mx-1]==0)){
                                if(sb[p1][mn+1]==0){
                                    return [67,p1,mn+1];
                                }
                                else {
                                    return [67,p2,mx-1];
                                }
                            }
                            else {
                                if(inside(p1,mn-1) && sb[p1][mn-1]==0){
                                    return [67,p1,mn-1];
                                }
                                if(inside(p2,mx+1) && sb[p2][mx+1]==0){
                                    return [67,p2,mx+1];
                                }
                            }
                        }
                        else {
                            // caut pe verticala
                            if(mn!=mx-1 && (sb[mn+1][p1]==0 || sb[mx-1][p2]==0)){
                                if(sb[mn+1][p1]==0){
                                    return [67,mn+1,p1];
                                }
                                else {
                                    return [67,mx-1,p2];
                                }
                            }
                            else {
                                if(inside(mn-1,p1) && sb[mn-1][p1]==0){
                                    return [67,mn-1,p1];
                                }
                                if(inside(mx+1,p2) && sb[mx+1][p2]==0){
                                    return [67,mx+1,p2];
                                }
                            }
                        }
                    }
                    break;
                }
            }

            mx=[0,-1,-1];
            for(let i=0; i<10; i++){
                for(let j=0; j<10; j++){
                    if(sb[i][j]==0){
                        let val=0;
                        for(let k=0; k<4; k++){
                            if(i+k<10 && sb[i+k][j]==0){
                                val++;
                            }
                            else {
                                break;
                            }
                        }

                        for(let k=0; k<4; k++){
                            if(j+k<10 && sb[i][j+k]==0){
                                val++;
                            }
                            else {
                                break;
                            }
                        }

                        for(let k=0; k<4; k++){
                            if(i-k>=0 && sb[i-k][j]==0){
                                val++;
                            }
                            else {
                                break;
                            }
                        }

                        for(let k=0; k<4; k++){
                            if(j-k<10 && sb[i][j-k]==0){
                                val++;
                            }
                            else {
                                break;
                            }
                        }
                        val+=(Math.abs(i-5)+Math.abs(j-5));
                        if(val>mx[0]){
                            mx=[val,i,j];
                        }
                    }
                }
            }
            return mx;
        }

        function runGame(){
            if(gameOver(a,b,sa,sb)!=0){
                setTimeout(()=>{
                    let p1=document.getElementsByClassName("board")[0];
                    let p2=document.getElementsByClassName("botboard")[0];
                    p1.remove();
                    p2.remove();
                    setUp();
                }, 500);
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
    setUp();
}