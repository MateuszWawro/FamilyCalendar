import { defineStore } from 'pinia';
import { eventsAPI } from '../api';

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [],
    loading: false,
    error: null
  }),

  getters: {
    getEventsByDate: (state) => (dateStr) => {
      return state.events.filter(e => e.date === dateStr);
    },

    getAllEvents: (state) => state.events
  },

  actions: {
    async fetchEvents() {
      this.loading = true;
      this.error = null;

      try {
        const response = await eventsAPI.getAll();
        if (response.data.success) {
          this.events = response.data.data;
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Błąd pobierania wydarzeń';
        console.error('Błąd fetchEvents:', error);
      } finally {
        this.loading = false;
      }
    },

    async createEvent(eventData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await eventsAPI.create(eventData);
        if (response.data.success) {
          this.events.push(response.data.data);
          return { success: true, data: response.data.data };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Błąd tworzenia wydarzenia';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateEvent(id, eventData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await eventsAPI.update(id, eventData);
        if (response.data.success) {
          const index = this.events.findIndex(e => e.id === id);
          if (index !== -1) {
            this.events[index] = response.data.data;
          }
          return { success: true, data: response.data.data };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Błąd aktualizacji wydarzenia';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteEvent(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await eventsAPI.delete(id);
        if (response.data.success) {
          this.events = this.events.filter(e => e.id !== id);
          return { success: true };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Błąd usuwania wydarzenia';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});