<template>
  <div class="container mt-5">
    <!-- Page title -->
    <h1>Available Lessons</h1>

    <!-- Simple loading indicator while lessons are being fetched -->
    <div v-if="loading">Loading...</div>

    <div v-else>
      <!-- Search input: updates searchQuery and triggers backend search on input -->
      <div class="mb-3">
        <input v-model="searchQuery" @input="performSearch" type="text" class="form-control" placeholder="Search lessons...">
      </div>

      <!-- Sorting controls: choose field and order -->
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

      <!-- Lesson list: rendered as Bootstrap cards in a grid -->
      <div class="row">
        <div v-for="lesson in sortedLessons" :key="lesson._id" class="col-md-4 mb-4">
          <div class="card">
            <div class="card-body">
              <!-- Icon, title and meta -->
              <i class="fas fa-graduation-cap fa-2x mb-2"></i>
              <h5 class="card-title">{{ lesson.topic }}</h5>
              <p class="card-text">{{ lesson.location }}</p>
              <p class="card-text">£{{ lesson.price }}</p>
              <p class="card-text">Spaces: {{ lesson.space }}</p>

              <!-- Add to Cart button: disabled when no spaces left -->
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

  // Receive cart as a prop (parent can pass the current cart)
  props: ['cart'],

  // Emit an event when a lesson is added to the cart
  emits: ['add-to-cart'],

  data() {
    return {
      // Array of lesson objects fetched from backend
      lessons: [],
      // Loading flag while fetching data
      loading: true,
      // Sorting state: field and order
      sortBy: 'topic',
      sortOrder: 'asc',
      // Current search text
      searchQuery: ''
    };
  },

  computed: {
    // Return lessons sorted according to sortBy and sortOrder.
    // For numeric-like fields (price, space) parse values to numbers first.
    sortedLessons() {
      return [...this.lessons].sort((a, b) => {
        let aVal = a[this.sortBy];
        let bVal = b[this.sortBy];

        // Convert numeric fields to numbers for correct comparison
        if (this.sortBy === 'price' || this.sortBy === 'space') {
          aVal = parseFloat(aVal);
          bVal = parseFloat(bVal);
        }

        // Standard ascending / descending comparison
        if (this.sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
  },

  // Fetch lessons when component is created
  async created() {
    try {
      const res = await fetch('http://localhost:3000/lessons');
      this.lessons = await res.json();
    } catch (err) {
      // Log any fetch errors to the console
      console.error(err);
    } finally {
      // Turn off loading indicator regardless of success/failure
      this.loading = false;
    }
  },

  methods: {
    // Perform server-side search using the /search endpoint when searchQuery changes.
    // If searchQuery is empty fallback to getting all lessons.
    async performSearch() {
      try {
        const url = this.searchQuery ? `http://localhost:3000/search?q=${encodeURIComponent(this.searchQuery)}` : 'http://localhost:3000/lessons';
        const res = await fetch(url);
        this.lessons = await res.json();
      } catch (err) {
        console.error(err);
      }
    },

    // Emit add-to-cart event so parent can update the cart state.
    addToCart(lesson) {
      this.$emit('add-to-cart', lesson);
    }
  }
};
</script>