function validateForm() {
    const regex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regex2=/^.{4,1000}$/;
    const user=document.getElementById("n1").value;
    const passwd=document.getElementById("n2").value;
    for(let i=0; i<user.length; i++){
        if(user[i]=="@"){
            if(!regex.test(user)){
                return -1;
            }
            break;
        }
    }

    if(!regex2.test(passwd)){
        return -2;
    }

    return 0;
}

window.onload=async function() {
    let users=null;
    try {
        const resp=await fetch("./accounts.json");
        let uusers=await resp.json();
        users=uusers;
    }   
    catch(error) {
        console.error(error);
    }

    const colors=["coral", "crimson", "goldenrod", "indianeed", "indigo", "marron", "midnightblue", "teal", "red", "blue", "orange", "purple"];
    const start=Date.now();

    function changeColor(element){
        let care=Math.floor(Math.random()*1000000);
        let ms=((Date.now()-start)^care)%colors.length;
        element.style.fill=colors[ms];

        // mai schimb si marimea 
        let hcand=40+Math.floor(Math.random()*15);
        element.style.height=`${hcand}px`;
    }

    for(let i=1; i<=3; i++){
        let s="barcuta"+i;
        let ss=document.getElementById(s);
        ss.style.animation=setInterval(changeColor,1000+500*i,ss);
    }

    const form=document.getElementById("form");
    form.addEventListener("submit", (event)=>{
        event.preventDefault();

        let user=document.getElementById("n1").value;
        const passwd=document.getElementById("n2").value;
        let porecla=document.getElementById("n7").value;
        const pup=validateForm();
        if(pup<0){
            if(pup==-1){
                this.alert("Invalid email format");
            }
            else {
                this.alert("Password should be at least 4 characters");
            }
        }
        else {
            cauta=false;
            for(let i=0; i<users.length; i++){
                if((users[i].email==user || users[i].username==user) && users[i].password==passwd){
                    cauta=true;
                    user=users[i].username;
                    break;
                }
            }

            if(cauta){
                localStorage.setItem("player",user);
                localStorage.setItem("playernickname",porecla);
                
                if(localStorage.getItem(user+"|points")==null){
                    localStorage.setItem(user+"|points","0");
                }
                if(localStorage.getItem(user+"|losses")==null){
                    localStorage.setItem(user+"|losses","0");
                }
                setTimeout(()=>{
                    let tt=document.getElementsByClassName("question")[0];
                    tt.style.display="block";
                    tt=document.getElementsByTagName("a")[0];
                    tt.setAttribute("href",localStorage.getItem("lastseen"));
                    console.log(localStorage.getItem("lastseen"));
                },500);
            }
            else {
                this.alert("Invalid username or password");
            }
        }
    });

    const tcont=this.document.getElementsByClassName("container")[0];
    tcont.addEventListener("click", (e)=>{

    });
}