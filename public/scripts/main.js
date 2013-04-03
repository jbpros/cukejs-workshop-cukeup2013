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
    htmlDisplayTimeout = setTimeout(function () {
      loadReadyApp();
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

  function loadReadyApp(callback) {
    clearTimeout(htmlDisplayTimeout);
    if (!test) {
      test = uitest.create();
      window.app = test;
      test.feature('xhrSensor');
      test.feature('timeoutSensor');
      test.feature('jqmAnimationSensor');
      test.url("/app.html");
    }
    test.ready(function (document) {
      document.open();
      var content = localStorage.html;
      document.write(content.toString());
      document.close();
      htmlDisplayTimeout = null;
      if (callback)
        test.reloaded(callback);
    });
    lastHTMLupdate = Date.now();
  }

  for (var i in sources) {
    var source = sources[i];
    setupSource(source);
  }

  window.loadReadyApp = function (callback) {
    test = null;
    loadReadyApp(callback);
  };

  window.editors = editors;
});