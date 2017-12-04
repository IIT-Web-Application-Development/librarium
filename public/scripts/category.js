$(document).ready( function () {
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

  if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
  }
  const books=[
  {
    id: "1",
    Book_Name: "What Happened",
    Author: "Hillary Rodham Clinton",
    ISBN: "1501175564",
    genre: "biographies",
    stock: 100
  },
  {
    id: "2",
    Book_Name: "Hillbilly Elegy: A Memoir of a Family and Culture in Crisis",
    Author: "J. D. Vance",
    ISBN: "0062300547",
    genre: "biographies",
    stock: 10
  },
  {
    id: "3",
    Book_Name: "Camino Island: A Novel",
    Author: "John Grisham",
    ISBN: "0385543026",
    genre: "thrillers",
    stock: 7
  },
  {
    id: "4",
    Book_Name: "Half of a Yellow Sun",
    Author: "Chimamanda Ngozi Adichie",
    ISBN: "1400044162",
    genre: "fiction",
    stock: 10
  },
  {
    id: "5",
    Book_Name: "Small Great Things: A Novel",
    Author: "Jodi Picoult",
    ISBN: "0345544951",
    genre: "fiction",
    stock: 10
  },
  {
    id: "6",
    Book_Name: "Halsey Street",
    Author: "Naima Coster",
    ISBN: "1503941175",
    genre: "fiction",
    stock: 15
  },
  ];


  var db;
  var request = indexedDB.open("testDatabase");

  request.onerror = function(event) {
    console.log("Database error: " + event.target.errorCode);
  };

  request.onsuccess = function(event) {
    db=event.target.result;
    console.log('success: '+db);
  };

  request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("books", {keyPath: "id"});

    for (var i in books) {
     objectStore.add(books[i]);
   }
 };

 function readAll() {
   var transaction = db.transaction(["employee"]);
   var objectStore = transaction.objectStore("employee");
   objectStore.openCursor().onsuccess = function(event) {
     var cursor = event.target.result;

     if (cursor) {
      console.log(cursor);
      cursor.continue();
    }
  };
}

// readAll();

});