$.getJSON("/articles", function (data) {
  for (var i = 0; i < 20; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br><br>" + data[i].summary + "</p><a href='" + data[i].link + "'>Link</a><hr>");
  }
});

$(document).on("click", "p", function () {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function (data) {
      console.log(data);
      $("#notes").empty();
    });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#deletenote", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: "",
      body: "",
    }
  })
    .then(function (data) {
      console.log(data);
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$("#scrape").on("click", function() {
  $.ajax({
    method: "GET",
    url: "/scrape/"
  })
  location.reload(true)
})