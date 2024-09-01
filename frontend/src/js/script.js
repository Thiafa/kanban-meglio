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
function putConfig(content) {
  return {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${getCookie('access_token')}`,
    },
    body: JSON.stringify(content),
  };
}

function deleteConfig(content) {
  return {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${getCookie('access_token')}`,
    },
  };
}

function appendColumn(item) {
  const newColumn = `
    <div class="card kanban-column" id=column${item.id}>
        <div class="card-header" style="background: ${item.color}">
          <h3 id="kanbam-column" item_id="${item.id}" item_color="${item.color}">${item.nome}</h3>
          <div>
          <i class="fa-solid fa-pen" id="pen-${item.id}"></i>
          <i class="fa-solid fa-xmark" id="trash-${item.id}"></i>
          </div>
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
  <div class="task-header">
  <h3 task_id="${item.id}">${item.titulo}</h3>
  <div>
  <i class="fa-solid fa-pen" id="pen-${item.id}"></i>
  <i class="fa-solid fa-xmark" id="trash-${item.id}"></i>
  </div>
  </div>
  <p id="descricao-${item.id}">${item.descricao}</p>
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
  const tasks = [];
  $('.connectedSortable-tasks').each(function () {
    const sectionId = $(this)
      .closest('.kanban-column')
      .attr('id')
      .replace('column', '');

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
      console.log('Ordenação de tarefas atualizada:', data);
    })
    .catch(function (error) {
      console.error('Erro ao atualizar a ordenação de tarefas:', error);
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

      fetch(
        URL + '/tarefas',
        postConfig({ titulo: titulo, descricao: descricao }),
      )
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Falha ao criar tarefa');
          }
          return response.json();
        })
        .then(function (response) {
          appendItem(response.data);
        })
        .catch(function (error) {
          console.log('Erro ao criar tarefa:', error);
        })
        .finally(function () {
          $('#taskItemModal').hide();
        });
    });
  $('.close').click(function () {
    $('#taskItemModal').hide();
  });
});

// Tarefa
$(document).ready(function () {
  // Buscar Tarefas
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
        console.log('Erro ao buscar tarefas:', error);
      })
      .finally(function () {
        initializeSortable();
      });
  });

  // Deletar Tarefa
  $('.card-list').on('click', '.kanban-item-tasks .fa-xmark', function () {
    $('#taskItemModalDelete').show();
    $('#taskColumnModalEdit').hide();

    id = $(this).closest('.kanban-item-tasks').attr('id').replace('task', '');
    $('#delete-item')
      .off('click')
      .on('click', function (e) {
        fetch(URL + `/tarefas/${id}`, deleteConfig())
          .then(function (response) {
            if (!response.ok) {
              throw new Error('Falha ao deletar tarefa');
            }
            return response.json();
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log('Erro ao deletar tarefa:', error);
          })
          .finally(function () {
            reOrderKanbanOrder();
            $('#taskItemModalDelete').hide();
          });
        console.log($(this).closest($(this).attr('id')));
      });
    $('.close').click(function () {
      $('#taskItemModalDelete').hide();
      $('#taskItemModalDelete').hide();
    });
  });
  // Atualizar Tarefa
  $('.card-list').on('click', '.kanban-item-tasks .fa-pen', function () {
    var id = $(this)
      .closest('.kanban-item-tasks')
      .attr('id')
      .replace('task', '');
    var titulo = $(this).closest('.kanban-item-tasks').find('h3').text();
    var descricao = $(this).closest('.kanban-item-tasks').find('p').text();
    $('#taskItemModalLabelEdit').text('Editar Tarefa ' + titulo);
    $('#taskItemModalEdit').show();
    $('#taskColumnModalEdit').hide();
    $('#titulo-edit').val(titulo);
    $('#descricao-edit').val(descricao);
    $('#edit-item')
      .off('click')
      .on('click', function (e) {
        const titulo = $('#titulo-edit').val();
        const descricao = $('#descricao-edit').val();
        fetch(
          URL + `/tarefas/${id}`,
          putConfig({ titulo: titulo, descricao: descricao }),
        )
          .then(function (response) {
            if (!response.ok) {
              throw new Error('Falha ao criar tarefa');
            }
            return response.json();
          })
          .then(function (response) {
            reOrderKanbanOrder();
          })
          .catch(function (error) {
            console.log('Erro ao criar tarefa:', error);
          })
          .finally(function () {
            $('#taskItemModalEdit').hide();
          });
      });
    reOrderKanbanOrder();
    $('.close').click(function () {
      $('#taskItemModalEdit').hide();
    });
  });
});
// Atualizar Coluna
$('.card-list').on('click', '.kanban-column .fa-pen', function () {
  $('#taskColumnModalEdit').show();
  // $('#taskItemModalEdit').hide();
  var id = $(this).closest('.kanban-column').attr('id').replace('column', '');
  var nome = $(`.card-header h3[item_id="${id}"]`).text();
  var color = $(`.card-header h3[item_id="${id}"]`).attr('item_color');
  $('#nome-column').val(nome);
  $('#color-column').val(color);
  $('#edit-column')
    .off('click')
    .on('click', function (e) {
      const nome = $('#nome-column').val();
      const color = $('#color-column').val();
      fetch(URL + `/colunas/${id}`, putConfig({ nome: nome, color: color }))
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Falha ao criar tarefa');
          }
          return response.json();
        })
        .then(function (response) {
          console.log(response);
          reOrderKanbanOrder();
        })
        .catch(function (error) {
          console.log('Erro ao criar tarefa:', error);
        })
        .finally(function () {
          $('#taskColumnModalEdit').hide();
          $('#taskItemModalEdit').hide();
        });
    });
  $('.close').click(function () {
    $('.modal').hide();
  });
});

$('.card-list').on('click', '.kanban-column .fa-xmark', function () {
  $('#taskItemModalDelete').show();
  $('.close').click(function () {
    $('#taskItemModalDelete').hide();
  });
});

// Quando o botão de deletar coluna for clicado
$('.card-list').on('click', '.kanban-column .fa-xmark', function () {
  var id = $(this).closest('.kanban-column').attr('id').replace('column', '');

  $('#delete-column')
    .off('click')
    .on('click', function (e) {
      fetch(URL + `/colunas/${id}`, deleteConfig())
        .then((response) => {
          if (!response.ok) {
            throw new Error('Falha ao deletar coluna');
          }
          return response.json();
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.error('Erro ao deletar coluna:', error);
        })
        .finally(function () {
          reOrderColumnOrder();
        });
    });
  $('.close').click(function () {
    $('#columnItemModalDelete').hide();
  });
});
