<template>
  <Card>
    <CardTitle>On-going orders</CardTitle>
    <List>
      <ListItem v-for="item in items" :key="item.id">
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
</template>

<script setup lang="ts">
import Badge from './Badge/Badge.vue';
import Card from './Card/Card.vue';
import CardTitle from './Card/CardTitle.vue';
import List from './List/List.vue';
import ListItem from './List/ListItem.vue';
import Typography from './Typography/Typography.vue';
import type { QueueData } from '../composables/useQueue.ts';

defineProps<{
  items: QueueData[];
}>();
</script>
