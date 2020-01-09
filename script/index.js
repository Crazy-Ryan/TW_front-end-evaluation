const jsonServerUrl = 'http://localhost:3000/projects';
const active = 'ACTIVE';
const pending = 'PENDING';
const closed = 'CLOSED';
let projectToDeleteEl;
let tableBody = document.getElementsByTagName('tbody')[0];
let deletePopup= document.getElementsByClassName('delete-popup')[0];
let projectData = getItemData();
let unresolvedTaskCount = 0;
let processingTaskCount = 0;
let resolvedTaskCount = 0;

function loadPage(projectData) {
  renderProjectList(projectData);
  renderStatusColor();
  countTasks(projectData);
  updateStatistics();
}

function onClickInterface(event) {
  const deleteIcon = 'delete-icon';
  const confirmBtn = 'confirm-btn';
  const cancelBtn = 'cancel-btn';
  const closeBtn = 'iconfont icon-guanbi';
  let clickClass = event.target.getAttribute('class');

  switch (clickClass) {
    case deleteIcon:
      setProjectToDelete(event.target);
      showDeletePopup();
      break;
    case confirmBtn:
      deleteProject(projectToDeleteEl); 
      hideDeletePopup();
      break;
    case cancelBtn:
    case closeBtn:
      hideDeletePopup();
      break;
  }

  function setProjectToDelete(target) {
    projectToDeleteEl = target.parentElement.parentElement;
  }
  function showDeletePopup(){
    deletePopup.style.display = "flex";
  }
  function hideDeletePopup(){
    deletePopup.style.display = "none";
  }
}


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

function countTasks(projectArray) {
  projectArray.forEach(project => {
    switch (project.status) {
      case active:
        processingTaskCount++;
        break;
      case pending:
        unresolvedTaskCount++;
        break;
      case closed:
        resolvedTaskCount++;
        break;
    }
  });
}

function updateStatistics() {
  const allTasks = 'all-tasks';
  const unresolvedTasks = 'unresolved-tasks';
  const processingTasks = 'processing-tasks';
  const resolvedTasks = 'resolved-tasks';
  let totalTaskCount = processingTaskCount + unresolvedTaskCount + resolvedTaskCount;
  let statisticEls = document.getElementsByClassName('overview-part');

  Array.prototype.forEach.call(statisticEls, statisticEl => {
    switch (statisticEl.getAttribute('class').split(' ')[0]) {
      case allTasks:
        statisticEl.lastElementChild.innerHTML = `
          <h3>${totalTaskCount}</h3>`;
        break;
      case unresolvedTasks:
        statisticEl.lastElementChild.innerHTML = `
          <h3>${unresolvedTaskCount}</h3>
          <h4>${100 * unresolvedTaskCount / totalTaskCount}%</h4>`;
        break;
      case processingTasks:
        statisticEl.lastElementChild.innerHTML = `
          <h3>${processingTaskCount}</h3>
          <h4>${100 * processingTaskCount / totalTaskCount}%</h4>`;
        break;
      case resolvedTasks:
        statisticEl.lastElementChild.innerHTML = `
          <h3>${resolvedTaskCount}</h3>
          <h4>${100 * resolvedTaskCount / totalTaskCount}%</h4>`;
        break;
    }
  });
}

function deleteProject(targetEl) {
  let projectToDeleteId = targetEl.getAttribute('project-id');
  
  // deleteItemData(projectToDeleteId);
  deleteProjectOnPage(targetEl);
  function deleteProjectOnPage(targetEl) {
    tableBody.removeChild(targetEl);
  }
}

function getItemData() {
  let tmpData = null;
  let getAJAXJsonOption = {
    url: jsonServerUrl,
    method: 'GET',
    success: function (responseText) {
      loadPage(responseText);
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
  let xhttp = new XMLHttpRequest();
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