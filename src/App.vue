<template>
  <div id="app">
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <NavBarComponent />
    <TableInputComponent />
    <StocksComponent />
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import NavBarComponent from "./components/NavBarComponent.vue";
import StocksComponent from "./components/StocksComponent.vue";
import TableInputComponent from "./components/TableInputComponent.vue";
import APIkeysJson from "../secrets/APIkeys.json";

export default {
  name: "App",
  components: {
    //HelloWorld,
    NavBarComponent,
    TableInputComponent,
    StocksComponent,
  },
  data() {
    return {
      qmAPIUrl: "https://qm-dashboard-api.herokuapp.com/",
      userId: "NzIMN8jMOZyVuWktmLMwa1jDvdMqXbc3",
      portfolioId: "62ee8470f14037000aa60257",
      forexEchange: null,
      belowRange: true,
    };
  },
  methods: {
    setDataForStorage(data) {
      localStorage.setItem("qmAPIUrl", this.qmAPIUrl);
      localStorage.setItem("portfolioId", this.portfolioId);
      let arrayOfKeys = Object.keys(data);
      for (let i = 0; i < arrayOfKeys.length; i++) {
        let tempKey = arrayOfKeys[i];
        localStorage.setItem(tempKey, data[tempKey]);
      }
    },
    getUserData() {
      // POST request using fetch with error handling
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      return fetch(this.qmAPIUrl + "profile/" + this.userId, requestOptions)
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          this.setDataForStorage(data[0]);
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },
    getForexRatios() {
      if (JSON.parse(localStorage.getItem("forexValues"))) {
        this.belowRange =
          Date.now - JSON.parse(localStorage.getItem("forexValues")).timestamp >
          86400000
            ? true
            : false;
      }
      if (this.belowRange) {
        let base = "EUR";
        let symbols = "USD,CAD,JPY,GBP,AUD,CNY";
        var myHeaders = new Headers();
        myHeaders.append("apikey", this.forexEchange);

        var requestOptions = {
          method: "GET",
          redirect: "follow",
          headers: myHeaders,
        };

        return fetch(
          `https://api.apilayer.com/exchangerates_data/latest?symbols=${symbols}&base=${base}`,
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => localStorage.setItem("forexValues", result))
          .catch((error) => console.log("error", error));
      }
    },
    saveForexValues() {
      let preFormat = JSON.parse(localStorage.getItem("forexValues"));
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preFormat),
      };
      return fetch(this.qmAPIUrl + "utils/forex_dict/create", requestOptions)
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
    getAPIData() {
      for (let i = 0; i < APIkeysJson.length; i++) {
        if (APIkeysJson[i].source === "apilayerForexEchange") {
          this.forexEchange = APIkeysJson[i].key;
        }
      }
    },
  },
  created() {
    this.getAPIData();
    this.getUserData();
    this.getForexRatios();
  },
  mounted() {
    if (this.belowRange) {
      setTimeout(() => {
        this.saveForexValues();
      }, "1000");
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background: black;
}
.body {
  color: white;
  background: black;
}
</style>
