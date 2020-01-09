const jsonServerUrl = 'http://localhost:3000/projects';
const active = 'ACTIVE';
const pending = 'PENDING';
const closed = 'CLOSED';
let tableBody = document.getElementsByTagName('tbody')[0];
let projectData = getItemData();

function renderProjectList(data) {
  data.forEach(project => {
    let newRow = document.createElement('tr');
    newRow.setAttribute('project-id', project.id);
    newRow.innerHTML = `
    <td>${project.name}</td>
    <td><div class="project-description">${project.description}</div></td>
    <td>${project.endTime}</td>
    <td class="project-status">${project.status}</td>
    <td><div class="delete-icon">删除</div></td>`;
    tableBody.appendChild(newRow);
  });
}

function renderStatusColor() {
  let statusEls = document.getElementsByClassName('project-status');
  Array.prototype.forEach.call(statusEls, tdEl => { setTdColor(tdEl) });
  function setTdColor(tdEl) {
    switch (tdEl.textContent) {
      case active:
        tdEl.style.color = '#666666';
        break;
      case pending:
        tdEl.style.color = '#ee706d';
        break;
      case closed:
        tdEl.style.color = '#f7da47';
        break;
    }
  }
}



function getItemData() {
  let tmpData = null;
  let getAJAXJsonOption = {
    url: jsonServerUrl,
    method: 'GET',
    success: function (responseText) {
      renderProjectList(responseText);
      renderStatusColor();
    },
    fail: function (error) {
      console.log('get data error')
    }
  }
  ajaxJsonHandle(getAJAXJsonOption);
}

function deleteItemData(id) {
  let deleteAJAXJsonOption = {
    url: jsonServerUrl + '/' + id,
    method: 'DELETE',
    success: function (result) {
      console.log('delete succeed')
    },
    fail: function (error) {
      console.log('delete data error')
    }
  };
  ajaxJsonHandle(deleteAJAXJsonOption);
}

function ajaxJsonHandle(options) {
  const AJAXSetup = {
    url: options.url || "",
    method: options.method.toUpperCase() || "GET",
    headers: options.headers || {},
    data: options.data || null,
    success: options.success || function (result) { },
    fail: options.fail || function (error) { }
  }
  var xhttp = new XMLHttpRequest();
  xhttp.onload = () => {
    AJAXSetup.success(JSON.parse(xhttp.responseText));
  };
  xhttp.onerror = () => {
    AJAXSetup.fail(xhttp.status);
  };
  xhttp.open(AJAXSetup.method, AJAXSetup.url);
  if (('POST' === AJAXSetup.method) || ('PUT' === AJAXSetup.method)) {
    xhttp.setRequestHeader('content-type', 'application/json');
    AJAXSetup.data = JSON.stringify(AJAXSetup.data);
  }
  xhttp.send(AJAXSetup.data);
}