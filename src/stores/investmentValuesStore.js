// stores/counter.js
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const userInvestmentValuesStore = defineStore(
  "investmentValuesStore",
  () => {
    const userInvestmentValues = ref({
      balance: 0,
      money_on_investment: 0,
    });

    const changeBalanceValue = (newValue) => {
      userInvestmentValues.value.balance = newValue;
    };

    const changeMoneyOnInvestment = (newValue) => {
      userInvestmentValues.value.money_on_investment = newValue;
    };

    if (localStorage.getItem("investmentValues")) {
      userInvestmentValues.value = JSON.parse(
        localStorage.getItem("investmentValues")
      );
    }
    watch(
      userInvestmentValues,
      (investmentValues) => {
        localStorage.setItem(
          "investmentValues",
          JSON.stringify(investmentValues)
        );
      },
      { deep: true }
    );
    return {
      userInvestmentValues,
      changeBalanceValue,
      changeMoneyOnInvestment,
    };
  }
);
