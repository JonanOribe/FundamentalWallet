<template>
  <nav class="navbar navbar-expand-lg bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#" style="color: #198754">
        Fundamental Wallet</a
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarScroll"
        aria-controls="navbarScroll"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarScroll">
        <ul
          class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
          style="--bs-scroll-height: 100px"
        ></ul>
        <div class="progress investment_bar">
          <div
            class="progress-bar bg-success"
            role="progressbar"
            :style="{ width: balance_percentage + '%' }"
          >
            <b class="blackStrings">Available: {{ balance }}{{ currency }}</b>
          </div>
          <div
            class="progress-bar bg-warning"
            role="progressbar"
            :style="{ width: money_on_investment_percentage + '%' }"
          >
            <b class="blackStrings"
              >Invested: {{ money_on_investment }}{{ currency }}</b
            >
          </div>
        </div>
        <button type="button" class="btn btn-outline-success settings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-heart-pulse"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053.918 3.995.78 5.323 1.508 7H.43c-2.128-5.697 4.165-8.83 7.394-5.857.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17c3.23-2.974 9.522.159 7.394 5.856h-1.078c.728-1.677.59-3.005.108-3.947C13.486.878 10.4.28 8.717 2.01L8 2.748ZM2.212 10h1.315C4.593 11.183 6.05 12.458 8 13.795c1.949-1.337 3.407-2.612 4.473-3.795h1.315c-1.265 1.566-3.14 3.25-5.788 5-2.648-1.75-4.523-3.434-5.788-5Zm8.252-6.686a.5.5 0 0 0-.945.049L7.921 8.956 6.464 5.314a.5.5 0 0 0-.88-.091L3.732 8H.5a.5.5 0 0 0 0 1H4a.5.5 0 0 0 .416-.223l1.473-2.209 1.647 4.118a.5.5 0 0 0 .945-.049l1.598-5.593 1.457 3.642A.5.5 0 0 0 12 9h3.5a.5.5 0 0 0 0-1h-3.162l-1.874-4.686Z"
            ></path>
          </svg>
        </button>
        <button type="button" class="btn btn-outline-success settings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-gear"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
            ></path>
            <path
              d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from "vue";
import { userInvestmentValuesStore } from "@/stores/investmentValuesStore";
export default {
  name: "NavBarComponent",
    setup() {//TODO GETTERS 
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
      expanded: false,
      balance: parseInt(localStorage.getItem("balance")),
      money_on_investment: parseInt(
        localStorage.getItem("money_on_investment")
      ),
      balance_percentage: 100,
      money_on_investment_percentage: 0,
      currency: localStorage.getItem("currency") === "EU" ? "€" : "$",
    };
  },
  methods: {
    getPercentages() {
      let total_amount = this.money_on_investment + this.balance;

      this.balance_percentage = (this.balance / total_amount) * 100;
      this.money_on_investment_percentage =
        (this.money_on_investment / total_amount) * 100;
    },
  },
  created() {
    this.getPercentages();
  },
};
</script>

<style scoped>
a {
  color: white;
}

.active {
  color: green !important;
}

.settings {
  margin-left: 0.5%;
}

.investment_bar {
  width: 50%;
  margin-left: 0.5%;
  margin-right: 0.5%;
}

.blackStrings {
  color: black;
  font-size: 14px;
}
</style>
