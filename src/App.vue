<template>
  <div class="flex space-x-lg">
    <Card>
      <CardTitle>On-going orders</CardTitle>
      <List>
        <ListItem v-for="item in queue" :key="item.id">
          <template #text>
            <Typography type="title">{{ item.label }}</Typography>
            <Typography type="subtitle">{{ item.id }}</Typography>
          </template>
          <template #action>
            <Badge :status="item.status">
              {{ item.status.toLowerCase() }}
            </Badge>
          </template>
        </ListItem>
      </List>
    </Card>
    <Card>
      <CardTitle>Completed orders</CardTitle>
      <List>
        <ListItem v-for="item in completedOrders" :key="item.id">
          <template #text>
            <Typography type="title">{{ item.label }}</Typography>
            <Typography type="subtitle">{{ item.id }}</Typography>
          </template>
        </ListItem>
      </List>
    </Card>
  </div>
  <Card>
    <CardTitle>Bots</CardTitle>
    <List>
      <ListItem v-for="(item, idx) in bots" :key="idx">
        <template #text>
          <Typography type="title">Bot #{{ idx + 1 }}</Typography>
          <Typography v-if="item.processingId" type="subtitle">
            Processing Order ID: {{ item.processingId }}
          </Typography>
        </template>
        <template #action>
          <Badge :status="item.status">
            {{ item.status.toLowerCase() }}
          </Badge>
        </template>
      </ListItem>
    </List>
  </Card>
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
import List from './components/List/List.vue';
import ListItem from './components/List/ListItem.vue';
import Typography from './components/Typography/Typography.vue';
import Badge from './components/Badge/Badge.vue';
import Card from './components/Card/Card.vue';
import CardTitle from './components/Card/CardTitle.vue';

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
