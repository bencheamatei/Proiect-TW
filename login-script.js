function validateForm() {
    const regex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const user=document.getElementById("n1").value;
    const passwd=document.getElementById("n2").value;
    for(let i=0; i<user.length; i++){
        if(user[i]=="@"){
            if(!regex.test(user)){
                return false;
            }
            break;
        }
    }
    return true;
}

window.onload=async function() {

    const colors=["coral", "crimson", "goldenrod", "indianeed", "indigo", "marron", "midnightblue", "teal", "red", "blue", "orange", "purple"];

    function changeColor(element){
        let care=Math.floor(Math.random()*colors.length);
        element.style.fill=colors[care];
    }

    for(let i=1; i<=3; i++){
        let s="barcuta"+i;
        let ss=document.getElementById(s);
        ss.style.animation=setInterval(changeColor,1000+500*i,ss);
    }

    const form=document.getElementById("form");
    form.addEventListener("submit", (event)=>{
        event.preventDefault();

        const user=document.getElementById("n1").value;
        const passwd=document.getElementById("n2").value;

        if(!validateForm()){
            this.alert("Invalid log in data");
        }
        else {
            this.fetch("./accounts.json")
                .then(resp=>resp.json())
                .then(users=>{
                    let cauta=users.find(x=>(x.username===user || x.email==user) && x.password===passwd);
                    if(cauta){
                        localStorage.setItem("player",user);
                        if(localStorage.getItem(user+"|points")==null){
                            localStorage.setItem(user+"|points","0");
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
                })
                .catch(error=>{
                    console.log("Error when trying to access the db");
                });
        }
    });
}