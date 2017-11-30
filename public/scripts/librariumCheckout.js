
var openDB = function(){
	var request = indexedDB.open("ITMD462-562-Project-UserDB", 1);
	request.onupgradeneeded = function(e){
		var thisDb = e.target.result;
		if(! thisDb.objectStoreNames.contains("ITMD462-562-Project-UserDB")){
			thisDb.createObjectStore("ITMD462-562-Project-UserDB",{autoIncrement:true});
		}
	}
	return request;
}

var getObjectStore = function(db,e){
	db = e.target.result;
	var objectStore = db.transaction(["ITMD462-562-Project-UserDB"], 'readwrite').objectStore("ITMD462-562-Project-UserDB");
	return objectStore;
}

var openDB2 = function(){
	var request = indexedDB.open("ITMD462-562-Project-UserDB", 2);
	request.onupgradeneeded = function(e){
		var thisDb = e.target.result;
		if(! thisDb.objectStoreNames.contains("ITMD462-562-Project-OrdersDB")){
			thisDb.createObjectStore("ITMD462-562-Project-OrdersDB",{autoIncrement:true});
		}
	}
	return request;
}

var getObjectStore2 = function(db,e){
	db = e.target.result;
	var objectStore = db.transaction(["ITMD462-562-Project-OrdersDB"], 'readwrite').objectStore("ITMD462-562-Project-OrdersDB");
	return objectStore;
}

var createTableRowsForCheckout = function(index,cursor){
	var sNo = index+1;
	var trOpen = $("<tr>");
	var td1 = $("<td id='sNo"+index+"'>"+sNo+"</td>"); 
	var td2 = $("<td id='bookName"+index+"'>"+cursor.value.bookName+"</td>"); 
	var td3 = $("<td id='author"+index+"'>"+cursor.value.author+"</td>"); 
	var td4 = $("<td id='isbn"+index+"'>"+cursor.value.isbn+"</td>"); 
	var td5 = $("<td id='originalcost"+index+"'>"+cursor.value.cost+"</td>"); 
	var td6 = $("<td id='memberCost"+index+"'>"+cursor.value.membershipCost+"</td>"); 
	var td7 = $("<td id='trash"+index+"'><button class='btn btn-secondary'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td>"); 
	var trClose = $("</tr>");
	$("#checkoutTbody").append(trOpen.append(td1).append(td2).append(td3).append(td4).append(td5).append(td6).append(td7).append(trClose));
}

var openDBToCreateTable = function(){
	var db;
	var request = openDB();
	var currentThread = 0;
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
		objectStore.openCursor().onsuccess = function(event) {
   		 	var cursor = event.target.result;
   		 	if(cursor){
   		 		if(true === cursor.value.checkout){
   		 			createTableRowsForCheckout(currentThread,cursor);
   		 			currentThread = currentThread + 1;
   		 		}
   		 		cursor.continue();
   		 	}
   		}
   	}
}

var createDB2 = function(){
	var db;
	var request = openDB2();
	var currentThread = 0;
	request.onsuccess = function(e) {
		var objectStore = getObjectStore2(db,e);
		objectStore.openCursor().onsuccess = function(event) {
   		 	var cursor = event.target.result;
   		 	if(cursor){
   		 		cursor.continue();
   		 	}
   		}
   	}
}



$(document).ready(function(){
	openDBToCreateTable();
	setTimeout(function(){ 
		createDB2();
	}, 800);
});
