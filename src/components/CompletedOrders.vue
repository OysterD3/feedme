<template>
  <Card>
    <CardTitle>Completed orders</CardTitle>
    <List>
      <ListItem v-for="item in items" :key="item.id">
        <template #text>
          <Typography type="title">{{ item.label }}</Typography>
          <Typography type="subtitle">{{ item.id }}</Typography>
        </template>
      </ListItem>
    </List>
  </Card>
</template>

<script setup lang="ts">
import Card from './Card/Card.vue';
import CardTitle from './Card/CardTitle.vue';
import List from './List/List.vue';
import ListItem from './List/ListItem.vue';
import Typography from './Typography/Typography.vue';

defineProps<{
  items: { id: string; label: string }[];
}>();
</script>
