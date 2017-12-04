var count = 0;

var onClickFunctions = function(){
	$(".review").unbind().click(function(){
		$("#listOfReviews").empty();
		var currentBookId = $(this).parent().parent().children().eq(0).attr("id");
		var bookName = $("#"+currentBookId).text();
		$("#bookTitle").text("Reviews for '"+bookName+"' Book");
		getReviewData(bookName);
	});

	$("#addReview").unbind().click(function(){
		$("#addExternalReview").removeClass("hide");
		$("#addReview").prop("disabled",true);
	});

	$("#commitReview").unbind().click(function(){
		if($("#authorNameInput").val() == "" || $("#autorReviewInput").val() == ""){
			$("#blankSelectionModel").modal({backdrop: 'static',keyboard: false});
		}else{
			$("#addExternalReview").addClass("hide");
			$("#addReview").prop("disabled",false);
			var bookName = $("#addReview").parent().parent().children().eq(0).text().substring(13).substring(0,$("#addReview").parent().parent().children().eq(0).text().substring(13).indexOf("'"));
			var author = $("#authorNameInput").val();
			var review = $("#autorReviewInput").val();
			var timeStamp = currentTimeStamp();
			var reviewArray = [{"userName":author,"reviewComment":review,"timestamp":timeStamp}];
			updateReviews(bookName,reviewArray);
			$("#authorNameInput").val("");
			$("#autorReviewInput").val("");
		}
	});

	$("#checkoutSelected").unbind().click(function(){
		if(!$("#datepicker").val() == ""){
			$("#waitModal").modal({backdrop: 'static',keyboard: false});
			var checked = radioSelectedEach();
			for(var i=0; i<checked[1].length; i++){
				updateCheckoutStatus(checked[1][i]);
			}
			setTimeout(function(){ 
				$("#waitModal").modal("hide");
				window.location.href="http://"+location.hostname+":"+location.port+"/checkout";
			}, 1000);
		}else{
			$("#confirmRentDateSelection").modal({backdrop: 'static',keyboard: false});
		}
	});

	$("#closeConfirm").unbind().click(function(){
		$("#confirmRent").modal("hide");
	});

	$("#searchCategory").unbind().click(function(){
		if($(".selectOptions").val() == ""){
			$("#searchCategoryFaultModel").modal({backdrop: 'static',keyboard: false});
		}else{
			var category = $(".selectOptions").val();
			$("#MainPageLook").addClass("hide");
			openDBToCreateTable(category);
			$("#categorizedContent").removeClass("hide");
			setTimeout(function(){ 
				onClickFunctions();
				onChangeFunctions();
			}, 300);
		}
	});

	$("#orders").unbind().click(function(){
		$("#orderContentModal").empty();
		$("#ordersModal").modal({backdrop: 'static',keyboard: false});
		showPreviousOrders();
	});

	$("#closeOrderData").unbind().click(function(){
		$("#ordersModal").modal("hide");
	});

	$("#closeBlankSelectionModel").unbind().click(function(){
		$("#closeBlankSelectionModel").modal("hide");
	});

	$("#closeFaultSearchModel").unbind().click(function(){
		$("#searchCategoryFaultModel").modal("hide");
	});	
}

var onChangeFunctions = function(){
	$(".radioForCheckout").on("change",function(){
		var checked = radioSelectedEach();
		if(checked[0] == true){
			$("#checkoutSelected").attr("disabled",false);
		}else{
			$("#checkoutSelected").attr("disabled",true);
		}
		
	});
}

var radioSelectedEach = function(){
	var checked = false;
	var count1 = 0;
	var bookNameArray = [];
	$.each($(".radioForCheckout"),function(){
			if($(this).is(":checked")){
				checked = true;
				var currentBookId = $(this).parent().parent().children().eq(0).attr("id");
				bookNameArray[count1] = $("#"+currentBookId).text();
				count1 = count1 + 1;
			}

		});
	var arrayOfCheckCount = [checked,bookNameArray];
	return arrayOfCheckCount;
}

