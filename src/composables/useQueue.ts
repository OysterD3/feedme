import { reactive, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export const QUEUE_TYPE = {
  vip: 'VIP',
  normal: 'NORMAL',
} as const;

type QueueType = (typeof QUEUE_TYPE)[keyof typeof QUEUE_TYPE];
type QueueData = {
  id: string;
  label: string;
  type: QueueType;
};
type QueueMethods = {
  enqueue: (type: QueueType) => QueueData;
  dequeue: (id: string) => null | QueueData;
};

export const useQueue = (
  initialValue: QueueData[] = [],
): [QueueData[], QueueMethods] => {
  const state = reactive(initialValue);
  const currentRunningNumber = ref(1);
  return [
    state,
    {
      enqueue: (type) => {
        const item = {
          id: uuidv4(),
          label: `Order #${currentRunningNumber.value} (${
            type === QUEUE_TYPE.vip ? 'VIP' : 'Normal'
          })`,
          type,
          status: QUEUE_STATUS.pending,
        };
        if (type === QUEUE_TYPE.normal) {
          state.push(item);
        } else {
          if (state.length === 0) {
            state.push(item);
          } else {
            for (let i = 0; i < state.length; i++) {
              if (state[i].type === QUEUE_TYPE.vip && i === state.length - 1) {
                state.push(item);
                break;
              }
              if (state[i].type === QUEUE_TYPE.normal) {
                state.splice(i === 0 ? 0 : i, 0, item);
                break;
              }
            }
          }
        }
        currentRunningNumber.value += 1;
        return item;
      },
      dequeue: (id) => {
        const idx = state.findIndex((v) => v.id === id);
        let item: null | QueueData = null;
        if (idx >= 0) {
          item = state[idx];
          state.splice(idx, 1);
        }
        return item;
      },
    },
  ];
};
