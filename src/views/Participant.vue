<template>
  <div id="participant-page">
    <a-button type="primary" @click="showModal('add')">
      &#9830; Thêm người tham gia
    </a-button>
    <a-modal
      v-model:visible="modalVisible"
      title="Người tham gia"
      @ok="handleOk()"
    >
      <a-input v-model:value="state.name" placeholder="Nhập tên" />
    </a-modal>

    <table class="my-6">
      <thead>
        <tr>
          <th>Tên</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in participants" :key="p">
          <td class="pr-5">{{ p.name }}</td>
          <td>
            <button
              class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mx-2"
              @click="showModal('edit', p)"
            >
              Sửa
            </button>
            <button
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              @click="deleteItem(p)"
            >
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <button
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      @click="$router.push('expenses')"
    >
      Step 2 &#8594;
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { useStore } from '../store'
import { ParticipantType, ModalType } from '../types'

export default defineComponent({
  setup() {
    const store = useStore()

    // data
    const state = reactive({
      id: 0 as number,
      name: '' as string,
    })
    const modalVisible = ref<boolean>(false)
    let modalType = 'add' as ModalType

    // computed
    const participants = computed(() => store.state.participants)

    // methods
    const showModal = (type: ModalType, p: ParticipantType) => {
      modalType = type
      state.name = ''
      if (modalType === 'edit') {
        state.name = p.name
        state.id = p.id
      }
      modalVisible.value = true
    }

    const handleOk = () => {
      modalType === 'add' ? addParticipant() : updateParticipant()
    }

    const addParticipant = () => {
      store.dispatch('addParticipant', state.name)
      modalVisible.value = false
    }

    const updateParticipant = () => {
      store.dispatch('updateParticipant', {
        id: state.id,
        name: state.name,
      })
      modalVisible.value = false
    }

    const deleteItem = (p: ParticipantType) => {
      // Check partipant is existed in expenses
      const participantBalance = store.state.balances.find((b) => {
        return b.participant_id == p.id
      })
      if (
        participantBalance?.payAmount !== 0 ||
        participantBalance?.consumeAmount !== 0
      ) {
        alert('Người này không thể xóa vì có liên quan tới Chi tiêu!')
        return
      }
      store.dispatch('deleteParticipant', p)
    }

    return {
      state,
      participants,
      handleOk,
      addParticipant,
      updateParticipant,
      modalVisible,
      showModal,
      deleteItem,
    }
  },
})
</script>
