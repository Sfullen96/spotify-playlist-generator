$("#create-new-button").on("click", () => {
  $("#create-new-playlist").css("display", "block");
  $("#existing-playlists").css("display", "none");
});

$("#use-existing-button").on("click", () => {
  $("#create-new-playlist").css("display", "none");
  $("#existing-playlists").css("display", "block");
});

$("#post-create-playlist").on("click", () => {
  console.log($("#playlistName").val());
  $.ajax({
    type: "POST",
    url: "/post-create",
    data: { name: $("#playlistName").val() },
    success: (data) => $("#playlistId").val(data.id),
  });
});
