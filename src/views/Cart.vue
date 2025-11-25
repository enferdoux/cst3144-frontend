<template>
  <div class="container mt-5">
    <h1>Your Cart</h1>
    <div v-if="cart.length === 0">
      <p>Cart is empty</p>
      <router-link to="/lessons" class="btn btn-primary">Browse Lessons</router-link>
    </div>
    <div v-else>
      <div v-for="item in cart" :key="item._id" class="card mb-3">
        <div class="card-body">
          <h5>{{ item.topic }}</h5>
          <p>Quantity: {{ item.quantity }}</p>
          <p>Total: £{{ item.price * item.quantity }}</p>
          <button class="btn btn-danger" @click="removeFromCart(item._id)">Remove</button>
        </div>
      </div>
      <h3>Checkout</h3>
      <form @submit.prevent="placeOrder">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input v-model="order.name" type="text" class="form-control" id="name" required>
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Phone</label>
          <input v-model="order.phone" type="tel" class="form-control" id="phone" required>
        </div>
        <p>Total: £{{ total }}</p>
        <button type="submit" class="btn btn-success" :disabled="loading || !isValidName || !isValidPhone">Place Order</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  props: ['cart'],
  emits: ['remove-from-cart', 'clear-cart'],
  data() {
    return {
      order: {
        name: '',
        phone: '',
        lessons: []
      },
      loading: false
    };
  },
  computed: {
    total() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    isValidName() {
      return /^[a-zA-Z\s]+$/.test(this.order.name);
    },
    isValidPhone() {
      return /^\d+$/.test(this.order.phone);
    }
  },
  methods: {
    removeFromCart(id) {
      this.$emit('remove-from-cart', id);
    },
    async placeOrder() {
      this.loading = true;
      const lessonIDs = [];
      this.cart.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          lessonIDs.push(item._id);
        }
      });
      try {
        const res = await fetch('http://localhost:3000/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.order.name,
            phone: this.order.phone,
            lessonIDs
          })
        });
        if (res.ok) {
          // Now update spaces for each unique lesson
          for (const item of this.cart) {
            const lessonRes = await fetch(`http://localhost:3000/lessons/${item._id}`);
            const lesson = await lessonRes.json();
            await fetch(`http://localhost:3000/lessons/${item._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ space: lesson.space - item.quantity })
            });
          }
          alert('Order placed successfully!');
          this.$emit('clear-cart');
          this.order.name = '';
          this.order.phone = '';
        } else {
          alert('Error placing order');
        }
      } catch (err) {
        console.error(err);
        alert('Error');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>