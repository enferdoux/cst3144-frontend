<template>
  <div class="container mt-5">
    <h1>Available Lessons</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div class="mb-3">
        <input v-model="searchQuery" @input="performSearch" type="text" class="form-control" placeholder="Search lessons...">
      </div>
      <div class="mb-3">
        <label>Sort by:</label>
        <select v-model="sortBy" class="form-select d-inline w-auto ms-2">
          <option value="topic">Subject</option>
          <option value="location">Location</option>
          <option value="price">Price</option>
          <option value="space">Spaces</option>
        </select>
        <select v-model="sortOrder" class="form-select d-inline w-auto ms-2">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div class="row">
        <div v-for="lesson in sortedLessons" :key="lesson._id" class="col-md-4 mb-4">
        <div class="card">
          <div class="card-body">
            <i class="fas fa-graduation-cap fa-2x mb-2"></i>
            <h5 class="card-title">{{ lesson.topic }}</h5>
            <p class="card-text">{{ lesson.location }}</p>
            <p class="card-text">£{{ lesson.price }}</p>
            <p class="card-text">Spaces: {{ lesson.space }}</p>
            <button class="btn btn-primary" @click="addToCart(lesson)" :disabled="lesson.space <= 0">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Lessons',
  props: ['cart'],
  emits: ['add-to-cart'],
  data() {
    return {
      lessons: [],
      loading: true,
      sortBy: 'topic',
      sortOrder: 'asc',
      searchQuery: ''
    };
  },
  computed: {
    sortedLessons() {
      return [...this.lessons].sort((a, b) => {
        let aVal = a[this.sortBy];
        let bVal = b[this.sortBy];
        if (this.sortBy === 'price' || this.sortBy === 'space') {
          aVal = parseFloat(aVal);
          bVal = parseFloat(bVal);
        }
        if (this.sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
  },
  async created() {
    try {
      const res = await fetch('http://localhost:3000/lessons');
      this.lessons = await res.json();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async performSearch() {
      try {
        const url = this.searchQuery ? `http://localhost:3000/search?q=${encodeURIComponent(this.searchQuery)}` : 'http://localhost:3000/lessons';
        const res = await fetch(url);
        this.lessons = await res.json();
      } catch (err) {
        console.error(err);
      }
    },
    addToCart(lesson) {
      this.$emit('add-to-cart', lesson);
    }
  }
};
</script>