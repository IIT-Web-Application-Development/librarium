var count = 0;
var rentalDate = "";

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
		var rentArray = createRentBooksArray(rowCount);
		setTimeout(function(){
			updateOrdersWithData(rentArray);
			setTimeout(function(){
				$("#contentValueRent").text("Thank you for Renting at the Librarium Website, Please visit the librarium on "+rentalDate+" and pay for it to collect the books!")
				$("#confirmRent").modal({backdrop: 'static',keyboard: false});
			}, 300);
		}, 300);
	});

	$("#closeConfirm").unbind().click(function(){
		$("#confirmRent").modal("hide");
		window.location.href = "http://"+location.hostname+":"+location.port+"/";
	});
}

var createRentBooksArray = function(rowCount){
	var tempArray = [];
	for(var i=0; i<rowCount; i++){
		var bookName = $("#checkoutTbody").children().eq(i).children().eq(0).text();
		tempArray[i] = {"bookName":bookName,"rentalDate":rentalDate};
	}
	return tempArray;
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

var initialDataLoad = function(){
	isDataAvailable();
	setTimeout(function(){ 
		if(count == 0){
			createDbData();
			setTimeout(function(){ 
				updateCheckoutStatusToRented();
			}, 300);	
		}
	}, 300);
}

var isDataAvailable = function(){
	var db;
	var request = openDB();
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
		objectStore.openCursor().onsuccess = function(e) {
	       var cursor = e.target.result;
	       if (cursor) {
	       	  count = count+1;
	          cursor.continue();
	       }
    	}
	}
}

