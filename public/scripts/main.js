$(function () {
  var sources = ["feature", "stepdefs", "html"];
  var modes   = { feature: "ace/mode/text", stepdefs: "ace/mode/javascript", html: "ace/mode/html" };
  var editors = [], test, htmlDisplayTimeout, lastHTMLupdate;

  function getSourceInputId(source) {
    var selector = source + "-editor";
    return selector;
  }

  function updateSource(source, value) {
    var editor           = editors[source];
    var content          = editor.getSession().getValue();
    localStorage[source] = content;

    if (source == "html") {
      displayHTML();
    }
  }

  function displaySource(source) {
    var content = localStorage[source];
    if (content !== undefined) {
      var editor = editors[source];
      editor.getSession().setValue(content);
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
      if (!test) {
        test = uitest.create();
        test.url("/app.html");
      }
      test.ready(function (document) {
        document.open();
        var content = localStorage.html;
        document.write(content.toString());
        document.close();
        htmlDisplayTimeout = null;
      });
    }, timeout);
  }

  function setupSource(source) {
    var id          = getSourceInputId(source);
    var editor      = ace.edit(id);
    var session     = editor.getSession();
    editors[source] = editor;
    editor.setTheme("ace/theme/clouds");
    editor.setFontSize(16);
    session.setMode(modes[source]);
    session.setUseSoftTabs(true);
    session.setTabSize(2);
    session.on("change", function (event) {
      updateSource(source);
    });

    if (!navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
      $("a[href='#" + source + "']").click(function () {
        editor.focus();
      });
    }
    displaySource(source);
    updateSource(source);
  }

  for (var i in sources) {
    var source = sources[i];
    setupSource(source);
  }
  window.editors=editors;
});