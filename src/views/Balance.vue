<template>
  <div id="balance-page">
    <div class="mb-6">
      - Với <span class="text-green-800">số dư dương (+)</span> sẽ là số tiền
      bạn nhận lại.<br />
      - Với <span class="text-pink-800">số dư âm (-)</span> sẽ là số tiền bạn
      cần trả thêm.<br />
    </div>
    <a-list :grid="{ gutter: 16, xs: 1 }" :data-source="balances">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card
            :title="participants[item.participant_id].name"
            class="text-red-400"
          >
            <p>
              Đã trả:
              <strong>{{ numberWithCommas(item.payAmount) }} VNĐ</strong>
            </p>
            <p>
              Đã dùng:
              <strong>{{ numberWithCommas(item.consumeAmount) }} VNĐ</strong>
            </p>
            <hr />
            <h4>
              Số dư = Đã trả - Đã dùng =
              <strong :class="balanceColor(item.balance)">{{
                numberWithCommas(item.balance)
              }}</strong>
            </h4>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()
    store.dispatch('calcBalance')

    const balances = computed(() => store.state.balances)
    const participants = computed(() => store.state.participants)

    if (participants.value.length === 0) {
      router.push('participants')
    }

    const balanceColor = (balance: number) => {
      return balance > 0 ? 'text-green-800' : 'text-pink-800'
    }

    const numberWithCommas = (x: number) => {
      return x
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .split('.')[0]
    }

    return {
      balances,
      participants,
      balanceColor,
      numberWithCommas,
    }
  },
})
</script>