var createDbData = function(subjectValue){
	var db;
	var request = openDB();
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
		var preLoadedUserData = [{"member":"no","orders":[],"date":"mm/dd/yyyy","booksData":[{"sNo":"1","bookName":"Ender's Game","author":"Orson Scott Card","isbn":"23145634","cost":"$120","membershipCost":"$80","availableBooks":"10","category":"scienceFiction","location":"First Floor - shelf 101","checkout":false,"reviews":[{"userName":"vikas","reviewComment":"This is a very nice book, but should have been little shorter.","timestamp":"2017-11-29 T 10:45"},{"userName":"Aury","reviewComment":"It is a great book!","timestamp":"2017-11-29 T 11:45"}]},{"sNo":"2","bookName":"The Time Machine","author":"H. G. Wells","isbn":"23583462","cost":"$100","membershipCost":"$60","availableBooks":"10","category":"scienceFiction","location":"First Floor next to the elevator","checkout":false,"reviews":[{"userName":"dhara","reviewComment":"This is a very nice book, it is also a great thriller.","timestamp":"2017-11-29 T 10:45"},{"userName":"Aury","reviewComment":"It is a great book to enjoy from!","timestamp":"2017-11-29 T 11:45"}]},{"sNo":"3","bookName":"Particle Physiscs","author":"Bodo Hamprecht","isbn":"87295647","cost":"$56","membershipCost":"$35","availableBooks":"10","category":"science","location":"Second floor shelf 204","checkout":false,"reviews":[{"userName":"vikas","reviewComment":"This is a wonderful physics book, any novice user can understand this.","timestamp":"2017-11-29 T 10:45"},{"userName":"dhara","reviewComment":"It is a great book to have for reference!","timestamp":"2017-11-29 T 11:45"}]},{"sNo":"4","bookName":"The Elegant Universe","author":"Brian Greene","isbn":"18450384","cost":"$67","membershipCost":"$45","availableBooks":"10","category":"science","location":"Second floor shelf 203","checkout":false,"reviews":[{"userName":"Aury","reviewComment":"This is a wonderful cosmics book, any novice user can understand this.","timestamp":"2017-11-29 T 10:45"},{"userName":"vikas","reviewComment":"It is a great book to have for reference!","timestamp":"2017-11-29 T 11:45"}]},{"sNo":"5","bookName":"The Great Gatsby","author":"F. Scott Fitzgerald","isbn":"095643678","cost":"$89","membershipCost":"$70","availableBooks":"10","category":"novel","location":"Third floor shelf 310","checkout":false,"reviews":[{"userName":"vikas","reviewComment":"This is a wonderful drama book, any novice user can understand this.","timestamp":"2017-11-29 T 10:45"},{"userName":"dhara","reviewComment":"It is a great book to have for fun!","timestamp":"2017-11-29 T 11:45"}]},{"sNo":"6","bookName":"The Hobbit","author":"J.R.R. Tolkien","isbn":"98452678","cost":"$100","membershipCost":"$80","availableBooks":"10","category":"novel","location":"Third floor shelf 309","checkout":false,"reviews":[{"userName":"vikas","reviewComment":"This is a wonderful drama book, any novice user can understand this.","timestamp":"2017-11-29 T 10:45"},{"userName":"aury","reviewComment":"It is a great book to have for fun!","timestamp":"2017-11-29 T 11:45"}]},{"sNo":"7","bookName":"House of Leaves","author":"Mark Z. Danielewski","isbn":"87563789","cost":"$90","membershipCost":"$67","availableBooks":"10","category":"Horror","location":"Third floor shelf 319","checkout":false,"reviews":[{"userName":"aury","reviewComment":"This is a wonderful horror book, any novice user can understand this.","timestamp":"2017-11-29 T 10:45"},{"userName":"dhara","reviewComment":"It is a great book to have for fun!","timestamp":"2017-11-29 T 11:45"}]},{"sNo":"8","bookName":"How Not to Die","author":"Gene Stone and Michael Greger","isbn":"8753461298","cost":"$56","membershipCost":"$39","availableBooks":"10","category":"Health","location":"Second floor shelf 205","checkout":false,"reviews":[{"userName":"dhara","reviewComment":"This is a wonderful health book, any novice user can understand this.","timestamp":"2017-11-29 T 10:45"},{"userName":"aury","reviewComment":"It is a great book to have health!","timestamp":"2017-11-29 T 11:45"}]},{"sNo":"9","bookName":"The 4-Hour Body","author":"Timothy Ferriss","isbn":"78236789","cost":"$78","membershipCost":"$65","availableBooks":"10","category":"Health","location":"Second floor shelf 205","checkout":false,"reviews":[{"userName":"vikas","reviewComment":"This is a wonderful health book, any novice user can understand this.","timestamp":"2017-11-29 T 10:45"},{"userName":"aury","reviewComment":"It is a great book to have health!","timestamp":"2017-11-29 T 11:45"}]},{"sNo":"10","bookName":"The Sugar Swap Diet","author":"David Zinczenko and Stephen Perrine","isbn":"89345992","cost":"$75","membershipCost":"$56","availableBooks":"10","category":"Health","location":"Second floor shelf 205","checkout":false,"reviews":[{"userName":"vikas","reviewComment":"This is a wonderful health book, any novice user can understand this.","timestamp":"2017-11-29 T 10:45"},{"userName":"aury","reviewComment":"It is a great book to have health!","timestamp":"2017-11-29 T 11:45"}]}]}];
		for (i = 0; i < preLoadedUserData.length; i++) { 
	        objectStore.put(preLoadedUserData[i]);
	    } 
   	}
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
   		 		rentalDate = cursor.value.date;
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


var updateOrdersWithData = function(rentArray){
	var db;
	var request = openDB();
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
		objectStore.openCursor().onsuccess = function(event) {
	 		var cursor = event.target.result;
	 		if(cursor){
	 			var intialArray = cursor.value.orders;
	 			if(cursor.value.orders == ""){
	 				cursor.value.orders = rentArray;
	 			}else{
	 				var intialStr = cursor.value.orders;
	 				cursor.value.orders = intialStr.concat(rentArray);
	 			}
				cursor.update(cursor.value);
	 		}
		}	
	}	
}


$(document).ready(function(){
	$("#waitModalCheckout").modal({backdrop: 'static',keyboard: false});
	normalOnClick();
	initialDataLoad();
	setTimeout(function(){ 
		openDBToCreateTable();
		setTimeout(function(){ 
			setRentalDatesAndStrikeFields();
			$("#waitModalCheckout").modal("hide");
		}, 300);
	}, 300);
});
