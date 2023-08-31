<template>
  <Card>
    <CardTitle>Bots</CardTitle>
    <List>
      <ListItem v-for="(item, idx) in items" :key="idx">
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
</template>

<script setup lang="ts">
import Badge from './Badge/Badge.vue';
import Card from './Card/Card.vue';
import CardTitle from './Card/CardTitle.vue';
import List from './List/List.vue';
import ListItem from './List/ListItem.vue';
import Typography from './Typography/Typography.vue';
import { Bot } from '../models/Bot.ts';

defineProps<{
  items: Bot[];
}>();
</script>
