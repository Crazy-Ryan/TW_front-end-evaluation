const jsonServerUrl = 'http://localhost:3000/projects';

function getItemData() {
  let tmpData = null;
  let getAJAXJsonOption = {
    url: jsonServerUrl,
    method: 'GET',
    success: function (responseText) {
      console.log(responseText);
    },
    fail:function(error){
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
    fail:function(error){
      console.log('delete data error')
    }
  };
  ajaxJsonHandle(deleteAJAXJsonOption);
}

deleteItemData(1);

/**
options = {
  url: "",
  method: "",
  headers: {}, 
  data: "",
  success: function(result) {},  // 请求成功后调用此方法
  fail: function(error) {}    // 请求失败或出错后调用此方法
}
**/
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