<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link to="/" class="navbar-brand">After School</router-link>
      <div class="navbar-nav">
        <router-link to="/lessons" class="nav-link">Lessons</router-link>
        <button @click="toggleCart" class="btn btn-outline-primary nav-link" :disabled="!cart.length">Cart ({{ cart.length }})</button>
      </div>
    </div>
  </nav>
  <router-view :cart="cart" @add-to-cart="addToCart" @remove-from-cart="removeFromCart" @clear-cart="clearCart" />
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      cart: [],
      showCart: false
    };
  },
  methods: {
    toggleCart() {
      this.showCart = !this.showCart;
      this.$router.push(this.showCart ? '/cart' : '/lessons');
    },
    addToCart(lesson) {
      const existing = this.cart.find(item => item._id === lesson._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.cart.push({ ...lesson, quantity: 1 });
      }
    },
    removeFromCart(id) {
      this.cart = this.cart.filter(item => item._id !== id);
    },
    clearCart() {
      this.cart = [];
    }
  }
};
</script>
