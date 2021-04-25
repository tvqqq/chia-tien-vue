<template>
  <div id="balance-page">
    <div class="">
      - Với số dư dương (+) sẽ là số tiền bạn nhận lại.<br />
      - Với số dư âm (-) sẽ là số tiền bạn cần trả thêm.<br />
    </div>
    <a-list :grid="{ gutter: 16, xs: 2 }" :data-source="balances">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card
            :title="participants[item.participant_id].name"
            class="text-red-400"
          >
            <p>
              Đã trả: <strong>{{ item.payAmount }} VNĐ</strong>
            </p>
            <p>
              Đã dùng: <strong>{{ item.consumeAmount }} VNĐ</strong>
            </p>
            <hr />
            <h4>
              Số dư = Đã trả - Đã dùng = <strong>{{ item.balance }}</strong>
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

    const balances = computed(() => store.state.balances)
    const participants = computed(() => store.state.participants)

    if (participants.value.length === 0) {
      router.push('participants')
    }

    return {
      balances,
      participants,
    }
  },
})
</script>
