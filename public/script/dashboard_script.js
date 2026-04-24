// for responsive -
const contPane = document.getElementById('contact_pane');
const ctbox = document.getElementById('chatbox');



const list = document.getElementById('cn');   // Only this is needed
const iid= document.getElementById('userId');
const divParent = document.getElementById('chats') ;



// back buttton 
const bkbtn = document.getElementById('backBtn');
bkbtn.addEventListener('click',()=>{
    contPane.style.display= "block";
    ctbox.style.display= "none";
});






async function loaddashboard() {
    try {
        
        const res = await fetch('/render/dashboard');
        
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();        // ← Fixed: was using 'response'

        list.innerHTML = '';                  // Clear previous list

        data.forEach(name => {
            const li = document.createElement('li');
            const Cbox = document.createElement('div');
            
            //contact card
            li.textContent = name;
            li.classList.add("contactCard");
            
            //chatbox @ contact card
            Cbox.classList.add("msgBox");
            Cbox.dataset.user = name;
            Cbox.innerHTML = ` 
                <ul class="message-list ulll" id="messages-${name}"></ul>
            `;
            divParent.appendChild(Cbox);

            // normal event for desktop size
            li.addEventListener('click',(e)=>{
                iid.innerHTML='';
                iid.innerText=name;
                
                const els = document.querySelectorAll('.msgBox');
                els.forEach((el)=>{
                    // const target = el.getAttribute('data-user')=== name;
                    // if(target){
                    //     el.style.display = "block";
                    // } else {
                    //     el.style.display = "none"; 
                    // }
                    el.style.display = el.dataset.user === name ? "block" : "none";

                });

            });


            // Event for mobile size
            li.addEventListener('click',(e)=>{
                
                
                let ismobile = window.innerWidth <=420;
                if(ismobile){
                    contPane.style.display= "none";
                    ctbox.style.display= "block";
                }

            });

            list.appendChild(li);
        });

        console.log("Dashboard loaded successfully:", data);

    } catch (err) {
        console.error("Fetch error:", err);
    }
}

