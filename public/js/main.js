$(document).ready(() => {
  function updateBtns(btns) {
    const key = btns || $('input[name=\'team_id\']').val();
    $('.edit_team').attr('href', `/team/${key}`);
    $('.leave_team').attr('href', `/team/${key}/quit`);
  }

  function resetUI() {
    if ($('input[name=\'team_id\']').val()) {
      updateBtns();
      $('.new_team').hide();
      $('.edit_team').show();
      $('.leave_team').show();
      $('input[name=\'team_id\']').attr('readonly', 'readonly');
      $('.message').html('Share this key with group members.');
    }
    else {
      $('.edit_team').hide();
      $('.leave_team').hide();
    }
  }

  function saveUserInfo(e) {
    if (e) e.preventDefault();

    const obj = {
      username: $('input[name=\'uniqname\']').val(),
      team_id: $('input[name=\'team_id\']').val(),
    };

    $.ajax({
      url: '/user',
      type: 'POST',
      data: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
      dataType: 'json',
      success(data) {
        console.log(data);

        if (data.error) {
          alert(data.error);
          return;
        }

        const oldText = $('#save').html();
        $('#save').html('Saved!');
        resetUI();
        setTimeout(() => $('#save').html(oldText), 2000);
      },
      error(data) {
        console.log(data);
        alert(`Something is wrong!\nBother Otto and give him this: \n\n${data}`);
      },
    });
  }

  $('.new_team').click(() => {
    const key = Math.random().toString(36).substring(7);
    $.post('/key', { key }, (data) => {
            // console.log('Pre-key: ' + key);
      $('input[name=\'team_id\']').val(key);
            // console.log('Input-key: ' + $('input[name='team_id']').val());
      updateBtns(key);
      console.log(data);
      saveUserInfo(null);
    });
  });

  if (window.location.pathname === '/user') {
    resetUI();
  }

  $('#user_signup').submit(saveUserInfo);

  $('#team_edit').submit((e) => {
    e.preventDefault();

    const obj = {
      name: $('input[name=\'name\']').val(),
    };

    console.log(obj);
    $.ajax({
      url: `/team/${$('input[name=\'id\']').val()}`,
      type: 'POST',
      data: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
      dataType: 'json',
      success(data) {
        console.info(data);
      },
    });
  });
});

function getByName(name, i) {
  return $($(`input[name=\'${name}\']`)[i]).val();
}
