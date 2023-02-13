new Vue({
  el: "#app",
  data() {
    return {
      isDark: true,
      show: true,
      todoTitle: "",
      todos: [],
    };
  },
  created() {
    const query = `
      query {
        getTodos {
          id title done createdAt updatedAt
        }
      }
    `;
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((response) => {
        this.todos = response.data.getTodos;
      });
  },
  methods: {
    addTodo() {
      const title = this.todoTitle.trim();
      if (!title) {
        return;
      }

      const query = `
        mutation {
          createTodo(todo: { title: "${title}" }) {
            id title done createdAt updatedAt
          }
        }
      `;

      fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query }),
      })
        .then((res) => res.json())
        .then((response) => {
          const todo = response.data.createTodo;
          this.todos.push(todo);
          this.todoTitle = "";
        })
        .catch((error) => console.log(error));
    },

    removeTodo(id) {
      const query = `
      mutation {
        removeTodo(id: { id: "${id}" })
      }
    `;

    console.log(query);

      fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query }),
      })
        .then(() => {
          this.todos = this.todos.filter((t) => t.id !== id);
        })
        .catch((error) => console.log(error));
    },

    completeTodo(id) {
      const query = `
      mutation {
        completeTodo(id: { id: "${id}" }) {
          updatedAt
        }
      }
     `;

      fetch(`/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query }),
      })
        .then((res) => res.json())
        .then((response) => {
          const idx = this.todos.findIndex((t) => t.id === id);
          this.todos[idx].updatedAt = response.data.completeTodo.updatedAt;
        })
        .catch((error) => console.log(error));
    },
  },
  filters: {
    capitalize(value) {
      return value.toString().charAt(0).toUpperCase() + value.slice(1);
    },
    date(value) {
      return new Date(value);
    },
  },
});
