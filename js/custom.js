/*******Global variables *****/
var cardNumberId = document.getElementById("card-section");
var iconShow = document.getElementById("faIcons");
var message = document.getElementById("status");

/********check valid number **********/
function onlyNumberKey(evt) {
	// Only ASCII character in that range allowed
	var ASCIICode = (evt.which) ? evt.which : evt.keyCode
	if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
	return false;
	return true;
 }
 
 /********check valid card number**********/
 function checkCardNumber(e) {
  var number = e.target.value;
  var CreditCardNumber = number.replace(/ /g, "");
  var cardType = GetCardType(CreditCardNumber);
  var validateNumber = validateCardNumber(CreditCardNumber);
  if(cardType=='fa fa-cc-visa fa-lg'){
	  var checkLength = 15;
  }else if(cardType=='fa fa-cc-amex fa-lg'){
	  var checkLength = 17;
  }else{
	  var checkLength = 18;
  }
  console.log(number.length);
  if(cardType){
	iconShow.setAttribute('class', cardType);
	message.innerHTML = "";
	cardNumberId.classList.remove("error");
	cardNumberId.classList.add("success");
	if(number.length > checkLength){
		if(validateNumber){
			showValidMessage();
		}else{
			showInvalidMessage();
		}
	}
  }else{
	if(number.length ==0){
		resetValue();
	}else{
		showInvalidMessage();
	}
  }
}

/********For show invalid message**********/
function showValidMessage(){
	message.innerHTML = "Valid card number";
	message.classList.add("success");
	message.classList.remove("error");
	cardNumberId.classList.remove("error");
	cardNumberId.classList.add("success");
}

/********For show invalid message**********/
function showInvalidMessage(){
	iconShow.setAttribute('class', 'fa fa-times-circle fa-lg');
	message.innerHTML = "Invalid card number";
	message.classList.add("error");
	message.classList.remove("success");
	cardNumberId.classList.add("error");
	cardNumberId.classList.remove("success");
}

/********Reset input field**********/
function resetValue() {
	var cardNumberSectionId = document.getElementById("card-section");
	var iconShow = document.getElementById("faIcons");
	iconShow.setAttribute('class', 'fa');
	document.getElementById("cc").value = "";
	document.getElementById("ccMask").innerHTML = "<i></i>0000 0000 0000 0000";
	document.getElementById("status").innerHTML = "";
	cardNumberSectionId.classList.remove("error");
	cardNumberSectionId.classList.add("success");
}

/******Get card type ***/
function GetCardType(number){
    // visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
        return "fa fa-cc-visa fa-lg";

    // Mastercard 
    // Updated for Mastercard 2017 BINs expansion
     if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)) 
        return "fa fa-cc-mastercard fa-lg";

    // AMEX
    re = new RegExp("^3[47]");
    if (number.match(re) != null)
        return "fa fa-cc-amex fa-lg";

    // Discover
    re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null)
        return "fa fa-cc-discover fa-lg";

    return "";
}

/****** validate card number ***/
function validateCardNumber(number){
    const regex = new RegExp("^[0-9]{13,19}$");
    if (!regex.test(number)){
        return false;
    }
    return luhnCheck(number);
}

/*****Luhn Check ****/
const luhnCheck = (value) => {
  let nCheck = 0;
  if (value && /[0-9-\s]+/.test(value)) {
      value = value.replace(/\D/g, '');
      value.split('').forEach((v, n) => {
          let nDigit = parseInt(v, 10);
          if (!((value.length + n) % 2) && (nDigit *= 2) > 9) {
              nDigit -= 9;
          }
          nCheck += nDigit;
      });
  }
  return (nCheck % 10) === 0;
};









