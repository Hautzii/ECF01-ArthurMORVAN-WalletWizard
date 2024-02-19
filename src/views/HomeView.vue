<script setup lang="ts">
import type { Transaction } from "@/types/types";
import { ref, computed, Transition, onMounted } from "vue";
const transactions = ref<(Transaction)[]>([]);
const balance = ref(0);
const buy = {
  amount: ref(0),
  description: ref(""),
};
const gain = {
  amount: ref(0),
  description: ref(""),
};
const submitBuy = () => {
  const newObj = {
    ...buy,
    amount: buy.amount.value,
    description: buy.description.value,
    type: 'expense' as const,
    date: new Date()
  };
  transactions.value.push(newObj);
  localStorage.setItem("transactions", JSON.stringify(transactions.value));
  balance.value = balance.value - buy.amount.value;
  localStorage.setItem("balance", JSON.stringify(balance.value));
  showExpense.value = false;
  buy.amount.value = 0;
  buy.description.value = "";
};

const submitGain = () => {
  const newGain = {
    ...gain,
    amount: gain.amount.value,
    description: gain.description.value,
    type: 'income' as const,
    date: new Date()
  };
  transactions.value.push(newGain);
  localStorage.setItem("transactions", JSON.stringify(transactions.value));
  balance.value = balance.value + gain.amount.value;
  localStorage.setItem("balance", JSON.stringify(balance.value));
  showIncome.value = false;
  gain.amount.value = 0;
  gain.description.value = "";
};

onMounted(() => {
  const storedTransactions = localStorage.getItem("transactions");
  const storedBalance = localStorage.getItem("balance");
  if (storedTransactions) {
    transactions.value = JSON.parse(storedTransactions).map((transaction: Transaction) => {
      return { ...transaction, date: new Date(transaction.date) };
    });
  }
  if (storedBalance) {
    balance.value = JSON.parse(storedBalance);
  }
});
const expensesTotal = computed(() => {
  return transactions.value
    .filter(transaction => transaction.type === 'expense')
    .reduce((a, b) => a + b.amount, 0);
});

const incomeTotal = computed(() => {
  return transactions.value
    .filter(transaction => transaction.type === 'income')
    .reduce((a, b) => a + b.amount, 0);
});
const isSortedByLatest = ref(true);

const sortTransactions = () => {
  if (isSortedByLatest.value) {
    transactions.value.sort((a, b) => b.date.getTime() - a.date.getTime());
  } else {
    transactions.value.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  isSortedByLatest.value = !isSortedByLatest.value;
};
const showExpense = ref(false);
const showIncome = ref(false);

const balanceStyle = () => {
  return balance.value > 0 ? 'positive' : 'negative';
}
</script>

<template>
  <main>
    <div class="balance_title">Your balance</div>
    <div class="balance_amount" :class="balanceStyle()">{{ balance }}€</div>
    <div class="totals_wrapper">
      <div class="totals">
        <div class="break-line">Expense</div>
        <div class="break-line">Income</div>
      </div>
      <div class="totals_numbers">
        <div class="expense_number">{{ expensesTotal }}€</div>
        <div class="income_number">{{ incomeTotal }}€</div>
      </div>
      <div class="break-line">
        <img src="../assets/Add Ellipse Icon.svg" alt="add icon" @click="showExpense = !showExpense">
        <img src="../assets/Add Ellipse Icon.svg" alt="add icon" @click="showIncome = !showIncome">
      </div>
    </div>
    <Transition name="fade">
      <form @submit.prevent="submitBuy" v-if="showExpense">
        <label for="amount">Amount :</label>
        <input type="number" v-model="buy.amount.value" id="amount" />
        <label for="description">Description :</label>
        <input type="text" v-model="buy.description.value" id="description" />
        <button type="submit" class="submit">Submit</button>
      </form>
    </Transition>
    <Transition>
      <form @submit.prevent="submitGain" v-if="showIncome">
        <label for="amount">Amount :</label>
        <input type="number" v-model="gain.amount.value" id="amount" />
        <label for="description">Description :</label>
        <input type="text" v-model="gain.description.value" id="description" />
        <button type="submit" class="submit">Submit</button>
      </form>
    </Transition>
    <div class="history">History :   <img src="../assets/Sort Vertical Icon.svg" alt="sort icon" @click="sortTransactions"></div>
    <ul v-if="transactions.length > 0">
      <li v-for="transaction in transactions" :class="transaction.type">
        <div class="left_div">{{ transaction.description }}</div>
        <div class="right_div">
          <span v-if="transaction.type === 'expense'" class="expense">{{ transaction.amount }}€</span>
          <span v-else class="income">{{ transaction.amount }}€</span>
          <div class="filler" :class="transaction.type + '_filler'"></div>
        </div>
      </li>
    </ul>
  </main>
</template>

<style scoped>
img {
  height: 16px;
}
img:hover {
  cursor: pointer;
}
main {
  width: 325px;
  padding: 20px;
  background-color: white;
  border-radius: .5rem;
}

.balance_title,
.balance_amount {
  text-align: center;
}

.balance_amount {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 20px;
}

.totals {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
}

.totals_numbers {
  margin-top: -35px;
  margin-left: 55px;
  display: flex;
}

.totals_numbers :nth-child(2) {
  margin-left: 105px;
}

.break-line {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 20px;
}

.history {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 325px;
  overflow-y: auto;
}

li:first-child {
  margin-top: 5px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  background-color: #f4f4f4;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: .5rem;
}

.totals_wrapper {
  display: flex;
  justify-content: center;
  align-items: space-around;
  flex-direction: column;
  background-color: white;
  padding: 10px;
  border-radius: .5rem;
}

.left_div {
  text-transform: capitalize;
}

.right_div {
  display: flex;
  align-items: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.expense_filler,
.income_filler {
  height: 25px;
  width: 5px;
  margin-left: 10px;
}

.expense_filler {
  background-color: #f38181;
}

.income_filler {
  background-color: #95e1d3;
}

.expense_number, .negative {
  color: #f38181;
}

.income_number, .positive {
  color: #95e1d3;
}
</style>