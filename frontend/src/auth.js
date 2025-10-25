import { loginUser, signupUser } from "./api.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const messageDiv = document.getElementById('message');

    // ✅ LOGIN handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            try {
                const data = await loginUser(email, password);

                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', data.user.username);

                    messageDiv.textContent = "Login Successful. Redirecting...";
                    window.location.href = 'index.html';
                } else {
                    messageDiv.textContent = data.message || 'Invalid credentials';
                }
            } catch (err) {
                messageDiv.textContent = 'Login failed';
            }
        });
    }

    // ✅ SIGNUP handler
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            try {
                const data = await signupUser(username, email, password);

                if (data.message === 'User created successfully') {
                    messageDiv.textContent = "Signup successful. Please Login";
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 1500);
                } else {
                    messageDiv.textContent = data.message || 'Signup failed';
                }
            } catch (err) {
                messageDiv.textContent = 'Signup failed';
            }
        });
    }
});