var currentTimeStamp = function(){
	var date = new Date();
    var dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return dateString;
}

var initialDataLoad = function(){
	isDataAvailable();
	setTimeout(function(){ 
		if(count == 0){
			createDbData();
		}else{
			updateCheckoutStatusToDefault();
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
		var preLoadedUserData = [
		{
			"member":"no",
			"orders":[],
			"date":"mm/dd/yyyy",
			"booksData":[
				{
					"sNo":"1",
					"bookName":"What Happened",
					"author":"Hillary Rodham Clinton",
					"isbn":"1501175564",
					"cost":"$120",
					"membershipCost":"$80",
					"availableBooks":"10",
					"category":"biographies",
					"location":"First Floor - shelf 101",
					"checkout":false,
					"reviews":[
						{
							"userName":"vikas",
							"reviewComment":"This is a very nice book, but should have been little shorter.",
							"timestamp":"2017-2-8 14:32:23"
						},
						{
							"userName":"Aury",
							"reviewComment":"It is a great book!",
							"timestamp":"2017-11-8 12:22:23"
						}
					]
				},
				{
					"sNo":"2",
					"bookName":"The Time Machine",
					"author":"H. G. Wells",
					"isbn":"23583462",
					"cost":"$100",
					"membershipCost":"$60",
					"availableBooks":"10",
					"category":"biographies",
					"location":"First Floor next to the elevator",
					"checkout":false,
					"reviews":[
						{
							"userName":"dhara",
							"reviewComment":"This is a very nice book, it is also a great thriller.",
							"timestamp":"2017-08-7 08:22:11"
						},
						{
							"userName":"Aury",
							"reviewComment":"It is a great book to enjoy from!",
							"timestamp":"2017-10-9 13:22:25"
						}
					]
				},
				{
					"sNo":"3",
					"bookName":"Particle Physiscs",
					"author":"Bodo Hamprecht",
					"isbn":"87295647",
					"cost":"$56",
					"membershipCost":"$35",
					"availableBooks":"10",
					"category":"science",
					"location":"Second floor shelf 204",
					"checkout":false,
					"reviews":[
						{
							"userName":"King",
							"reviewComment":"This is a wonderful physics book, any novice user can understand this.",
							"timestamp":"2017-06-20 15:22:23"
						},
						{
							"userName":"John",
							"reviewComment":"It is a great book to have for reference!",
							"timestamp":"2017-09-22 19:25:12"
						}
					]
				},
				{
					"sNo":"4",
					"bookName":"The Elegant Universe",
					"author":"Brian Greene",
					"isbn":"18450384",
					"cost":"$67",
					"membershipCost":"$45",
					"availableBooks":"10",
					"category":"science",
					"location":"Second floor shelf 203",
					"checkout":false,
					"reviews":[
						{
							"userName":"Soloman",
							"reviewComment":"This is a wonderful cosmics book, any novice user can understand this.",
							"timestamp":"2017-04-4 18:57:13"
						},
						{
							"userName":"Invader",
							"reviewComment":"It is a great book to have for reference!",
							"timestamp":"2017-06-5 05:59:13"
						}
					]
				},
				{
					"sNo":"5",
					"bookName":"The Great Gatsby",
					"author":"F. Scott Fitzgerald",
					"isbn":"095643678",
					"cost":"$89",
					"membershipCost":"$70",
					"availableBooks":"10",
					"category":"novel",
					"location":"Third floor shelf 310",
					"checkout":false,
					"reviews":[
						{
							"userName":"Ghazhi",
							"reviewComment":"This is a wonderful drama book, any novice user can understand this.",
							"timestamp":"2017-10-4 15:12:03"
						},
						{
							"userName":"Undertaker",
							"reviewComment":"It is a great book to have for fun!",
							"timestamp":"2017-12-4 11:07:26"
						}
					]
				},
				{
					"sNo":"6",
					"bookName":"The Hobbit",
					"author":"J.R.R. Tolkien",
					"isbn":"98452678",
					"cost":"$100",
					"membershipCost":"$80",
					"availableBooks":"10",
					"category":"novel",
					"location":"Third floor shelf 309",
					"checkout":false,
					"reviews":[
						{
							"userName":"Vikas",
							"reviewComment":"This is a wonderful drama book, any novice user can understand this.",
							"timestamp":"2017-01-25 23:12:23"
						},
						{
							"userName":"Jessy",
							"reviewComment":"It is a great book to have for fun!",
							"timestamp":"2017-09-23 14:22:93"
						}
					]
				},
				{
					"sNo":"7",
					"bookName":"Camino Island: A Novel",
					"author":"John Grisham",
					"isbn":"87563789",
					"cost":"$90",
					"membershipCost":"$67",
					"availableBooks":"10",
					"category":"thrillers",
					"location":"Third floor shelf 319",
					"checkout":false,
					"reviews":[
						{
							"userName":"Aury",
							"reviewComment":"This is a wonderful horror book, any novice user can understand this.",
							"timestamp":"2017-07-5 12:10:33"
						},
						{
							"userName":"Dhara",
							"reviewComment":"It is a great book to have for fun!",
							"timestamp":"2017-09-10 16:22:53"
						}
					]
				},
				{
					"sNo":"8",
					"bookName":"How Not to Die",
					"author":"Gene Stone and Michael Greger",
					"isbn":"8753461298",
					"cost":"$56",
					"membershipCost":"$39",
					"availableBooks":"10",
					"category":"Health",
					"location":"Second floor shelf 205",
					"checkout":false,
					"reviews":[
						{
							"userName":"Neil",
							"reviewComment":"This is a wonderful health book, any novice user can understand this.",
							"timestamp":"2017-10-4 10:32:25"
						},
						{
							"userName":"Albert",
							"reviewComment":"It is a great book to have health!",
							"timestamp":"2017-11-28 12:12:03"
						}
					]
				},
				{
					"sNo":"9",
					"bookName":"The 4-Hour Body",
					"author":"Timothy Ferriss",
					"isbn":"78236789",
					"cost":"$78",
					"membershipCost":"$65",
					"availableBooks":"10",
					"category":"Health",
					"location":"Second floor shelf 205",
					"checkout":false,
					"reviews":[
						{
							"userName":"Catston",
							"reviewComment":"This is a wonderful health book, any novice user can understand this.",
							"timestamp":"2016-10-7 12:20:60"
						},
						{
							"userName":"Mike",
							"reviewComment":"It is a great book to have health!",
							"timestamp":"2017-10-4 21:26:15"
						}
					]
				},
				{
					"sNo":"10",
					"bookName":"The Sugar Swap Diet",
					"author":"David Zinczenko and Stephen Perrine",
					"isbn":"89345992",
					"cost":"$75",
					"membershipCost":"$56",
					"availableBooks":"10",
					"category":"Health",
					"location":"Second floor shelf 205",
					"checkout":false,
					"reviews":[
						{
							"userName":"Kristi",
							"reviewComment":"This is a wonderful health book, any novice user can understand this.",
							"timestamp":"2017-03-30 23:59:29"
						},
						{
							"userName":"Kelly",
							"reviewComment":"It is a great book to have health!",
							"timestamp":"2017-10-23 15:28:17"
						}
					]
				}
			]
		}
	];
		for (i = 0; i < preLoadedUserData.length; i++) { 
	        objectStore.put(preLoadedUserData[i]);
	    } 
   	}
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

var openDB2 = function(){
	var request = indexedDB.open("ITMD462-562-Project-UserDB", 2);
	request.onupgradeneeded = function(e){
		var thisDb = e.target.result;
		if(! thisDb.objectStoreNames.contains("ITMD462-562-Project-rentDetailsDB")){
			thisDb.createObjectStore("ITMD462-562-Project-rentDetailsDB",{autoIncrement:true});
		}
	}
	return request;
}

var getObjectStore2 = function(db,e){
	db = e.target.result;
	var objectStore = db.transaction(["ITMD462-562-Project-rentDetailsDB"], 'readwrite').objectStore("ITMD462-562-Project-rentDetailsDB");
	return objectStore;
}


var createNewDivForReview = function(indexi,indexj,cursor){
	var div = $("<div id="+indexi+" class='resultsDivCreation boxshadow'>");
	var firstLabel = $("<label id=authorNameLabel"+indexi+">Author Name  <span id='authorName"+indexi+"'>: "+cursor.value.booksData[indexi].reviews[indexj].userName+"</span></label><br/>");
	var secondLabel = $("<label id=reviewCommentLabel"+indexi+">Review  <span id='reviewMessage"+indexi+"'>: "+cursor.value.booksData[indexi].reviews[indexj].reviewComment+"</span></label><br/>");
	var thirdLabel = $("<label id=timestampLabel"+indexi+">Updated Timestamp  <span id='spanTS"+indexi+"'>: "+cursor.value.booksData[indexi].reviews[indexj].timestamp+"</span></label><br/>");
	var closeDiv = $("</div>");
	$("#listOfReviews").append(div.append(firstLabel).append(secondLabel).append(thirdLabel).append(closeDiv));
}

var createTableRowsForindex = function(index,cursor){
	var sNo = index+1;
	var trOpen = $("<tr>");
	var td1 = $("<td id='bookName"+index+"'>"+cursor.value.booksData[index].bookName+"</td>"); 
	var td2 = $("<td id='author"+index+"'>"+cursor.value.booksData[index].author+"</td>"); 
	var td3 = $("<td id='isbn"+index+"'>"+cursor.value.booksData[index].isbn+"</td>"); 
	var td4 = $("<td id='originalcost"+index+"'>"+cursor.value.booksData[index].cost+"</td>"); 
	var td5 = $("<td id='memberCost"+index+"'>"+cursor.value.booksData[index].membershipCost+"</td>"); 
	var td6 = $("<td id='booksAvailable"+index+"'>"+cursor.value.booksData[index].availableBooks+"</td>"); 
	var td7 = $("<td id='checkBox"+index+"'><a id="+sNo+" class='review' href='#'>review</a></td>"); 
	var td8 = $("<td id='booksAvailable"+index+"'><input type='checkbox' class='form-check-input radioForCheckout'></td>"); 
	var trClose = $("</tr>");
	$("#mainCategorizedTbody").append(trOpen.append(td1).append(td2).append(td3).append(td4).append(td5).append(td6).append(td7).append(td8).append(trClose));
}

var createOrdersTable = function(index,orderArray,cursor){
	var div = $("<div id="+index+" class='resultsDivCreation boxshadow'>");
	var firstLabel = $("<label id=bookNameLabel"+index+">Book Name  <span id='authorName"+index+"'>: "+cursor.value.orders[index].bookName+"</span></label><br/>");
	var secondLabel = $("<label id=rentalDateLabel"+index+">Rental Date  <span id='rentalDate"+index+"'>: "+cursor.value.orders[index].rentalDate+"</span></label><br/>");
	var closeDiv = $("</div>");
	$("#orderContentModal").append(div.append(firstLabel).append(secondLabel).append(closeDiv));
}

var getReviewData = function(bookName){
	var db;
	var request = openDB();
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
		objectStore.openCursor().onsuccess = function(event) {
   		 	var cursor = event.target.result;
   		 	if(cursor){
   		 		for(var i=0; i<10; i++){
	   		 		if(bookName === cursor.value.booksData[i].bookName){
	   		 			for(var j=0; j<cursor.value.booksData[i].reviews.length; j++){
	   		 				createNewDivForReview(i,j,cursor);
	   		 			}
	   		 			if($("#reviewContent").hasClass("hide")){
	   		 				$("#reviewContent").removeClass("hide");
	   		 			}
	   		 		}
   		 		}
   		 	}
   		}
   	}
}

var updateCheckoutStatus = function(checkedBook){
	var db;
	var request = openDB();
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
		objectStore.openCursor().onsuccess = function(event) {
	 		var cursor = event.target.result;
	 		if(cursor){
	 			for(var i=0; i<10; i++){
		 			if(cursor.value.booksData[i].bookName == checkedBook){
						cursor.value.booksData[i].checkout = true;
						cursor.value.member = $('input[name=memberRadioName]:checked', '#memberSelect').val();
						cursor.value.date = $("#datepicker").val();
						cursor.update(cursor.value);
			 		}
		 		}
	 		}
		}	
	}	
}

var updateCheckoutStatusToDefault = function(){
	var db;
	var request = openDB();
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
		objectStore.openCursor().onsuccess = function(event) {
	 		var cursor = event.target.result;
	 		if(cursor){
	 			for(var i=0; i<10; i++){
					cursor.value.booksData[i].checkout = false;
					cursor.value.member = "no";
					cursor.value.date = "mm/dd/yyyy";
					cursor.update(cursor.value);
		 		}
	 		}
		}	
	}	
}

