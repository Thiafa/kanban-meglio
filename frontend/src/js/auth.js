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
        Accept: 'Application/json',
        Authorization: `Bearer ${getCookie('access_token')}`,
      },
    };
    fetch(URL + '/logout', myInit)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then(function (response) {
        if (response.ok) {
          document.cookie.split(';').forEach(function (c) {
            console.log(c);
            document.cookie = c
              .replace(/^ +/, '')
              .replace(
                /=.*/,
                '=;expires=' + new Date().toUTCString() + ';path=/',
              );
          });
        }
        setTimeout(function () {
          window.location.href = 'login.html';
        }, 1000);
      })
      .catch(function (e) {
        console.error('ERROR!', e);
        Swal.fire({
          title: 'Erro!',
          text: e,
          icon: 'error',
        });
      });
  });
});
