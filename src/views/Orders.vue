<template>
  <div class="container mt-5">
    <h1>Order History</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="order in orders" :key="order._id" class="card mb-3">
        <div class="card-body">
          <h5>Name: {{ order.name }}</h5>
          <p>Phone: {{ order.phone }}</p>
          <p>Lessons: {{ order.lessonIDs.length }}</p>
          <p>Date: {{ new Date(order.createdAt).toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Orders',
  data() {
    return {
      orders: [],
      loading: true
    };
  },
  async created() {
    try {
      const res = await fetch('https://cst3144-backend-gpfo.onrender.com/orders');
      this.orders = await res.json();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
};
</script>