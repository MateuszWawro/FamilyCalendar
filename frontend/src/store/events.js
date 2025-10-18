import { defineStore } from 'pinia';
import { eventsAPI } from '../api';

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [],
    loading: false,
    error: null
  }),
  getters: {
    getEventsByDate: state => dateStr => {
      return state.events.filter(e => {
        // porównanie tylko daty (YYYY-MM-DD)
        return e.date ? e.date.slice(0,10) === dateStr : false;
      });
    },
    getAllEvents: state => state.events
  },
  actions: {
    async fetchEvents(){
      this.loading = true;
      this.error = null;
      try {
        const response = await eventsAPI.getAll();
        if(response.data.success) this.events = response.data.data;
      } catch(err){
        this.error = err.response?.data?.message || 'Błąd pobierania';
        console.error(err);
      } finally { this.loading=false; }
    },
    async createEvent(eventData){
      this.loading = true; this.error=null;
      try {
        const res = await eventsAPI.create(eventData);
        if(res.data.success) this.events.push(res.data.data);
      } catch(err){
        this.error = err.response?.data?.message || 'Błąd tworzenia';
        throw err;
      } finally { this.loading=false; }
    },
    async updateEvent(id,eventData){
      this.loading = true; this.error=null;
      try {
        const res = await eventsAPI.update(id,eventData);
        if(res.data.success){
          const idx = this.events.findIndex(e=>e.id===id);
          if(idx!==-1) this.events[idx]=res.data.data;
        }
      } catch(err){
        this.error = err.response?.data?.message || 'Błąd aktualizacji';
        throw err;
      } finally { this.loading=false; }
    },
    async deleteEvent(id){
      this.loading=true; this.error=null;
      try {
        const res = await eventsAPI.delete(id);
        if(res.data.success) this.events = this.events.filter(e=>e.id!==id);
      } catch(err){
        this.error = err.response?.data?.message || 'Błąd usuwania';
        throw err;
      } finally { this.loading=false; }
    }
  }
});