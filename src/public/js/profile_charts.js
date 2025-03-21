$(document).ready(() => {
  let chartIdToDelete = null;

  $(".delete-button").on("click", function () {
    chartIdToDelete = $(this).data("id");
    $("#confirmationModal").addClass("is-active");
  });

  $("#closeModal, #cancelDelete, .modal-background").on("click", () => {
    $("#confirmationModal").removeClass("is-active");
  });

  $("#confirmDelete").on("click", async () => {
    if (!chartIdToDelete) return;

    try {
      const response = await fetch(`/profile/charts/${chartIdToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload(); // Refresh the page to reflect changes
      } else {
        alert("Failed to delete chart.");
      }
    } catch (error) {
      console.error("Error deleting chart:", error);
      alert("An error occurred while deleting the chart.");
    } finally {
      $("#confirmationModal").removeClass("is-active");
    }
  });
});