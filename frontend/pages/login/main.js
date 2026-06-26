function togglePassword(){
    const passwordInput = document.getElementById("password")
    const eyeIcon = document.querySelector(".eye-icon")

    if (passwordInput.type === "password"){
        passwordInput.type = "text"
        eyeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`
    }else {
        passwordInput.type = "password"
        eyeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`
    }
}

document.querySelector(".form-box").addEventListener("submit", async (e) => {
    e.preventDefault(); // ❗ stops page reload

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:4000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            
            localStorage.setItem("token", data.token);
            // JWT save (later)
           // localStorage.setItem("token", data.token);
            window.location.href = "../dashboard/dashboard.html";

        } else {
            console.log(data.message);
        }

    } catch (err) {
        console.error(err);
    }
});


document.getElementById('signupBtn').addEventListener("click", async (e) => {
    e.preventDefault(); // ❗ stops page reload

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:4000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            

            // JWT save (later)
           // localStorage.setItem("token", data.token);
           window.location.href = "./login.html";

        } else {
            console.log(data.message);
        }

    } catch (err) {
        console.error(err);
    }
});
