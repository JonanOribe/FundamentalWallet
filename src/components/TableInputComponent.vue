<template>
  <div class="container">
    <p>Add your new stock: {{ stockName }}</p>
    <input v-model="stockName" placeholder="Add new stock symbol" />
    <button @click="updateStockList()">Add Stock to list</button>
  </div>
</template>

<script>

export default {
  name: "TableInputComponent",
  data() {
    return {
      StockList: [],
      stockName: null,
    };
  },
  methods: {
    updateStockList() {
      let newStock = {
        id: "FFFssdf",
        symbol: this.stockName,
        name: "APPLE",
        buyPrice: "20",
        timestamp: "1659417366",
      };
      const data = JSON.stringify(newStock);

      console.log(data);
    },
  },
};
</script>

<style  scoped>
h3 {
  margin-bottom: 5%;
}
</style>
