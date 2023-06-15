$("#search-form").submit(e => {
  e.preventDefault();
  // get all the inputs into an array.
  const values = {};

  $.each($("#search-form").serializeArray(), (key, value) => {
    if (value.value !== "") {
      values[value.name] = value.value;
    }
  });

  $.ajax({
    type: "POST",
    url: "/post-search",
    data: values,
    success: () =>
      window.location.replace(
        `${window.location.protocol}//${window.location.host}/search?sucess=1`,
      ),
  });
});
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
    success: data => $("#playlistId").val(data.id),
  });
});
