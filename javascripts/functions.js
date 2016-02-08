var index = [];
var maxIndex;

function start() {
	//document.getElementById('form').action='test.html';  
	if(typeof(Storage) !== "undefined") {
		//console.log(document.getElementById('input_name').value);
		//sessionStorage.name = document.getElementById('input_name').value;
		sessionStorage.page = 1;
		
		for(i=1;i<=9;i++){
			sessionStorage.setItem('q'+i, 0);
		}
	} else {
		alert("Sorry, your browser does not support web storage");
    }
}

function reset(){
	sessionStorage.clear();
	console.log('hi');
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
	if(parseInt(sessionStorage.page) == 10){
		var form = document.getElementById('form');
		form.action = "result.html";
	}
	calculate();
}

function calculate(){
	for(i = 1; i<=9; i++){
		var radioGroup = document.getElementsByName('q'+i);
		for(j = 0; j < 5; j++){
			if(radioGroup[j].checked){
				var score = parseInt(sessionStorage.getItem('q'+index[i-1]));
				score += parseInt(radioGroup[j].value);
				
				sessionStorage.setItem('q'+index[i-1], score);
				break;
			} 		
		}
	}
}

window.onload = function(){
	if(parseInt(sessionStorage.page)==10){
		indexPush();
	
		var radarChartData = {
			labels: ["1번 유형", "2번 유형", "3번 유형", "4번 유형", "5번 유형", "6번 유형", "7번 유형","8번 유형","9번 유형"],

			datasets: [
				{
					label: "result",
					fillColor: "rgba(151,187,205,0.2)",
					strokeColor: "rgba(151,187,205,1)",
					pointColor: "rgba(151,187,205,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(151,187,205,1)",
					data: [
						parseInt(sessionStorage.q1),
						parseInt(sessionStorage.q2),
						parseInt(sessionStorage.q3),
						parseInt(sessionStorage.q4),
						parseInt(sessionStorage.q5),
						parseInt(sessionStorage.q6),
						parseInt(sessionStorage.q7),
						parseInt(sessionStorage.q8),
						parseInt(sessionStorage.q9),
					],
				}
			]
		};

		
		window.myRadar = new Chart(document.getElementById("canvas").getContext("2d")).Radar(radarChartData, {
			responsive: true,
			pointLabelFontSize: 12,
			scaleOverride: true,
			scaleSteps: 9,
			scaleStepWidth: 5,
		});
		
		compare();
		
		createResult();
	}
}

function compare(){
	var max = parseInt(sessionStorage.q1);
	maxIndex = 1;
	
	for(i=2;i<=9;i++){
		var current = parseInt(sessionStorage.getItem('q'+i));

		if(current > max){
			max = current;
			maxIndex = i;
		}
	}
	
	console.log("maxIndex : " + maxIndex);
}

function indexPush(){
	if(sessionStorage.getItem('push') === null){
		var temp = sessionStorage.q9;
		
		for(i=8;i>=1;i--){
			sessionStorage.setItem('q'+(i+1),sessionStorage.getItem('q'+i));
		}
		
		sessionStorage.q1 = temp;
			
		sessionStorage.push = true;
	}
}

function createResult(){
	//XML 얻어오기 및 파싱
	var request = new XMLHttpRequest();
	request.open("GET", "xmls/result.xml", false);
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
	
	var area = document.getElementById('result-area');
	
	var h3 = document.createElement("h3");
	h3.className = "light";
	h3.id="result";
	var t = document.createTextNode('당신은 '+maxIndex+'번 유형 입니다.');
	h3.appendChild(t);
	area.appendChild(h3);
	
	var result = x[maxIndex-1].childNodes;
	
	//console.log(maxIndex);
	//console.log(result[0].childNodes[0].nodeValue);
	
	var explain = document.createElement("p");
	explain.id = 'explain';
	var t = document.createTextNode(result[0].childNodes[0].nodeValue);
	explain.appendChild(t);
	area.appendChild(explain);

	var div = document.createElement("div");
	div.className = "ul-area";
	
	var p = document.createElement("p");
	p.id = "pros";
	var t = document.createTextNode('장점');
	p.appendChild(t);
	div.appendChild(p);
	
	var ul = document.createElement("ul");
	
	//pros
	var length = result[1].childNodes.length;
	console.log(length);
	for(i=0;i<length;i++){
		var li = document.createElement("li");
		var t = document.createTextNode(result[1].childNodes[i].childNodes[0].nodeValue);
		li.appendChild(t);
		ul.appendChild(li);
	}
	
	div.appendChild(ul);
	area.appendChild(div);

	var div = document.createElement("div");
	div.className = "ul-area";
	
	var p = document.createElement("p");
	p.id = "cons";
	var t = document.createTextNode('단점');
	p.appendChild(t);
	div.appendChild(p);
	
	var ul = document.createElement("ul");
	
	//cons
	var length = result[2].childNodes.length;
	console.log(length);
	for(i=0;i<length;i++){
		var li = document.createElement("li");
		var t = document.createTextNode(result[2].childNodes[i].childNodes[0].nodeValue);
		li.appendChild(t);
		ul.appendChild(li);
	}
	
	div.appendChild(ul);
	area.appendChild(div);
}