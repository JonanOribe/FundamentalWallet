<template>
  <div class="container input-area" style="margin-top: 0.5%;">
    <p class="animate-charcter">Add your new stock >>>   
  
  <button class="btn btn-outline-success settings" @click="showNewStockModal()"  v-if="this.showAddNewStock===false"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
</svg>
</button>

  <button class="btn btn-outline-success settings" @click="showNewStockModal()"  v-if="this.showAddNewStock===true"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
</svg>
</button>
</p>
<div v-show="showAddNewStock">
    <input class="input-elements" v-model="stockName" placeholder="AAPL" />
    <button class="btn btn-outline-success settings" style="margin-left: 0.5%;" @click="updateStockList(),showNewStockModal()">Add Stock to list</button>
    <div  style="margin-top:0.5%">Select acquisition condition:

    <select class="input-elements" v-model="statusPicked">
      <option value="long">Long</option>
      <option value="short">Short</option>
    </select>
    </div>
    <div style="margin-top:0.5%">
    Stock Price:
<input class="input-elements" type="number" data-decimals="2" min="0" max="100000" step="0.1" v-model.number="stockPrice"/>

    Stock Quantity:

<input class="input-elements" type="number" min="0" max="100000" step="1" v-model.number="stockQuantity"/>
</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableInputComponent",
  data() {
    return {
      showAddNewStock:false,
      stockName: null,
      qmAPIUrl: localStorage.getItem("qmAPIUrl"),
      client_id: localStorage.getItem("client_id"),
      statusPicked: "long",
      stockQuantity:1,
      stockPrice:100.5
    };
  },
  methods: {
    showNewStockModal(){
      this.showAddNewStock = this.showAddNewStock?false:true;
    },
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

      this.postUserStock(newStockData);
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
          this.client_id +
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
  }
};
</script>

<style scoped>
h3 {
  margin-bottom: 5%;
}

.input-area{
  border: 2px solid #198754;
    border-radius: 25px;
    padding: 0.8%;
    width: auto;
    margin-bottom: 0.5%;
    border-style: dashed ;
}

.input-elements{
    border: 3px solid #198754;
    border-radius: 25px;
    text-align: center;
}

.animate-charcter
{
   text-transform: uppercase;
  background-image: linear-gradient(
    -225deg,
    #231557 0%,
    #44107a 29%,
    #ff1361 67%,
    #fff800 100%
  );
  background-size: auto auto;
  background-clip: border-box;
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textclip 2s linear infinite;
  display: inline-block;
      font-size: 18px;
}

@keyframes textclip {
  to {
    background-position: 200% center;
  }
}
</style>
