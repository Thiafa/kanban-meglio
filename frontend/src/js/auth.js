const URL = 'http://127.0.0.1:8000/api';
// Login
$(document).ready(function () {
  $('#form-login').submit(function (e) {
    e.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();

    if (email !== '' && password !== '') {
      const myInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'Application/json',
        },
        body: JSON.stringify({ email, password }),
      };

      fetch(URL + '/login', myInit)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Login failed');
          }
          return response.json();
        })
        .then(function (data) {
          const { id, access_token } = data;
          const expires = new Date(Date.now() + 86400 * 1000).toUTCString(); // 1 dia de expiração
          document.cookie = `user_id=${id}; expires=${expires}`;
          document.cookie = `access_token=${access_token}; expires=${expires}`;
          Swal.fire({
            title: 'Sucesso!',
            text: 'Usuário logado com sucesso!',
            icon: 'success',
          });
          setTimeout(function () {
            window.location.href = 'home.html';
          }, 1000);
        })
        .catch((error) => {
          console.log('ERROR!', error);
          Swal.fire({
            title: 'Erro!',
            text: 'Falha no login. Verifique suas credenciais.',
            icon: 'error',
          });
        });
    } else {
      Swal.fire({
        title: 'Erro!',
        text: 'Os campos de email e senha precisam ser preenchidos!',
        icon: 'error',
      });
    }
  });
});

// Logout
$(document).ready(function () {
  $('#logout').click(function (e) {
    e.preventDefault();
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${getCookie('access_token')}`,
      },
    };
    fetch(URL + '/logout', myInit)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Logout failed');
        }
        return response.json();
      })
      .then(function (data) {
        document.cookie =
          'user_id=; Max-Age=0; path=/; domain=' + location.host;
        document.cookie =
          'access_token=; Max-Age=0; path=/; domain=' + location.host;

        Swal.fire({
          title: 'Sucesso!',
          text: 'Logout realizado com sucesso!',
          icon: 'success',
        });

        window.location.href = 'login.html';
      })
      .catch(function (error) {
        console.error('ERROR!', error);
        Swal.fire({
          title: 'Erro!',
          text: 'Erro ao realizar logout. Por favor, tente novamente.',
          icon: 'error',
        });
      });
  });
});

$(document).ready(function () {
  $('#form-register').submit(function (e) {
    e.preventDefault();
    const nome = $('#nome').val();
    const email = $('#email').val();
    const password = $('#password').val();

    if (email !== '' && password !== '' && nome !== '') {
      const myInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'Application/json',
        },
        body: JSON.stringify({ name: nome, email, password }),
      };

      fetch(URL + '/register', myInit)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Register failed');
          }
          return response.json();
        })
        .then(function (data) {
          Swal.fire({
            title: 'Sucesso!',
            text: 'Usuário registrado com sucesso!',
            icon: 'success',
          });
          setTimeout(function () {
            window.location.href = 'login.html';
          }, 1000);
        })
        .catch((error) => {
          console.log('ERROR!', error);
          Swal.fire({
            title: 'Erro!',
            text: 'Falha no registro de usuário. Verifique suas credenciais.',
            icon: 'error',
          });
        });
    } else {
      Swal.fire({
        title: 'Erro!',
        text: 'Os campos de nome, email e senha precisam ser preenchidos!',
        icon: 'error',
      });
    }
  });
});
