let chartIdToDelete = null;

// Open the confirmation modal when the delete button is clicked
$('.delete-button').on('click', function () {
  chartIdToDelete = $(this).data('id');
  $('#confirmationModal').addClass('is-active');
});

// Close the modal when the close button or cancel button is clicked
$('#closeModal, #cancelDelete').on('click', function () {
  $('#confirmationModal').removeClass('is-active');
  chartIdToDelete = null;
});

// Handle the deletion when the confirm button is clicked
$('#confirmDelete').on('click', function () {
  if (chartIdToDelete) {
    $.ajax({
      url: '/profile/charts/delete',
      method: 'POST',
      data: { id: chartIdToDelete },
      success: function (response) {
        // Remove the deleted card from the DOM
        $(`.delete-button[data-id="${chartIdToDelete}"]`).closest('.chart-card').remove();
        $('#confirmationModal').removeClass('is-active');
      },
      error: function (error) {
        console.error('Error deleting chart:', error);
      }
    });
  }
});