<template>
  <div class="calendar-page">
    <!-- Header -->
    <header class="calendar-header">
      <div class="header-top">
        <h1>📅 Kalendarz Rodzinny</h1>
        <div class="user-info">
          <span>{{ authStore.user?.email }}</span>
          <button class="logout-btn" @click="handleLogout">Wyloguj</button>
        </div>
      </div>
      <div class="month-nav">
        <button @click="prevMonth">&lt;</button>
        <span>{{ monthNames[currentMonth] }} {{ currentYear }}</span>
        <button @click="nextMonth">&gt;</button>
        <button class="add-event-btn" @click="openCreateModal">+ Dodaj wydarzenie</button>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="eventsStore.loading" class="loading">Ładowanie...</div>

    <!-- Grid kalendarza -->
    <div v-else class="calendar-grid">
      <div class="day-name" v-for="day in weekDays" :key="day">{{ day }}</div>

      <div
        class="day-cell"
        v-for="day in calendarDays"
        :key="day.date || day.number + '-' + currentMonth + '-' + currentYear"
        :class="{ today: isToday(day.date), 'empty-day': !day.number }"
      >
        <div v-if="day.number" class="date-number">{{ day.number }}</div>
        <ul v-if="day.events.length" class="events">
          <li
            v-for="event in day.events"
            :key="event.id"
            :class="event.color"
            @click.stop="openEditModal(event)"
          >
            {{ formatEventTime(event) }}{{ event.title }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Modal dodawania/edycji eventu -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editingEvent ? 'Edytuj wydarzenie' : 'Dodaj wydarzenie' }}</h3>
        <form @submit.prevent="handleSubmit">
          <label>Tytuł:</label>
          <input v-model="formData.title" type="text" placeholder="Wydarzenie" required />

          <label>Data:</label>
          <input v-model="formData.date" type="date" required />

          <label>Godzina:</label>
          <input v-model="formData.time" type="time" />

          <label>Osoba/Kategoria:</label>
          <select v-model="formData.color" required>
            <option value="event-mama">Ewa</option>
            <option value="event-tata">Włodek</option>
            <option value="event-aga">Aga</option>
            <option value="event-mateusz">Mateusz</option>
          </select>

          <label>Opis (opcjonalnie):</label>
          <textarea v-model="formData.description" placeholder="Dodatkowe informacje" rows="3"></textarea>

          <div class="modal-actions">
            <button type="submit" class="btn" :disabled="submitting">
              {{ submitting ? 'Zapisywanie...' : (editingEvent ? 'Zapisz' : 'Dodaj') }}
            </button>
            <button v-if="editingEvent" type="button" class="btn delete" @click="handleDelete" :disabled="submitting">
              Usuń
            </button>
            <button type="button" class="btn cancel" @click="closeModal">Anuluj</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { useEventsStore } from '../store/events';

const router = useRouter();
const authStore = useAuthStore();
const eventsStore = useEventsStore();

const weekDays = ['Pn','Wt','Śr','Cz','Pt','So','Nd'];
const monthNames = [
  'Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
  'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'
];

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

const showModal = ref(false);
const editingEvent = ref(null);
const submitting = ref(false);

const formData = ref({
  title: '',
  date: '',
  time: '',
  color: 'event-mama',
  description: ''
});

const toast = ref({ show:false, message:'', type:'success' });

