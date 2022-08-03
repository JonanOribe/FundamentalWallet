<template>
  <div class="container">
    <h3>Stocks</h3>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Name</th>
          <th scope="col">Symbol</th>
          <th scope="col">Price</th>
          <th scope="col">BuyPrice</th>
          <th scope="col">Diff</th>
          <th scope="col">Timestamp</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="stock in stocks"
          v-bind:key="stock['id']"
          :class="`${parseInt(stock['diff']) >= 0 ? 'benefits' : 'noBenefits'}`"
        >
          <td>{{ stock["id"] }}</td>
          <td>{{ stock["name"] }}</td>
          <th scope="row">{{ stock["symbol"] }}</th>
          <td>{{ stock["price"] }}</td>
          <td>{{ stock["buyPrice"] }}</td>
          <td>{{ stock["diff"] }}</td>
          <td>{{ stock["timestamp"] }}</td>
          <td><button type="button" class="btn btn-outline-warning">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
</svg>
                
              </button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import APIkeysJson from "../../secrets/APIkeys.json";
import StockList from "../assets/data/StockList.json";

export default {
  name: "StocksComponent",
  data() {
    return {
      userStocks: [],
      stocks: [],
      stockSource: null,
      fmp: null,
    };
  },
  methods: {
    getUserStocks() {
      StockList.forEach((element) => {
        this.userStocks.push(element);
      });
    },
    retrieveStocksDataFromAPI() {
      this.getUserStocks();
      for (let i = 0; i < APIkeysJson.length; i++) {
        if (APIkeysJson[i].source === "fmp") {
          this.fmp = require("financialmodelingprep")(APIkeysJson[i].key);
        }
      }

      this.userStocks.forEach((selectedStock) =>
        axios
          .get(
            this.fmp
              .stock(selectedStock["symbol"])
              .quote()
              .then((res) => {
                let mergedData = {
                  ...res[0],
                  id: selectedStock["id"],
                  name: selectedStock["name"],
                  symbol: selectedStock["symbol"],
                  buyPrice: selectedStock["buyPrice"],
                  timestamp: selectedStock["timestamp"],
                  diff: parseFloat(
                    res[0]["price"] - selectedStock["buyPrice"]
                  ).toFixed(2),
                };
                this.stocks.push(mergedData);
              })
          )
          .catch((e) => {
            console.log(e);
          })
      );
    },
  },
  created() {
    this.retrieveStocksDataFromAPI();
  },
};
</script>

<style scoped>
h3 {
  margin-bottom: 1%;
}

.noBenefits {
  background: #ff0000b8;
}

.benefits {
  background: #008000a6;
}
</style>
