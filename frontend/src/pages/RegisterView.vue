<template>
  <div class="register-page">
    <div class="register-left">
      <div class="overlay-content">
        <h1>📅 Family Calendar</h1>
        <p>Dołącz do nas już dziś!</p>
      </div>
    </div>

    <div class="register-right">
      <div class="register-card">
        <h2>Utwórz konto</h2>
        <p class="subtitle">Zacznij organizować życie rodziny</p>

        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Imię (opcjonalne)</label>
            <input
              v-model="name"
              type="text"
              placeholder="Twoje imię"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="twoj@email.pl"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label>Hasło</label>
            <input
              v-model="password"
              type="password"
              placeholder="Min. 6 znaków"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label>Potwierdź hasło</label>
            <input
              v-model="passwordConfirm"
              type="password"
              placeholder="Powtórz hasło"
              required
              :disabled="loading"
            />
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>

          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Rejestrowanie...' : 'Zarejestruj się' }}
          </button>
        </form>

        <div class="login-link">
          Masz już konto? <router-link to="/login">Zaloguj się</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  error.value = '';

  // Walidacja
  if (password.value !== passwordConfirm.value) {
    error.value = 'Hasła nie są identyczne';
    return;
  }

  if (password.value.length < 6) {
    error.value = 'Hasło musi mieć minimum 6 znaków';
    return;
  }

  loading.value = true;

  try {
    await authStore.register(email.value, password.value, name.value || null);
    router.push('/calendar');
  } catch (err) {
    error.value = err.response?.data?.message || 'Błąd rejestracji';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.register-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 2rem;
}

.overlay-content {
  text-align: center;
  max-width: 400px;
}

.overlay-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.overlay-content p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.register-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8fafc;
}

.register-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.register-card h2 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1.8rem;
}

.subtitle {
  color: #64748b;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-page {
    flex-direction: column;
  }

  .register-left {
    min-height: 200px;
  }

  .overlay-content h1 {
    font-size: 2rem;
  }
}
</style>