var openDBToCreateTable = function(category){
	var db;
	var request = openDB();
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
		objectStore.openCursor().onsuccess = function(event) {
   		 	var cursor = event.target.result;
   		 	if(cursor){
   		 		for(var i=0; i<10; i++){
   		 			if(category === cursor.value.booksData[i].category){
   		 				createTableRowsForindex(i,cursor);
   		 			}
   		 		}
   		 	}
   		}
   	}
}

var addRentalDetailsToDb = function(bookName){
	var db;
	var request = openDB();
	var currentThread = 0;
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
	    objectStore.openCursor().onsuccess = function(event) {
   		 	var cursor = event.target.result;
   		 	if(cursor){
		 		var rentalDate = $("#datepicker").val();
				var member = $('input[name=memberRadioName]:checked', '#memberSelect').val();
		 		cursor.value.rentDate = rentalDate;
		 		cursor.value.member = member;
				cursor.update(cursor.value);
   		 		cursor.continue();
   		 	}
   		}
   	}
}

var showPreviousOrders = function(){
	var db;
	var request = openDB();
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
	    objectStore.openCursor().onsuccess = function(event) {
   		 	var cursor = event.target.result;
   		 	if(cursor){
   		 		var orderArray = cursor.value.orders;
   		 		for(var i=0; i<orderArray.length; i++){
   		 			createOrdersTable(i,orderArray,cursor);
   		 		}
   		 	}
   		}
   	}
}

var updateReviews = function(checkedBook, reviewArray){
	var db;
	var request = openDB();
	request.onsuccess = function(e) {
		var objectStore = getObjectStore(db,e);
	    objectStore.openCursor().onsuccess = function(event) {
   		 	var cursor = event.target.result;
   		 	if(cursor){
   		 		for(var i=0; i<10; i++){
   		 			if(cursor.value.booksData[i].bookName == checkedBook){
   		 				var reviews = cursor.value.booksData[i].reviews;
   		 				cursor.value.booksData[i].reviews = reviews.concat(reviewArray);
						cursor.update(cursor.value);
			 		} 
   		 		} 
   		 		$("#listOfReviews").empty();
   		 		getReviewData(checkedBook); 		 	
			}
   		}
   	}
}

$(document).ready(function(){
	$("#waitModal").modal({backdrop: 'static',keyboard: false});
	initialDataLoad();
	setTimeout(function(){ 
		onClickFunctions();
		onChangeFunctions();
		$("#waitModal").modal("hide");
	}, 1000);
});
