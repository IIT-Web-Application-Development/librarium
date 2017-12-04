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
    id: "4",
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
    id: "5",
    Book_Name: "Half of a Yellow Sun",
    Author: "Chimamanda Ngozi Adichie",
    ISBN: "1400044162",
    genre: "fiction",
    stock: 10
  },
  {
    id: "2",
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
  var req = indexedDB.open("testDatabase");
  var bookobjs=[];
  req.onsuccess=function(event){
    db=event.target.result;
    var trans = db.transaction(["books"], "readonly")
    var objectStore=trans.objectStore("books");

    objectStore.openCursor().onsuccess = function(event) {
     var cursor = event.target.result;
     if (cursor) {
      bookobjs.push(cursor.value);
      cursor.continue();
    }
  };
  drawTable(bookobjs);
  console.log(bookobjs);

}
}

function drawTable(obj) {
  var $table=$('<table>',{"class":"table table-sm table-striped table-bordered table-hover"});
  var $thead=$('<thead>');
  var $tbody=$('<tbody>');
  var $bookName=$('<th>Book Name</th>');
  var $isbn=$('<th>ISBN</th>');
  var $genre=$('<th>Genre</th>');
  var $id=$('<th>ID</th>');
  var $author=$('<th>Author</th>');
  var $stock=$('<th>Stock</th>');

  $thead.append($id);
  $thead.append($bookName);
  $thead.append($author);
  $thead.append($isbn);
  $thead.append($stock);

  $table.append($thead);
  $table.append($tbody);

  $('.dropdown-item').click(function(e){
    var search=$(this).attr('id');

    for(i in obj){

      if(obj[i]['genre']===search){
        var $row=$('<tr>');
        var $id_entry=$('<td>',{"scope":"row"});
        var $bn_entry=$('<td>');
        var $auth_entry=$('<td>');
        var $isbn_entry=$('<td>');
        var $stock_entry=$('<td>');
        var $genre_entry=$('<td>');

        $row.append($id_entry);
        $row.append($bn_entry);
        $row.append($auth_entry);
        $row.append($isbn_entry);
        $row.append($stock_entry);
        $row.append($genre_entry);

        $id_entry.html(obj[i]["id"]);
        $bn_entry.html(obj[i]["Book_Name"]);
        $auth_entry.html(obj[i]["Author"]);
        $isbn_entry.html(obj[i]["ISBN"]);
        $stock_entry.html(obj[i]["stock"]);
        $genre_entry.html(obj[i]["genre"]);

        $tbody.append($row);
        $('#book-table').append($table);

      }
    }
  });
}

// drawTable();
readAll();

});