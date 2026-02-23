async function submitComplaint(){

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;
    const message = document.getElementById("message").value;

    const res = await fetch("http://localhost:5000/addComplaint",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name,email,department,message})
    });

    const data = await res.json();
    alert(data.message);
}

async function register(){

    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch("http://localhost:5000/adminRegister",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,password})
    });

    const data = await res.json();
    alert(data.message);

    if(data.message==="Admin Registered"){
        window.location.href="admin.html";
    }
}

async function login(){

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:5000/adminLogin",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,password})
    });

    const data = await res.json();

    if(data.token){
        localStorage.setItem("token",data.token);
        window.location.href="dashboard.html";
    }else{
        alert(data.message);
    }
}

async function loadComplaints(){

    const token = localStorage.getItem("token");
    if(!token){
        window.location.href="admin.html";
        return;
    }

    const res = await fetch("http://localhost:5000/getComplaints",{
        headers:{authorization:token}
    });

    const data = await res.json();

    const container = document.getElementById("complaints");
    if(container){
        container.innerHTML="";
        data.forEach(c=>{
            container.innerHTML+=`
            <div class="card">
                <p><b>Name:</b> ${c.name}</p>
                <p><b>Email:</b> ${c.email}</p>
                <p><b>Department:</b> ${c.department}</p>
                <p><b>Message:</b> ${c.message}</p>
            </div>
            `;
        });
    }
}

function logout(){
    localStorage.removeItem("token");
    window.location.href="admin.html";
}

loadComplaints();