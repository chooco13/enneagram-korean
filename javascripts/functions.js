var index = [];

function setUser() {
	//document.getElementById('form').action='test.html';  
	
	sessionStorage.clear();
	
    if(typeof(Storage) !== "undefined") {
		//console.log(document.getElementById('input_name').value);
		sessionStorage.name = document.getElementById('input_name').value;
		sessionStorage.page = 1;
		
		sessionStorage.q1 = 0;
		sessionStorage.q2 = 0;
		sessionStorage.q3 = 0;
		sessionStorage.q4 = 0;
		sessionStorage.q5 = 0;
		sessionStorage.q6 = 0;
		sessionStorage.q7 = 0;
		sessionStorage.q8 = 0;
		sessionStorage.q9 = 0;
	} else {
		alert("Sorry, your browser does not support web storage");
    }
}

function createQuestion(){
	//XML 얻어오기 및 파싱
	var request = new XMLHttpRequest();
	request.open("GET", "xmls/q" + sessionStorage.page + ".xml", false);
	request.send();
	var response = request.responseXML;
	
	var text = (new XMLSerializer()).serializeToString(response);
	text = text.replace(/(\r\n|\n|\r|\t)/gm,"");
	//console.log(text);
	
	if (window.DOMParser) {
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(text,"text/xml");
	} else {
		//인터넷 익스플로러
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(text); 
	} 
	
	x=xmlDoc.documentElement.childNodes;
	
	var area = document.getElementById('question');
	
	for (i=0; i < x.length; i++){
		var question = x[i].childNodes;
		index.push(question[0].childNodes[0].nodeValue);
	
		var p = document.createElement("p");
		p.className = "question-text large-font thick";
		var t = document.createTextNode(question[1].childNodes[0].nodeValue);
		p.appendChild(t);
		area.appendChild(p);
		
		var table = document.createElement("table");
		table.className = "radio-gruop";
		
		var tr = document.createElement("tr");

		for(k=0; k < 5; k++){
			var th = document.createElement("th");
			var t = document.createTextNode(k+1);
			th.className = "large-font light";
			th.appendChild(t);
			tr.appendChild(th);
		}
		
		table.appendChild(tr);
		
		var tr = document.createElement("tr");
		
		for(k=0; k < 5; k++){
			var td = document.createElement("td");
			var input = document.createElement("input");
			input.setAttribute('type','radio');
			input.setAttribute('name','q'+(i+1));
			input.setAttribute('value',(k+1));
			input.required = true;
			td.appendChild(input);
			tr.appendChild(td);
		}
		
		table.appendChild(tr);
		
		area.appendChild(table);
	}
}

function pageUp(){
	console.log('pageUp');
	sessionStorage.page = parseInt(sessionStorage.page) + 1;
	calculate();
	
}

function calculate(){
	for(i = 1; i<=9; i++){
		var radioGroup = document.getElementsByName('q'+i);
		for(j = 0; j < 5; j++){
			//console.log('radioGroup[' + j + '].checked : '+ radioGroup[j].checked);
			if(radioGroup[j].checked){
				//console.log(radioGroup[j].value);
				switch(parseInt(index[i-1])){
					case 1:
						sessionStorage.q1 = parseInt(sessionStorage.q1) + parseInt(radioGroup[j].value);
						break;
					case 2:
						sessionStorage.q2 = parseInt(sessionStorage.q2) + parseInt(radioGroup[j].value);
						break;
					case 3:
						sessionStorage.q3 = parseInt(sessionStorage.q3) + parseInt(radioGroup[j].value);
						break;
					case 4:
						sessionStorage.q4 = parseInt(sessionStorage.q4) + parseInt(radioGroup[j].value);
						break;
					case 5:
						sessionStorage.q5 = parseInt(sessionStorage.q5) + parseInt(radioGroup[j].value);
						break;
					case 6:
						sessionStorage.q6 = parseInt(sessionStorage.q6) + parseInt(radioGroup[j].value);
						break;
					case 7:
						sessionStorage.q7 = parseInt(sessionStorage.q7) + parseInt(radioGroup[j].value);
						break;
					case 8:
						sessionStorage.q8 = parseInt(sessionStorage.q8) + parseInt(radioGroup[j].value);
						break;
					case 9:
						sessionStorage.q9 = parseInt(sessionStorage.q9) + parseInt(radioGroup[j].value);
						break;
					default :
						console.log('default');
				}
				
				break;
			} 		
		}
	}
}