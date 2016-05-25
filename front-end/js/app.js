import $ from 'jquery';
import page from 'page';

page('/', function (ctx, next) {
  $.get('/ficheros', function(files) {
    renderFiles(files);
  });
});

page();

function renderFiles(files){
  var $filesContainer = $('#files-container');
  $filesContainer.find('.loader').remove();
  $filesContainer.empty();
  var fileElement;
  for(var i in files){
    fileElement = '<div class="file-element">';
    fileElement += '<div class="file-element-image-container">';
    if(files[i].filename.indexOf('.pdf') != -1)
      fileElement += '<img src="images/pdflogo.png" height="100" width="100">';
    else if(files[i].filename.indexOf('.docx') != -1)
      fileElement += '<img src="images/word-icon.jpg" height="100" width="100">';
    else
      fileElement += '<img src="images/pptlogo.png" height="100" width="100">';
    fileElement += '</div>';
    fileElement += '<p><b>Nombre</b>: ' + files[i].filename + '</p>';
    fileElement += '<p><b>Tamaño</b>: ' + files[i].length + 'B</p>';
    fileElement += '<p><b>Autor</b>: ' + files[i].metadata.autor + '</p>';
    fileElement += '<p><b>Asignatura</b>: ' + files[i].metadata.asignatura + '</p>';
    fileElement += '<p><b>Curso</b>: ' + files[i].metadata.curso + '</p>';
    fileElement += '<p><b>Semestre</b>: ' + files[i].metadata.semestre + '</p>';
    fileElement += '<p><b>Tipo</b>: ' + files[i].metadata.tipo + '</p>';
    fileElement += '</div>';

    $filesContainer.append(fileElement);
  }
}


$(".dropdown .dropdown-trigger-container .text-container").on('click', function() {
  $(this).parent().parent().find('.dropdown-options-container ul').slideToggle('fast');
});
// $(".dropdown .dropdown-options-container ul li a").on('click', function() {
//   $(this).parent().parent().hide();
// });
$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown")) $(".dropdown .dropdown-options-container ul").hide();
});

$('.mutliSelect li').on('click', function() {
  var $checkbox = $(this).find('input');
  var title = $checkbox.val();
  if ($checkbox.is(':checked')) {
    $('span[title="' + title + '"]').remove();
    $checkbox.prop('checked', false);
    if($('.text-container').children().length == 1)
      $(".select-text").show();
  }
  else{
    $checkbox.prop('checked', true);
  }
});

$("#app-search .button").on('click', function() {
  var $filesContainer = $('#files-container');
  $filesContainer.html('<div class="loader"></div>');
  var $checkboxes = $("input");
  var filters = {asignaturas:[], semestres: [], tipos: []};
  $.each($checkboxes, function(i, key){
    if($(key).is(':checked')){
      if($(key).parent().parent().parent().parent().parent().find('.select-text')[0].textContent == 'Asignaturas')
        filters.asignaturas.push(key.value);
      else if($(key).parent().parent().parent().parent().parent().find('.select-text')[0].textContent == 'Semestres')
        filters.semestres.push(key.value);
      else
        filters.tipos.push(key.value);
    }
  });

  $.ajax('/filtraArchivos', {
    method: 'GET',
    data: filters,
    success: function(files){
      renderFiles(files);
    }
  });
});
