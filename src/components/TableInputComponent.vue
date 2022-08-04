<template>
  <div class="container">
    <p>Add your new stock: {{ stockName }}</p>
    <input v-model="stockName" placeholder="Add new stock symbol" />
    <button @click="updateStockList()">Add Stock to list</button>
    <div>Selected: {{ selected }}</div>

    <select v-model="selected">
      <option disabled value="">Please select one</option>
      <option>A</option>
      <option>B</option>
      <option>C</option>
    </select>
    Stock Price:
<input type="number" data-decimals="2" min="0" max="100000" step="0.1" v-model.number="stockPrice"/>

    Stock Quantity:

<input type="number" min="0" max="100000" step="1" v-model.number="stockQuantity"/>

    <div>Picked: {{ statusPicked }}</div>

    <input type="radio" id="long" value="long" v-model="statusPicked" />
    <label for="long">Long</label>

    <input type="radio" id="short" value="short" v-model="statusPicked" />
    <label for="short">Short</label>
  </div>
</template>

<script>
import APIkeysJson from "../../secrets/APIkeys.json";

export default {
  name: "TableInputComponent",
  data() {
    return {
      StockList: [],
      stockName: null,
      qmAPIUrl: null,
      userId: null,
      statusPicked: "long",
      stockQuantity:1,
      stockPrice:10.5
    };
  },
  methods: {
    updateStockList() {
      let newStock = {
        symbol: this.stockName,
        stocks_quantity: this.stockQuantity,
        price_on_buy: this.stockPrice,
        acquisition_condition: this.statusPicked,
        received_dividens: 12.6,
        operation_date: "1659417366",
      };
      const newStockData = JSON.stringify(newStock);

      console.log(newStockData);
      this.postUserStock(newStockData);
    },

    getAPIData() {
      for (let i = 0; i < APIkeysJson.length; i++) {
        if (APIkeysJson[i].source === "QMAPI") {
          this.qmAPIUrl = APIkeysJson[i].url;
        }
        if (APIkeysJson[i].source === "QMAPITestUser") {
          this.userId = APIkeysJson[i].userId;
        }
      }
    },

    postUserStock(newStockData) {
      // POST request using fetch with error handling
      const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: newStockData,
      };
      return fetch(
        this.qmAPIUrl +
          this.userId +
          "/portfolio/update_client_portolio_values",
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
  created() {
    this.getAPIData();
  },
};
</script>

<style scoped>
h3 {
  margin-bottom: 5%;
}
</style>
