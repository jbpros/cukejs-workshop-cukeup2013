$(function () {
  window.CukeWorkshop = {};
  var sources      = ["feature", "stepdefs", "html"];
  var test, htmlDisplayTimeout, lastHTMLupdate;

  function selectorToSourceInput(source) {
    var selector = "#" + source + " textarea";
    return selector;
  }

  function updateSource(source) {
    var selector       = selectorToSourceInput(source);
    CukeWorkshop[source] = $(selector).val();

    if (source == "html") {
      displayHTML();
    }
  }

  function displayHTML() {
    if (htmlDisplayTimeout) return;
    var timeout = 0;
    if (lastHTMLupdate) {
      var elapsed = Date.now() - lastHTMLupdate;
      var timeout = 1000 - elapsed;
      if (timeout < 5) timeout = 0;
    }
    lastHTMLupdate = Date.now();
    htmlDisplayTimeout = setTimeout(function () {
      test = uitest.create();
      test.url("/app.html");
      test.ready(function (document) {
        document.open();
        document.write(CukeWorkshop.html);
        document.close();
        htmlDisplayTimeout = null;
      });
    }, timeout);
  }

  for (var i in sources) {
    var source   = sources[i];
    var selector = selectorToSourceInput(source);

    $(selector).bind('input propertychange', function(event) {
      var source = $(this).parent().parent().attr("id");
      updateSource(source);
    });
    updateSource(source);
  }



});