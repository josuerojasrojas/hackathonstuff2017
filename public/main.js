(function() {
  document.addEventListener("DOMContentLoaded", function() {
    var getFile, hasPopup, positions, removeClass, scrollT, scrollTimeOut;
    positions = [];
    window.getPositions = function() {
      positions = [];
      $('.view').each(function() {
        return positions.push($(this).position().top);
      });
      return positions;
    };
    getPositions();
    $(window).resize(getPositions);
    scrollTimeOut = null;
    window.scrollToPos = function(change, currPos, targetPos, down) {
      if (currPos === targetPos) {
        return;
      }
      currPos = currPos + change;
      if (down) {
        if (currPos > targetPos) {
          currPos = targetPos;
        }
        change = change > 0 && change < 30 ? change + .25 : change;
      } else {
        if (currPos < targetPos) {
          currPos = targetPos;
        }
        change = change < 0 && change > -30 ? change - .25 : change;
      }
      window.scrollTo(0, currPos);
      return scrollTimeOut = setTimeout(scrollToPos, 1, change, currPos, targetPos, down);
    };
    $(window).keydown(function(e) {
      var change, currPos, targetPos;
      currPos = $(this).scrollTop();
      if (e.which === 38) {
        clearTimeout(scrollTimeOut);
        targetPos = positions.filter(function(element) {
          return element < currPos;
        });
        targetPos = targetPos[targetPos.length - 1] ? targetPos[targetPos.length - 1] : positions[0];
        return scrollToPos(change = -.50, currPos, targetPos, false);
      } else if (e.which === 40) {
        clearTimeout(scrollTimeOut);
        targetPos = positions.find(function(element) {
          return element > currPos;
        });
        targetPos = targetPos ? targetPos : positions[positions.length - 1];
        return scrollToPos(change = .50, currPos, targetPos, true);
      }
    });
    // scroll navigations
    removeClass = function() {
      return $('.view.first').removeClass('isScroll');
    };
    scrollT = '';
    $(window).scroll(function() {
      $('.view.first').addClass('isScroll');
      clearTimeout(scrollT);
      return scrollT = setTimeout(removeClass, 200);
    });
    // scroll with press enter
    $(".form-control").on('keyup', function(e) {
      var change, currPos, targetPos;
      if (e.keyCode === 13) {
        currPos = $(window).scrollTop();
        clearTimeout(scrollTimeOut);
        targetPos = positions.find(function(element) {
          return element > currPos;
        });
        targetPos = targetPos ? targetPos : positions[positions.length - 1];
        return scrollToPos(change = .50, currPos, targetPos, true);
      }
    });
    getFile = function() {
      var file, input;
      if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
      }
      input = document.getElementById('imageForm');
      if (!input) {
        return alert("Um, couldn't find the fileinput element.");
      } else if (!input.files) {
        return alert("This browser doesn't seem to support the `files` property of file inputs.");
      } else if (!input.files[0]) {
        return alert("Please select a file before clicking 'Load'");
      } else {
        return file = input.files[0];
      }
    };
    window.renderLinks = function(links) {
      var i, l, len, renderHTML;
      renderHTML = '';
      for (i = 0, len = links.length; i < len; i++) {
        l = links[i];
        renderHTML = renderHTML + '<a class="link" href="' + l.link + '">' + l.link + '</a>';
      }
      return $('.view.popup').html(renderHTML);
    };
    // submit form
    hasPopup = false;
    window.submitForm = function() {
      var age, ethnicity, gender, image, major, name, thisUrl;
      name = $('#nameForm').val();
      // city = $('#cityForm').val()
      major = $('#majorForm').val(); // school major
      ethnicity = $('#ethinicityForm').find(":selected").text();
      gender = $('#genderForm').find(":selected").text();
      image = getFile();
      ethnicity = ethnicity === 'African American/Black' ? 'African' : ethnicity; //hardcoded should be removed
      console.log(ethnicity);
      age = 0; // hardcoded stuff
      // name goes in box
      thisUrl = 'opportunies/q?ethinicity=' + ethnicity;
      console.log(thisUrl);
      return $.ajax({
        type: 'GET',
        url: thisUrl,
        datatype: 'json',
        contentType: 'application/json',
        success: function(data) {
          renderLinks(JSON.parse(data));
          $('.view.popup').addClass('active');
          return hasPopup = true;
        }
      });
    };
    // alert('Name: ' + name + ' City: ' + city + ' Major: ' + major + ' Ethinicity: ' + ethnicity + ' Gender: ' + gender + ' Age: ' + age)
    // $('.view.popup').addClass('active')
    // hasPopup = true
    // window.location = window.location; # refresh
    $('.view.last').click(function() {
      if (hasPopup) {
        console.log('heelo');
        hasPopup = false;
        return $('.view.popup').removeClass('active');
      }
    });
    return $('.view.last .submit-buttons').click(function(event) {
      return event.stopPropagation();
    });
  });

}).call(this);
