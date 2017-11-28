var count = 0;

var initialDataLoad = function(){
	isDataAvailable();
	setTimeout(function(){ 
		if(count == 0){
			createDbData();
		}
	}, 500);
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
		var preLoadedUserData = [{"s.no":"1","bookName":"Ender's Game","author":"Orson Scott Card","isbn":"23145634","cost":"$120","membershipCost":"$80","availableBooks":"10","category":"scienceFiction","location":"First Floor - shelf 101"},{"s.no":"2","bookName":"The Time Machine","author":"H. G. Wells","isbn":"23583462","cost":"$100","membershipCost":"$60","availableBooks":"10","category":"scienceFiction","location":"First Floor next to the elevator"},{"s.no":"3","bookName":"Particle Physiscs","author":"Bodo Hamprecht","isbn":"87295647","cost":"$56","membershipCost":"$35","availableBooks":"10","category":"science","location":"Second floor shelf 204"},{"s.no":"4","bookName":"The Elegant Universe","author":"Brian Greene","isbn":"18450384","cost":"$67","membershipCost":"$45","availableBooks":"10","category":"science","location":"Second floor shelf 203"},{"s.no":"5","bookName":"The Great Gatsby","author":"F. Scott Fitzgerald","isbn":"095643678","cost":"$89","membershipCost":"$70","availableBooks":"10","category":"novel","location":"Third floor shelf 310"},{"s.no":"6","bookName":"The Hobbit","author":"J.R.R. Tolkien","isbn":"98452678","cost":"$100","membershipCost":"$80","availableBooks":"10","category":"novel","location":"Third floor shelf 309"},{"s.no":"7","bookName":"House of Leaves","author":"Mark Z. Danielewski","isbn":"87563789","cost":"$90","membershipCost":"$67","availableBooks":"10","category":"Horror","location":"Third floor shelf 319"},{"s.no":"8","bookName":"How Not to Die","author":"Gene Stone and Michael Greger","isbn":"8753461298","cost":"$56","membershipCost":"$39","availableBooks":"10","category":"Health","location":"Second floor shelf 205"},{"s.no":"9","bookName":"The 4-Hour Body","author":"Timothy Ferriss","isbn":"78236789","cost":"$78","membershipCost":"$65","availableBooks":"10","category":"Health","location":"Second floor shelf 205"},{"s.no":"10","bookName":"The Sugar Swap Diet","author":"David Zinczenko and Stephen Perrine","isbn":"89345992","cost":"$75","membershipCost":"$56","availableBooks":"10","category":"Health","location":"Second floor shelf 205"}];
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



$(document).ready(function(){
	initialDataLoad();
});
