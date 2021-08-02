<template>
  <div id="expense-page">
    <a-button type="primary" @click="showModal('add')"
      >&#9830; Thêm chi tiêu</a-button
    >
    <a-modal v-model:visible="modalVisible" title="Chi tiêu" @ok="handleOk()">
      Nội dung:
      <a-input v-model:value="title" placeholder="Nhập nội dung" />
      <br />

      <div class="mt-4">Số tiền:</div>
      <div class="flex items-center">
        <a-input-number
          v-model:value="amount"
          size="large"
          :formatter="
            (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          "
          :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
        />
        <strong class="ml-3">VNĐ</strong>
      </div>
      <br />

      Người thanh toán:
      <a-select
        v-model:value="payer"
        placeholder="Select a person"
        :options="participantOptions"
      >
      </a-select>
      <br />

      Người sử dụng:
      <a-checkbox-group
        v-model:value="beneficiaries"
        :options="participantOptions"
        class="mt-4"
      >
      </a-checkbox-group>
    </a-modal>

    <table class="my-6">
      <thead>
        <tr>
          <th>Nội dung</th>
          <th>Số tiền</th>
          <th>Người thanh toán</th>
          <th>Người sử dụng</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in expenses" :key="e">
          <td class="pr-5">{{ e.title }}</td>
          <td class="pr-5">{{ numberWithCommas(e.amount) }} VNĐ</td>
          <td class="pr-5">{{ participants[e.payer].name }}</td>
          <td class="pr-5">{{ nameOfBeneficiaries(e.beneficiaries) }}</td>
          <td>
            <!-- TODO: update expense is still has a bug in calculation -->
            <!-- <button
              class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mx-2"
              @click="showModal('edit', e, index)"
            >
              Sửa
            </button> -->
            <button
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              @click="deleteItem(e)"
            >
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <button
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      @click="$router.push('participants')"
    >
      &#8592; Step 1
    </button>

    <button
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded my-4"
      @click="$router.push('balances')"
    >
      Step 3 &#8594;
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, toRefs } from 'vue'
import { useStore } from '../store'
import { ExpenseType, ModalType } from '../types'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()

    // data
    const state = reactive({})

    const expense: ExpenseType = reactive({
      id: '' as string,
      title: '' as string,
      amount: 0 as number,
      payer: 0,
      beneficiaries: [],
    })

    const participants = computed(() => store.state.participants)
    const participantOptions = computed(() => store.getters.participantOptions)
    const expenses = computed(() => store.state.expenses)
    const nameOfBeneficiaries = computed(
      () => store.getters.nameOfBeneficiaries
    )

    if (participants.value.length === 0) {
      router.push('participants')
    }

    const modalVisible = ref<boolean>(false) // TODO: move to state
    let modalType = 'add' as ModalType

    const showModal = (type: ModalType, e: ExpenseType) => {
      modalType = type
      resetFields()
      if (modalType === 'edit') {
        Object.assign(expense, e)
      }
      modalVisible.value = true
    }

    const handleOk = () => {
      modalType === 'add' ? addExpense() : updateExpense()
    }

    const addExpense = () => {
      const expenseItem = {
        ...expense,
        id: '_' + Math.random().toString(36).substr(2, 9),
      }
      store.dispatch('addExpense', expenseItem)
      modalVisible.value = false
    }

    const updateExpense = () => {
      store.dispatch('updateExpense', { ...expense })
      modalVisible.value = false
    }

    const deleteItem = (e: ExpenseType) => {
      store.dispatch('deleteExpense', e)
    }

    const resetFields = () => {
      expense.title = ''
      expense.amount = 0
      expense.payer = 0
      expense.beneficiaries = []
    }

    const numberWithCommas = (x: number) => {
      return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0
    }

    return {
      state,
      participants,
      participantOptions,
      nameOfBeneficiaries,
      ...toRefs(expense),
      expenses,
      modalVisible,
      showModal,
      handleOk,
      deleteItem,
      numberWithCommas,
    }
  },
})
</script>

<style scoped>
.ant-input-number {
  width: 100%;
}
</style>
