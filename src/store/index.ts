import _ from 'lodash'
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { ParticipantType, ExpenseType, BalanceType } from '../types'

// define your typings for the store state
export interface State {
  lastParticipantId: number
  participants: ParticipantType[]
  participant: ParticipantType
  expenses: ExpenseType[]
  expense: ExpenseType
  balances: BalanceType[]
  balance: BalanceType
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    lastParticipantId: 0,
    participants: [],
    participant: {
      id: 0,
      name: '',
    },
    expenses: [],
    expense: {
      id: '' as string,
      title: '' as string,
      amount: 0,
      avg_amount: 0,
      payer: 0,
      beneficiaries: [],
    },
    balances: [],
    balance: {
      participant_id: 0,
      payAmount: 0,
      consumeAmount: 0,
      balance: 0,
    },
  },
  mutations: {
    ADD_PARTICIPANT(state, participantName: string) {
      state.participant = {
        id: state.lastParticipantId,
        name: participantName,
      }
      state.participants.push(state.participant)
      state.lastParticipantId++
    },
    UPDATE_PARTICIPANT(state, updateParticipant: ParticipantType) {
      const participantIndex = state.participants.findIndex(
        (x) => x.id == updateParticipant.id
      )
      state.participants[participantIndex].name = updateParticipant.name
    },
    DELETE_PARTICIPANT(state, deletedParticipant: ParticipantType) {
      const participantIndex = state.participants.findIndex(
        (x) => x.id == deletedParticipant.id
      )
      state.participants.splice(participantIndex, 1)
    },
    ADD_EXPENSE(state, expense: ExpenseType) {
      expense.avg_amount =
        expense.beneficiaries.length > 0
          ? expense.amount / expense.beneficiaries.length
          : expense.amount
      state.expenses.push(expense)
    },
    UPDATE_EXPENSE(state, expense: ExpenseType) {
      const expenseIndex = state.expenses.findIndex((x) => x.id == expense.id)
      state.expenses[expenseIndex] = expense
    },
    DELETE_EXPENSE(state, expense: ExpenseType) {
      const expenseIndex = state.expenses.findIndex((x) => x.id == expense.id)
      state.expenses.splice(expenseIndex, 1)
    },
    CALC_BALANCE(state) {
      // TODO: update expense is still has a bug in calculation
      state.balances = []
      state.participants.forEach((p) => {
        const pay = state.expenses.filter((x) => x.payer == p.id)
        const payAmount = _.sumBy(pay, function (o) {
          return o.amount
        })
        const consume = state.expenses.filter(
          (x) => x.beneficiaries.indexOf(p.id) != -1
        )
        const consumeAmount = _.sumBy(consume, function (o) {
          return o.avg_amount || 0
        })
        state.balances.push({
          participant_id: p.id,
          payAmount,
          consumeAmount,
          balance: payAmount - consumeAmount,
        })
      })
    },
  },
  actions: {
    calcBalance({ commit }) {
      commit('CALC_BALANCE')
    },
    addParticipant({ commit }, participantName: string) {
      commit('ADD_PARTICIPANT', participantName)
    },
    updateParticipant({ commit }, updatedParticipant: ParticipantType) {
      commit('UPDATE_PARTICIPANT', updatedParticipant)
    },
    deleteParticipant({ commit }, deletedParticipant: ParticipantType) {
      commit('DELETE_PARTICIPANT', deletedParticipant)
    },
    addExpense({ commit }, expense: ExpenseType) {
      commit('ADD_EXPENSE', expense)
    },
    updateExpense({ commit }, expense: ExpenseType) {
      commit('UPDATE_EXPENSE', expense)
    },
    deleteExpense({ commit }, expense: ExpenseType) {
      commit('DELETE_EXPENSE', expense)
    },
  },
  getters: {
    participantOptions: (state) => {
      const options = []
      for (const i in state.participants) {
        const p = state.participants[i]
        options.push({
          label: p.name,
          value: p.id,
        })
      }
      return options
    },
    nameOfBeneficiaries: (state) => (beneficiaries: number[]) => {
      const nameOfBeneficiaries: string[] = []
      beneficiaries.map((b) => {
        nameOfBeneficiaries.push(state.participants[b].name)
      })
      return nameOfBeneficiaries.join(', ')
    },
  },
  modules: {},
})

// define your own `useStore` composition function
// eslint-disable-next-line
export function useStore() {
  return baseUseStore(key)
}
