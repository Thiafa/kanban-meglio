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
          Accept: 'application/json',
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
          date = new Date();
          const { id, access_token } = data;
          expires = new Date(Date.now() + 86400 * 1000).toUTCString();
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
            text: error,
            title: 'ERROR!',
            icon: 'error',
          });
        });
    } else {
      Swal.fire({
        title: 'ERROR!',
        text: 'O campos precisam ser preenchidos!',
        icon: 'error',
      });
      console.log('Os campos preecisam ser preenchidos!');
    }
  });
});

// Logout
$(document).ready(function () {
  $('#logout').click(function (e) {
    e.preventDefault();
    var cookies = document.cookie.split(';');
    var expire = new Date();
    for (var i = 0; i < cookies.length; i++) {
      cookie = cookies[i].split('=')[0];
      expire.setDate(expire.getDate() - 1);
      document.cookie = `access_token=; expires=' ${expire}`;
      document.cookie = `user_id=; expires='  ${expire}`;
    }
    Swal.fire({
      title: 'Sucesso!',
      text: 'Usuário deslogado com sucesso!',
      icon: 'success',
    });

    setTimeout(function () {
      window.location.href = 'login.html';
    }, 1000);
  });
});

$(document).ready(function () {
  // Função para inicializar sortable
  function initializeSortable() {
    $('.card-list')
      .sortable({
        connectWith: '.card-list',
        placeholder: 'card-item-placeholder',
        beforeStop: function (event, ui) {
          console.log('Task moved');
          $('.card-list').each(function () {
            $(this)
              .find('.card-item')
              .each(function (index) {
                const taskId = $(this).data('card-item');
                console.log(`Task ID: ${taskId}, New Position: ${index}`);
              });
          });
        },
      })
      .disableSelection();
    $('.card-content')
      .sortable({
        connectWith: '.card-content',
        placeholder: 'card-item-placeholder',
        stop: function (event, ui) {
          console.log('Task moved');
          $('.card-content').each(function () {
            $(this)
              .find('.card-item')
              .each(function (index) {
                const taskId = $(this).data('card-item');
                console.log(`Task ID: ${taskId}, New Position: ${index}`);
              });
          });
        },
      })
      .disableSelection();
  }

  initializeSortable();

  // Criar nova tarefa
  $('#create-task').click(function () {
    const newTask = $('<div class="card-item">Nova Tarefa</div>');
    $('.card-content').first().append(newTask);
  });

  // Criar nova coluna
  $('#criar-coluna').click(function () {
    const newColumn = $(`
      <div class="card">
        <div class="card-header">Nova Coluna</div>
        <div class="card-content"></div>
      </div>
    `);
    $('.card-list').first().append(newColumn);
    initializeSortable();
  });
});
