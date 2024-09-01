const URL = 'http://127.0.0.1:8000/api';

function getCookie(name) {
  let cookie = {};
  document.cookie.split(';').forEach(function (el) {
    let [k, v] = el.split('=');
    cookie[k.trim()] = v;
  });
  return cookie[name];
}

function getConfig() {
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getCookie('access_token')}`,
      Accept: 'application/json',
    },
  };
}

function postConfig(content) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${getCookie('access_token')}`,
    },
    body: JSON.stringify(content),
  };
}

function appendColumn(item) {
  const newColumn = `
    <div class="card kanban-column" item_id="asd" id=column${item.id}>
        <div class="card-header" style="background: ${item.color}">
          <h3 id="kanbam-column" item_id="${item.id}" item_color="${item.color}">${item.nome}</h3>
        </div>
        <div class="card-content connectedSortable-tasks">
        </div>
    </div>`;
  $('#quadro').append(newColumn);
  Column();
}

function Column() {
  $('.connectedSortable')
    .sortable({
      connectWith: '.connectedSortable',
      placeholder: 'card-item-placeholder',
      stop: function (event, ui) {
        reOrderColumnOrder();
      },
    })
    .disableSelection();
}

var currentSection = '';
var addOrUpdate = null;
var selectedTask = null;

$(function () {
  fetch(URL + '/colunas', getConfig())
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    })
    .then(function (data) {
      data.data.forEach((item) => {
        appendColumn(item);
      });
    })
    .catch(function (error) {
      console.error('Erro ao buscar colunas:', error);
    })
    .finally(function () {
      initializeSortable();
    });
});
function reOrderColumnOrder() {
  const tasks = [];
  $('.connectedSortable').each(function () {
    const sectionId = $(this).attr('id');
    $(this)
      .children('.kanban-column')
      .each(function (index) {
        tasks.push({
          id: $(this).find('#kanbam-column').attr('item_id'),
          nome: $(this).find('#kanbam-column').text(),
          status: sectionId,
          color: $(this).find('#kanbam-column').attr('item_color'),
          order: index,
        });
      });
  });
  fetch(URL + '/colunas/reordenar', postConfig(tasks))
    .then(function (response) {
      if (!response.ok) {
        throw new Error('erro');
      }
      return response.json();
    })
    .catch(function (error) {
      console.error(error);
    });
}
$('#create-column').click(function (e) {
  $('#taskColumnModalLabel').text('Adicionar Colunas');
  $('#nome').val('');
  $('#color').val('');
  $('#taskColumnModal').show();

  $('#save-column')
    .off('click')
    .on('click', function (e) {
      e.preventDefault();
      const nome = $('#nome').val();
      const color = $('#color').val();
      if (nome && color) {
        fetch(URL + '/colunas', postConfig({ nome: nome, color: color }))
          .then(function (response) {
            if (!response.ok) {
              throw new Error('Falha ao criar coluna');
            }
            return response.json();
          })
          .then(function (response) {
            appendColumn(response.data);
            initializeSortable(); // Reinitialize sortable after adding new column
            $('#taskColumnModal').hide();
          })
          .catch(function (error) {
            console.error('Erro ao criar coluna:', error);
            Swal.fire({
              title: 'Erro!',
              text: error.message,
              icon: 'error',
            });
          });
      }
    });

  $('.close').click(function () {
    $('#taskColumnModal').hide();
  });
});

function initializeSortable() {
  $('.connectedSortable')
    .sortable({
      connectWith: '.connectedSortable',
      placeholder: 'card-item-placeholder',
      stop: function (event, ui) {
        console.log('Task moved');
        reOrderColumnOrder();
      },
    })
    .disableSelection();
}

// Tarefas

function appendItem(item) {
  const newitem = `
  <div class="card-item kanban-item-tasks" id="task${item.id}">
    <h3 task_id="${item.id}">${item.titulo}</h3>
    <p>${item.descricao}</p>
  </div>`;
  const targetColumn = $(`#column${item.status} .connectedSortable-tasks`);

  if (targetColumn.length) {
    targetColumn.append(newitem);
  } else {
    $('.connectedSortable-tasks').first().append(newitem);
  }
  initializeSortableItem();
}

function Item() {
  $('.connectedSortable-tasks')
    .sortable({
      connectWith: '.connectedSortable-tasks',
      placeholder: 'card-item-placeholder',
      stop: function (event, ui) {
        reOrderKanbanOrder();
      },
    })
    .disableSelection();
}

function initializeSortableItem() {
  $('.connectedSortable-tasks')
    .sortable({
      connectWith: '.connectedSortable-tasks',
      placeholder: 'card-item-placeholder',
      stop: function (event, ui) {
        console.log('Task moved');
        reOrderKanbanOrder();
      },
    })
    .disableSelection();
}

function reOrderKanbanOrder() {
  var tasks = [];
  $('.connectedSortable-tasks').each(function () {
    var sectionId = $(this)
      .closest('.kanban-column')
      .attr('id')
      .replace('column', '');
    console.log(sectionId);

    $(this)
      .children('.kanban-item-tasks')
      .each(function (index) {
        tasks.push({
          id: $(this).attr('id').replace('task', ''),
          titulo: $(this).find('h3').text(),
          status: sectionId,
          order: index,
        });
      });
  });

  fetch(URL + '/tarefas/reordenar', postConfig(tasks))
    .then(function (response) {
      if (!response.ok) {
        throw new Error('erro');
      }
      return response.json();
    })
    .then(function (data) {
      console.log('Ordenação atualizada:', data);
    })
    .catch(function (error) {
      console.error(error);
    });
}

// Criar Tarefas
$('#create-task').click(function (e) {
  $('#taskItemModalLabel').text('Adicionar Tarefa');
  $('#titulo').val('');
  $('#descricao').val('');
  $('#taskItemModal').show();

  $('#save-item')
    .off('click')
    .on('click', function (e) {
      const titulo = $('#titulo').val();
      const descricao = $('#descricao').val();
      const status = $('.connectedSortable-tasks');

      fetch(
        URL + '/tarefas',
        postConfig({ titulo: titulo, descricao: descricao }),
      )
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Falha ao criar coluna');
          }
          return response.json();
        })
        .then(function (response) {
          console.log(response);
          appendItem(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          $('.taskItemModal').hide();
        });
    });
});

$(function () {
  fetch(URL + '/tarefas', getConfig())
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Erro');
      }
      return response.json();
    })
    .then(function (data) {
      data.data.forEach((item) => {
        appendItem(item);
      });
    })
    .catch(function (error) {
      console.error('Erro ao buscar colunas:', error);
    })
    .finally(function () {
      // initializeSortable();
    });
});
