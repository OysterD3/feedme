<template>
  <div class="flex space-x-lg">
    <OngoingOrders :items="queue" />
    <CompletedOrders :items="completedOrders" />
  </div>
  <BotsCard :items="bots" />
  <div class="flex gap-4">
    <Button @click="() => addOrder(QUEUE_TYPE.normal)">New Normal Order</Button>
    <Button @click="() => addOrder(QUEUE_TYPE.vip)">New VIP Order</Button>
    <Button @click="spawnBot">+ Bot</Button>
    <Button @click="removeLastBot">- Bot</Button>
  </div>
</template>

<script setup lang="ts">
import {
  QUEUE_STATUS,
  QUEUE_TYPE,
  type QueueType,
  useQueue,
} from './composables/useQueue.ts';
import { reactive, ref } from 'vue';
import { Bot, BOT_STATUS } from './models/Bot.ts';
import Button from './components/Button/Button.vue';
import OngoingOrders from './components/OngoingOrders.vue';
import CompletedOrders from './components/CompletedOrders.vue';
import BotsCard from './components/BotsCard.vue';

const [queue, { enqueue, dequeue, updateStatus }] = useQueue();
const bots = ref<Bot[]>([]);
const completedOrders = reactive<{ id: string; label: string }[]>([]);

const processOrder = async (orderId: string, bot: Bot) => {
  updateStatus(orderId, QUEUE_STATUS.processing);
  await bot.processOrder(orderId);
  const order = dequeue(orderId);
  if (order) {
    completedOrders.push({ id: order.id, label: order.label });
  }
  bots.value = [...bots.value];

  const anotherPendingOrder = queue.find(
    (v) => v.status === QUEUE_STATUS.pending,
  );
  if (anotherPendingOrder) {
    await processOrder(anotherPendingOrder.id, bot);
  }
};

const addOrder = (type: QueueType) => {
  const item = enqueue(type);
  const activeBot = bots.value.find((v) => v.status === BOT_STATUS.idle);
  if (activeBot) {
    processOrder(item.id, activeBot);
  }
};

const spawnBot = () => {
  const bot = new Bot();
  bots.value = [...bots.value, bot];
  const pendingOrder = queue.find((v) => v.status === QUEUE_STATUS.pending);
  if (pendingOrder) {
    processOrder(pendingOrder.id, bot);
  }
};

const removeLastBot = () => {
  const clone = [...bots.value];
  const bot = clone.pop();
  if (bot && bot.processingId) {
    bot.cancelProcess();
    updateStatus(bot.processingId, QUEUE_STATUS.pending);
  }
  bots.value = clone;
};
</script>

<style>
#app {
  height: 100vh;
  background: ghostwhite;
}
</style>
