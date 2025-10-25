document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const messageDiv = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const data = await login(email, password);
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', data.user.username);
                    window.location.href = 'index.html';
                } else {
                    messageDiv.textContent = data.message;
                }
            } catch (err) {
                messageDiv.textContent = 'Login failed';
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const data = await signup(username, email, password);
                if (data.message === 'User created successfully') {
                    messageDiv.textContent = 'Sign up successful! Please login.';
                } else {
                    messageDiv.textContent = data.message;
                }
            } catch (err) {
                messageDiv.textContent = 'Sign up failed';
            }
        });
    }
});
