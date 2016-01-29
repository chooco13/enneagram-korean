function setUser() {
	document.getElementById('form').action='test.html';  
	
    if(typeof(Storage) !== "undefined") {
		console.log(document.getElementById('input_name').value);
		sessionStorage.name = document.getElementById('input_name').value;
    } else {
		alert("Sorry, your browser does not support web storage");
    }
}