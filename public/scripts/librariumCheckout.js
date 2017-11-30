var rentalArray = [];

var dynamicClicks = function(){	
	$(".trashButton").unbind().click(function(){
		var currentId = $(this).parent().attr("id");
		var currentIndex = currentId.substring(5, 7);
		$("#tr"+currentIndex).remove();
	});
}

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

var openDB3 = function(){
	var request = indexedDB.open("ITMD462-562-Project-UserDB", 3);
	request.onupgradeneeded = function(e){
		var thisDb = e.target.result;
		if(! thisDb.objectStoreNames.contains("ITMD462-562-Project-OrdersDB")){
			thisDb.createObjectStore("ITMD462-562-Project-OrdersDB",{autoIncrement:true});
		}
	}
	return request;
}

var getObjectStore3 = function(db,e){
	db = e.target.result;
	var objectStore = db.transaction(["ITMD462-562-Project-OrdersDB"], 'readwrite').objectStore("ITMD462-562-Project-OrdersDB");
	return objectStore;
}

var createTableRowsForCheckout = function(index,cursor){
	var sNo = index+1;
	var trOpen = $("<tr id='tr"+index+"'>");
	var td1 = $("<td id='bookName"+index+"'>"+cursor.value.booksData[index].bookName+"</td>"); 
	var td2 = $("<td id='author"+index+"'>"+cursor.value.booksData[index].author+"</td>"); 
	var td3 = $("<td id='isbn"+index+"'>"+cursor.value.booksData[index].isbn+"</td>"); 
	var td4 = $("<td id='originalcost"+index+"'>"+cursor.value.booksData[index].cost+"</td>"); 
	var td5 = $("<td id='memberCost"+index+"'>"+cursor.value.booksData[xindex].membershipCost+"</td>"); 
	var td6 = $("<td id='trash"+index+"'><button class='btn btn-secondary trashButton'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td>"); 
	var trClose = $("</tr>");
	$("#checkoutTbody").append(trOpen.append(td1).append(td2).append(td3).append(td4).append(td5).append(td6).append(trClose));
}

var openDBToCreateTable = function(){
	var db;
	var request = openDB();
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
		objectStore.openCursor().onsuccess = function(event) {
   		 	var cursor = event.target.result;
   		 	if(cursor){
   		 		for(var i=0; i<10; i++){
	   		 		if(true === cursor.value.booksData[i].checkout){
	   		 			createTableRowsForCheckout(i,cursor);
	   		 		}
   		 		}
   		 		dynamicClicks();
   		 		calculateCostOfBooks();
   		 	}
   		}
   	}
}

var createDB2 = function(){
	var db;
	var request = openDB3();
	var currentThread = 0;
	request.onsuccess = function(e) {
		var objectStore = getObjectStore3(db,e);
		objectStore.openCursor().onsuccess = function(event) {
   		 	var cursor = event.target.result;
   		 	if(cursor){
   		 		cursor.continue();
   		 	}
   		}
   	}
}

var setRentalDatesAndStrikeFields = function(){
	var db;
	var request = openDB();
	var currentThread = 0;
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
		objectStore.openCursor().onsuccess = function(event) {
   		 	var cursor = event.target.result;
   		 	if(cursor){
   		 		rentalArray = [{"member":cursor.value.member,"rentalDate":cursor.value.date}];
   		 		$("#dateOfRental").text("Date of Rental :"+cursor.value.date);
   		 	}
   		}
   	}
}



$(document).ready(function(){
	openDBToCreateTable();
	setTimeout(function(){ 
		setRentalDatesAndStrikeFields();
		setTimeout(function(){ 
			createDB2();
		}, 500);
	}, 400);
});
