const frm = document.getElementById('loginForm');
const btn = document.getElementById('sub');

// import path from 'path';
// import { fileURLToPath } from 'url';

//      // These two lines replace the old __dirname
//      const __filename = fileURLToPath(import.meta.url);
//      const __dirname  = path.dirname(__filename);

//      console.log(__dirname);


frm.addEventListener('submit',async (e)=>{
    e.preventDefault();
        
    const uId = document.getElementById('username');
    const pswd = document.getElementById('password');

    const data={
        userName:uId.value,
        password:pswd.value
    }
 
    try{
    const response = await fetch('/api/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const rdata = await response.json();
        if (!response.ok) {
            console.log("I P/I");
            console.log(rdata.message);
            console.log("body:",rdata);
            throw new Error('Login failed');
        }

        console.log(`Welcome ${uId.value}, You are logged in!!!`);
        //console.log(`jwt tkn :- ${rdata.accessToken}`);
        localStorage.setItem('token',rdata.accessToken);
        // console.log(rdata);
        window.location.href = "dashboard.html";
            

    }catch(err){
        console.log(`error in fetch, error ${err}`);
    }


});
