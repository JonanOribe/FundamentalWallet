<template>
  <div class="container">
    <h3>Users</h3>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Name</th>
          <th scope="col">Symbol</th>
          <th scope="col">Price</th>
          <th scope="col">BuyPrice</th>
          <th scope="col">Diff</th>
          <th scope="col">timestamp</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in stocks" v-bind:key="stock['id']" :class="`${parseInt(stock['diff'])>=0? 'benefits':'noBenefits'}`">
          <td>{{ stock["id"] }}</td>
          <td>{{ stock["name"] }}</td>
          <th scope="row">{{ stock["symbol"] }}</th>
          <td>{{ stock["price"] }}</td>
          <td>{{ stock["buyPrice"] }}</td>
          <td>{{ stock["diff"] }}</td>
          <td>{{ stock["timestamp"] }}</td>
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
      fmp:null
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
         this.fmp = require('financialmodelingprep')(APIkeysJson[i].key);
        }
      }

      this.userStocks.forEach((selectedStock) =>
        axios
          .get(
            this.fmp.stock(selectedStock['symbol']).quote().then((res) => {
            let mergedData = {
              ...res[0],
              id: selectedStock["id"],
              name: selectedStock["name"],
              symbol: selectedStock["symbol"],
              buyPrice: selectedStock["buyPrice"],
              timestamp: selectedStock["timestamp"],
              diff: parseFloat(res[0]["price"] - selectedStock["buyPrice"]).toFixed(2)
            };
            this.stocks.push(mergedData);
          })
          )
      );
    },
  },
  created() {
    this.retrieveStocksDataFromAPI();
  },
};
</script>

<style>
h3 {
  margin-bottom: 5%;
}

.noBenefits{
    background: #ff0000b8;
}

.benefits{
    background: #008000a6;
}
</style>