onMounted(async () => {
  await eventsStore.fetchEvents();
});

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const days = [];

  let startWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  for (let i=0; i<startWeek; i++) days.push({ number:'', date:'', events:[] });

  for (let i=1; i<=lastDay.getDate(); i++){
    const dateStr = `${currentYear.value}-${String(currentMonth.value+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
    const dayEvents = eventsStore.getEventsByDate(dateStr) || [];
    days.push({ number:i, date:dateStr, events:dayEvents });
  }
  return days;
});

const prevMonth = () => {
  if(currentMonth.value===0){currentMonth.value=11; currentYear.value--;}
  else currentMonth.value--;
};

const nextMonth = () => {
  if(currentMonth.value===11){currentMonth.value=0; currentYear.value++;}
  else currentMonth.value++;
};

const isToday = dateStr => {
  if(!dateStr) return false;
  const d = new Date(dateStr);
  return d.getFullYear()===today.getFullYear() &&
         d.getMonth()===today.getMonth() &&
         d.getDate()===today.getDate();
};

const openCreateModal = () => {
  editingEvent.value = null;
  formData.value = { title:'', date:'', time:'', color:'event-mama', description:'' };
  showModal.value = true;
};

const openEditModal = event => {
  editingEvent.value = event;
  formData.value = {
    title: event.title,
    date: event.date,
    time: event.time || '',
    color: event.color,
    description: event.description || ''
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingEvent.value = null;
  formData.value = { title:'', date:'', time:'', color:'event-mama', description:'' };
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    const payload = { ...formData.value };

    // Połącz date + time lokalnie
    if(formData.value.time){
      const [h, m] = formData.value.time.split(':');
      const localDate = new Date(formData.value.date);
      localDate.setHours(+h, +m, 0, 0);
      payload.date = localDate.toISOString(); // zapisuje dokładny czas w UTC
    }

    if(editingEvent.value){
      await eventsStore.updateEvent(editingEvent.value.id, payload);
      showToast('Wydarzenie zaktualizowane','success');
    } else {
      await eventsStore.createEvent(payload);
      showToast('Wydarzenie dodane','success');
    }
    closeModal();
  } catch(e){
    showToast(e.response?.data?.message || 'Błąd zapisu','error');
  } finally { submitting.value = false; }
};

const handleDelete = async () => {
  if(!confirm('Czy na pewno chcesz usunąć to wydarzenie?')) return;
  submitting.value = true;
  try {
    await eventsStore.deleteEvent(editingEvent.value.id);
    showToast('Wydarzenie usunięte','success');
    closeModal();
  } catch(e){
    showToast(e.response?.data?.message || 'Błąd usuwania','error');
  } finally { submitting.value = false; }
};

const handleLogout = () => {
  authStore.logout();
  showToast('Wylogowano pomyślnie','success');
  setTimeout(()=>router.push('/login'),1000);
};

// Wyświetlanie godziny w HH:MM
const formatEventTime = event => {
  if(!event.date) return '';
  const d = new Date(event.date);
  const h = String(d.getHours()).padStart(2,'0');
  const m = String(d.getMinutes()).padStart(2,'0');
  return d.getHours() || d.getMinutes() ? `${h}:${m} - ` : '';
};

const showToast = (msg,type='success') => {
  toast.value = { show:true, message:msg, type };
  setTimeout(()=>toast.value.show=false,3000);
};
</script>

<style scoped>
/* =======================
   CSS KALENDARZA + MODAL
======================= */

.calendar-page {
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1400px;
  margin: 0 auto;
}

.calendar-header {
  margin-bottom: 1.5rem;
}
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.user-info span { font-size: 0.9rem; color: #666; }
.logout-btn {
  background: #ef4444; color: #fff; border: none; border-radius: 6px; padding: 0.4rem 0.8rem;
  cursor: pointer; font-weight: 600; transition: all 0.2s;
}
.logout-btn:hover { background: #dc2626; }
.month-nav {
  display: flex; align-items: center; justify-content: center; gap: 1rem;
}
.month-nav button {
  background: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 0.4rem 0.8rem;
  cursor: pointer; transition: all 0.2s; font-weight: 600;
}
.month-nav button:hover { background: #1d4ed8; }
.add-event-btn { background: #10b981 !important; }
.add-event-btn:hover { background: #059669 !important; }

.loading { text-align:center; padding:2rem; color:#666; font-size:1.1rem; }

.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap:0.5rem; }
.day-name {
  font-weight:bold; text-align:center; padding:0.6rem; border-radius:8px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa); color:white; font-size:0.9rem;
}
.day-cell {
  min-height:100px; border-radius:8px; background:#f8fafc; padding:0.5rem;
  border:2px solid #e2e8f0; transition:all 0.2s; cursor:pointer;
}
.day-cell:hover { transform: translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.1);}
.day-cell.today { border-color:#2563eb; background:#dbeafe; }
.day-cell.empty-day { background:#f1f5f9; cursor:default; }
.day-cell.empty-day:hover { transform:none; box-shadow:none; }
.date-number { font-weight:bold; margin-bottom:0.3rem; color:#1e3a8a; }

.events { list-style:none; padding:0; margin:0; font-size:0.75rem; }
.events li { padding:4px 6px; border-radius:4px; margin-bottom:3px; cursor:pointer; transition: all 0.2s; }
.events li:hover { opacity:0.8; transform:scale(1.02);}
.event-mama { background:#f87171; color:#fff; }
.event-tata { background:#34d399; color:#fff; }
.event-aga { background:#60a5fa; color:#fff; }
.event-mateusz { background:#fbbf24; color:#fff; }

/* Modal */
.modal-overlay {
  position:fixed; top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000;
}
.modal { background:#fff; padding:2rem; border-radius:12px; width:400px; max-width:90%; box-shadow:0 10px 30px rgba(0,0,0,0.3);}
.modal h3 { margin-top:0; color:#1e3a8a;}
.modal label { display:block; margin-top:1rem; margin-bottom:0.3rem; font-weight:600; color:#374151; }
.modal input, .modal select, .modal textarea {
  width:100%; padding:0.6rem; border:1px solid #d1d5db; border-radius:6px; font-size:1rem;
}
.modal input:focus, .modal select:focus, .modal textarea:focus { outline:none; border-color:#2563eb; }
.modal-actions { display:flex; gap:0.5rem; margin-top:1.5rem; }
.modal-actions .btn {
  flex:1; background:#2563eb; color:#fff; border:none; border-radius:6px; padding:0.6rem; font-weight:600; cursor:pointer; transition:all 0.2s;
}
.modal-actions .btn:disabled { opacity:0.5; cursor:not-allowed;}
.modal-actions .btn:hover:not(:disabled) { background:#1d4ed8; }
.modal-actions .delete { background:#ef4444;}
.modal-actions .delete:hover:not(:disabled) { background:#dc2626;}
.modal-actions .cancel { background:#6b7280;}
.modal-actions .cancel:hover { background:#4b5563; }

/* Toast */
.toast { position:fixed; top:1rem; right:1rem; background:#10b981; color:white; padding:1rem 1.5rem; border-radius:8px; font-weight:600; box-shadow:0 4px 12px rgba(0,0,0,0.2); z-index:2000; animation:slideIn 0.3s ease-out; }
.toast.error { background:#ef4444; }
@keyframes slideIn { from{transform:translateX(100%); opacity:0;} to{transform:translateX(0); opacity:1;} }

/* Responsywność */
@media (max-width: 768px) { .calendar-grid { grid-template-columns: repeat(3, 1fr);} .day-cell { min-height:80px;} .header-top { flex-direction:column; gap:0.5rem; } }
@media (max-width: 480px) { .calendar-grid { grid-template-columns: repeat(2, 1fr);} }
</style>