(function() {
  var form = document.querySelector("form"),
      formFields = form.querySelectorAll("input[name]:not([type='submit'])"),
      errorFields = form.querySelectorAll("[data-error]"),
      fieldsValues = {};

  function setTime() {
    var currentdate = new Date();

    if(currentdate.getMinutes() < 10) {
      var currentMinutes = "0" + currentdate.getMinutes()
    } else {
      currentMinutes = currentdate.getMinutes()
    }

    var datetime = "Ostatnio zapisano: " 
                  + currentdate.getDate() + "."
                  + (currentdate.getMonth()+1)  + "." 
                  + currentdate.getFullYear() + " "  
                  + currentdate.getHours() + ":"  
                  + currentMinutes;

    return datetime.toString();
  }

  function changeTimeUpdate() {
    var updateTime = setTime();
    
    document.querySelector("#changeTimer").textContent = updateTime;
    window.localStorage.setItem("dateFormUpdate", updateTime);  
  }
  
  function loadTimeUpdate() {
    document.querySelector("#changeTimer").textContent = updateTime = window.localStorage.dateFormUpdate;  
  }
  
  function saveToLocalStorage() {
    window.localStorage.setItem("fieldsValues", JSON.stringify(fieldsValues));
  }
  
  function saveField(fieldName, fieldValue) {
    fieldsValues[fieldName] = fieldValue;
    saveToLocalStorage();
    changeTimeUpdate();
  }
  
  function addingSaveToInputs() {
    for(var i = 0; i < formFields.length; i++) {
      formFields[i].addEventListener('change', function () {
          saveField(this.name, this.value);
      });
    }
  }
  
  function fieldsLoad() {
    if(window.localStorage.fieldsValues){
      fieldsValues = JSON.parse(window.localStorage.fieldsValues);
      
      for(var key in fieldsValues) {
        if(key === "invoiceType"){
          var radioChecked = fieldsValues.invoiceType;
          document.querySelector("[value='" + radioChecked + "']").checked = true;
        } else {
          document.querySelector("[name='" + key + "']").value = fieldsValues[key];
        }
      }
    }
  }
  
  function displayErrors(errors){
    var ul = document.querySelector("ul.errors");
    
    if(!ul) {
      ul = document.createElement("ul");
      ul.classList.add("errors", "list-group");
    }
    
    ul.innerHTML = "";
    
    errors.forEach(function(error) {
      var li = document.createElement("li");
      li.classList.add("list-group-item", "list-group-item-danger");
      
      li.textContent = error;
      ul.appendChild(li);
    });
    
    form.parentNode.insertBefore(ul, form);
  }
  
  function isNotEmpty(field){
    return field.value !== "";
  }
  
  function radioIsSelected(){
    var radioSelected = false,
        radioFields = document.querySelectorAll("input[type=radio]");
    
    for(var j = 0; j < radioFields.length; j++) {
      if(radioFields[j].checked === true){
      radioSelected = true;
      break;
      }
    }
    
    return radioSelected;
  }
  
  // Credits http://www.algorytm.org/numery-identyfikacyjne/nip/nip-js.html
  function validateNIP(nip) {
    if (nip == null){
      return false;
    }
    
    nip = nip.replace(/\-/g, '');  
    if (nip.length != 10){
      return false;
    }

    for (i=0; i<10; i++){
      if (isNaN(nip[i])){
        return false;
      }
    }

    sum = 6 * nip[0] +
    5 * nip[1] +
    7 * nip[2] +
    2 * nip[3] +
    3 * nip[4] +
    4 * nip[5] +
    5 * nip[6] +
    6 * nip[7] +
    7 * nip[8];
    sum %= 11;
    if (nip[9] != sum){
      return false;
    }
    
    return true;
  }
  
  function formValidation() {
  
    var errorsForm = [];
    
    for(var i = 0; i < errorFields.length; i++) {
      var field = errorFields[i];
      var isValid = false;
      
      if(field.name === "company-nip") {
        isValid = validateNIP(field.value); 
      } else if(field.type === "text" || field.type === "number") {
        isValid = isNotEmpty(field);
      } else if(field.className === "radio-box") {
        isValid = radioIsSelected(field);
      }
      
      if(!isValid){
        field.parentNode.classList.add("has-error");
        errorsForm.push(field.dataset.error);
      } else {
        field.parentNode.classList.remove("has-error");
      }      
    }  
    
    if(errorsForm.length) {
      displayErrors(errorsForm);
    } else {
      form.submit();
    }
    
  }
  
  function addValidation(){
    form.addEventListener("submit", function(e){
      e.preventDefault();  
      
      formValidation();
    }, false);
    
  }
  
  addValidation();
  
  if ("localStorage" in window) {
    loadTimeUpdate();
    fieldsLoad();
    addingSaveToInputs();
  }
  
})();