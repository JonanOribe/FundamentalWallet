<template>
  <div class="container">
    <h3>
      Stocks {{ loadedStocks }} of {{ numberOfStocks }}
      <div v-if="errorOnLoading" class="btn btn-outline-danger">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-exclamation-diamond-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
          />
        </svg>
      </div>
    </h3>
    <div
      class="alert alert-danger"
      role="alert"
      :style="{ display: errorOnAPI }"
    >
      {{ errorMessageFromAPI }}
    </div>
    <table class="table" style="border: 2px dashed #198754">
      <thead>
        <tr>
          <th scope="col" class="white_text">Symbol</th>
          <th scope="col" class="white_text">Current Price</th>
          <th scope="col" class="white_text">Price on buy</th>
          <th scope="col" class="white_text">Stock Quantity</th>
          <th scope="col" class="white_text">Diff</th>
          <th scope="col" class="white_text">Acquisition Condition</th>
          <th scope="col" class="white_text">Acquisition Date</th>
          <th scope="col" class="white_text">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="stock in stocks"
          v-bind:key="stock['id']"
          :class="`${parseInt(stock['diff']) >= 0 ? 'benefits' : 'noBenefits'}`"
        >
          <th scope="row" class="white_text">{{ stock["symbol"] }}</th>
          <td class="white_text">{{ stock["price"] }}{{ currency }}</td>
          <td class="white_text">{{ stock["priceOnBuy"] }}{{ currency }}</td>
          <td class="white_text">{{ stock["stocksQuantity"] }}</td>
          <td class="white_text">{{ stock["diff"] }}{{ currency }}</td>
          <td class="white_text">{{ stock["acquisitionCondition"] }}</td>
          <td class="white_text">{{ stock["acquisitionDate"] }}</td>
          <td>
            <button
              type="button"
              class="btn btn-outline-warning"
              @click="toogleModal(stock)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-trash3-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"
                ></path>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <ModalComponent :stock="modalData" :modalStatus="modalDisplay" />
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import APIkeysJson from "../../secrets/APIkeys.json";
import ModalComponent from "@/components/ModalComponent.vue";
import { userInvestmentValuesStore } from "@/stores/investmentValuesStore";

export default {
  name: "StocksComponent",
  components: {
    ModalComponent,
  },
  setup() {
    const investmentValuesStore = userInvestmentValuesStore();
    let balanceToggleValue = ref(false);
    let moneyOnInvestmentToggleValue = ref(false);
    investmentValuesStore.changeBalanceValue(balanceToggleValue);
    investmentValuesStore.changeMoneyOnInvestment(moneyOnInvestmentToggleValue);
    return {
      balanceToggleValue,
      moneyOnInvestmentToggleValue,
    };
  },
  data() {
    return {
      userStocks: [],
      stocks: [],
      qmAPIUrl: localStorage.getItem("qmAPIUrl"),
      client_id: localStorage.getItem("client_id"),
      stockSource: null,
      fmp: null,
      numberOfStocks: 0,
      loadedStocks: 0,
      stocksLoadedFlag: false,
      currency: localStorage.getItem("currency") === "EU" ? "€" : "$",
      modalDisplay: "none",
      modalData: null,
      errorOnAPI: "none",
      errorMessageFromAPI: null,
      diffSum: 0,
    };
  },
  methods: {
    toogleModal(stock) {
      let elem = document.getElementsByClassName("modal")[0];
      this.modalDisplay = elem.style.display === "none" ? "block" : "none";
      this.modalData = stock;
    },
    getAPIData() {
      for (let i = 0; i < APIkeysJson.length; i++) {
        if (APIkeysJson[i].source === "fmp") {
          this.fmp = require("financialmodelingprep")(APIkeysJson[i].key);
        }
      }
    },
    getUserStocks() {
      // POST request using fetch with error handling
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      return fetch(
        this.qmAPIUrl + this.client_id + "/portfolio",
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
          console.log(data);
          this.userStocks = data[0].portfolio_values;
          this.numberOfStocks = data[0].portfolio_values.length;
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },
    retrieveOnlyDataNotInLocalStorage() {
      let tempUserStocks = [];
      this.userStocks.forEach((selectedStock) => {
        if (localStorage.getItem(selectedStock["symbol"]) === null) {
          tempUserStocks.push(selectedStock);
        }
      });
      this.userStocks = tempUserStocks;
    },
    retrieveStocksDataFromAPI() {
      let valueToJSON;
      this.userStocks.forEach((selectedStock) => {
        if (localStorage.getItem(selectedStock["symbol"]) === null) {
          axios
            .get(
              this.fmp
                .stock(selectedStock["symbol"])
                .quote()
                .then((res) => {
                  let mergedData = {
                    ...res[0],
                    symbol: selectedStock["symbol"],
                    priceOnBuy: selectedStock["price_on_buy"],
                    stocksQuantity: selectedStock["stocks_quantity"],
                    acquisitionCondition:
                      selectedStock["acquisition_condition"],
                    acquisitionDate: selectedStock["operation_date"],
                    diff: parseFloat(
                      res[0]["price"] * selectedStock["stocks_quantity"] -
                        selectedStock["price_on_buy"] *
                          selectedStock["stocks_quantity"]
                    ).toFixed(2),
                  };
                  this.stocks.push(mergedData);
                  valueToJSON = JSON.parse(
                    localStorage.getItem(selectedStock["symbol"])
                  );

                  localStorage.setItem(valueToJSON);
                })
            )
            .catch((e) => {
              console.log(e);
              this.errorMessageFromAPI = e;
            });
        } else {
          valueToJSON = JSON.parse(
            localStorage.getItem(selectedStock["symbol"])
          );

          this.stocks.push(valueToJSON);
        }
        this.diffSum += parseFloat(valueToJSON["diff"]);
        this.loadedStocks++;
      });

      if (this.loadedStocks == 0) {
        this.errorOnAPI = "block";
        this.stocksLoadedFlag = false;
        setTimeout(() => {
          this.errorOnAPI = "none";
        }, "1500");
      } else {
        this.stocksLoadedFlag = true;
        localStorage.setItem("last_stocks_values_update_timestamp", Date.now());
      }
      for (let i = 0; i < this.stocks.length; i++) {
        this.moneyOnInvestmentToggleValue += parseFloat(this.stocks[i]["diff"]);
      }
    },
  },
  computed: {
    errorOnLoading() {
      if (this.stocksLoadedFlag) {
        return this.loadedStocks != this.numberOfStocks ? true : false;
      }
      return false;
    },
  },
  created() {
    this.getAPIData();
    this.getUserStocks().then(() => {
      this.retrieveStocksDataFromAPI();
    });
  },
};
</script>

<style scoped>
h3 {
  margin-bottom: 1%;
}

.noBenefits {
  background: #ff0000b8;
  border: 1px solid black;
}

.benefits {
  background: #198754;
  border: 1px solid black;
}

.white_text {
  color: white;
  font-weight: bold;
}

.modal-content {
  background: black;
  border: 1px solid #198754;
  border-radius: 25px;
}
</style>
