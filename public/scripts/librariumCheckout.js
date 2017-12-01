var dynamicClicks = function(){	
	$(".trashButton").unbind().click(function(){
		var currentId = $(this).parent().attr("id");
		var currentIndex = currentId.substring(5, 7);
		$("#tr"+currentIndex).remove();
		$("#costOfBooks").text("$ "+calculateCostOfBooks());
		var currentCostWithDollar = $("#costOfBooks").text();
		var currentCostWithoutDollar = currentCostWithDollar.substring(2,5).trim();
		if(parseInt(currentCostWithoutDollar) == 0){
			window.location.href = "http://"+location.hostname+":"+location.port+"/";
		}
	});
}

var normalOnClick = function(){
	var bookNameArray = [];
	$("#rent").unbind().click(function(){
		var rowCount =	$("#checkoutTbody").children().length;
		for(var i=0; i<rowCount; i++){
			var bookNameToReduce = $("#checkoutTbody").children().eq(i).children().eq(0).text();
			bookNameArray[i] = bookNameToReduce;
		}
		updateAvailableBooks(bookNameArray,rowCount);
		$("#confirmRent").modal({backdrop: 'static',keyboard: false});
	});

	$("#closeConfirm").unbind().click(function(){
		$("#confirmRent").modal("hide");
		window.location.href = "http://"+location.hostname+":"+location.port+"/";
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

var createTableRowsForCheckout = function(index,cursor){
	var sNo = index+1;
	var trOpen = $("<tr id='tr"+index+"'>");
	var td1 = $("<td id='bookName"+index+"'>"+cursor.value.booksData[index].bookName+"</td>"); 
	var td2 = $("<td id='author"+index+"'>"+cursor.value.booksData[index].author+"</td>"); 
	var td3 = $("<td id='isbn"+index+"'>"+cursor.value.booksData[index].isbn+"</td>"); 
	var td4 = $("<td id='originalcost"+index+"'>"+cursor.value.booksData[index].cost+"</td>"); 
	var td5 = $("<td id='memberCost"+index+"'>"+cursor.value.booksData[index].membershipCost+"</td>"); 
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
   		 	}
   		}
   	}
}

var updateAvailableBooks = function(bookNameArray,rowCount){
	var db;
	var request = openDB();
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
		objectStore.openCursor().onsuccess = function(event) {
   		 	var cursor = event.target.result;
   		 	if(cursor){
   		 		for(var j=0; j<rowCount; j++){
   		 			for(var i=0; i<10; i++){
		   		 		if(bookNameArray[j] === cursor.value.booksData[i].bookName){
		   		 			cursor.value.booksData[i].availableBooks = parseInt(cursor.value.booksData[i].availableBooks) - 1;
		   		 			cursor.update(cursor.value);
		   		 		}
   		 			}
   		 		}
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
   		 		$("#dateOfRental").text("Date of Rental :"+cursor.value.date);
   		 		$("#memberTrueOrFlase").text(cursor.value.member);
   		 		$("#costOfBooks").text("$ "+calculateCostOfBooks());
   		 		var rowCount =	$("#checkoutTbody").children().length;
   		 		if($("#memberTrueOrFlase").text() == "true"){
		 			$("#categorizedTable").children().children().children().eq(3).addClass("hide");
 					for(var i=0; i<rowCount; i++){
 						var hidingNonMemberCost = $("#checkoutTbody").children().eq(i).children().eq(3).addClass("hide");
 					}
   		 		}else{
   		 			$("#categorizedTable").children().children().children().eq(4).addClass("hide");
 					for(var i=0; i<rowCount; i++){
 						var hidingMemberCost = $("#checkoutTbody").children().eq(i).children().eq(4).addClass("hide");
 					}
   		 		}
   		 	}
   		}
   	}
}

var calculateCostOfBooks = function(){
	 var countArray = [];
	 var price = 0;
	 var rowCount =	$("#checkoutTbody").children().length;
	 for(var i=0; i<rowCount; i++){
	 	if($("#memberTrueOrFlase").text() == "true"){
	 		var originalCostWithDollar = $("#checkoutTbody").children().eq(i).children().eq(4).text();
	 	}else{
	 		var originalCostWithDollar = $("#checkoutTbody").children().eq(i).children().eq(3).text();
	 	}
	 	countArray[i] = originalCostWithDollar.substring(1,4).trim();
	 }
	 for(var i=0; i<countArray.length; i++){
	 	price = price + parseInt(countArray[i]);
	 }
	 return price;
}

$(document).ready(function(){
	normalOnClick();
	openDBToCreateTable();
	setTimeout(function(){ 
		setRentalDatesAndStrikeFields();
	}, 500);
});
