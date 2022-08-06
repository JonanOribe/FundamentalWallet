<template>
  <div
    class="modal"
    tabindex="-1"
    role="dialog"
    :style="{ display: modalDisplay }"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Do you want to delete this stock?</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="toogleModal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>This will delete data from database.{{ stock }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteStock(stock)"
          >
            Delete stock
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
            @click="toogleModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalComponent",
  props: {
    stock: null,
    modalStatus:null
  },
  data() {
    return {
      modalDisplay: "none",
    };
  },
  methods: {
    toogleModal() {
      this.modalDisplay = this.modalStatus === "none" ? "block" : "none";
    },
    deleteStock(stock) {
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      return fetch(
        this.qmAPIUrl +
          this.client_id +
          "/portfolio/" +
          this.portfolioId +
          "/delete_stock_from_portfolio/" +
          stock.symbol,
        requestOptions
      )
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },
  },
};
</script>

<style scoped>
.modal-content {
  background: black;
  border: 1px solid #198754;
  border-radius: 25px;
}
</style>
