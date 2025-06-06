import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    apiUrl: 'http://localhost:5000/api',
    adminEmail: 'admin@example.com',
    adminPassword: 'password123',
    studentEmail: 'student@example.com',
    studentPassword: 'password123',
    employerEmail: 'employer@example.com',
    employerPassword: 'password123',
  },
})