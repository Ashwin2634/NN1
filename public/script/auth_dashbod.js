
//--------------------------auth the dashboard------------------------------

async function loadDashboard(){
    const token = localStorage.getItem('token');

    if(!token){
        console.log('no active session');
        window.location.href = 'login.html';
    }

    try{

        const response = await fetch('/api/user',{
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if(response.ok){
            const data = await response.json();
            console.log("we are here !!!");
            document.getElementById('currentUser').textContent = data.username;
            localStorage.setItem('SocketId',data.SocketId);


        }else{
            localStorage.removeItem('token');
            window.location.replace('/login.html');
        }


    }catch(error){
        console.log(error);
        localStorage.removeItem('token');
        setTimeout(() => {
            window.location.replace('/login.html');
        }, 5000);
        
    }


    // document.getElementById('logout').addEventListener('click', () => {
    //     localStorage.removeItem('token');
    //     window.location.replace('/login.html');
    // });




}
