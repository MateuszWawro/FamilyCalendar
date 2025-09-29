<template>
  <div class="login-page">
    <!-- Lewa kolumna z obrazkiem -->
    <div class="login-left">
      <img :src="loginImage" alt="Family Calendar" />
      <div class="overlay-text">
        <h1>Family Calendar</h1>
        <p>Twoja rodzina, wszystkie wydarzenia w jednym miejscu.</p>
      </div>
    </div>

    <!-- Prawa kolumna – formularz logowania -->
    <div class="login-right">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">📅</div>
          <h2>Zaloguj się</h2>
          <p>Wprowadź swoje dane aby kontynuować</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Email</label>
            <input v-model="email" type="email" placeholder="np. jan@dom.pl" required />
          </div>

          <div class="form-group">
            <label>Hasło</label>
            <input v-model="password" type="password" placeholder="••••••••" required />
          </div>

          <button type="submit" class="btn">Zaloguj się</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import loginImage from '@/assets/image.jpeg'

const router = useRouter()
const authStore = useAuthStore()

const email = ref("")
const password = ref("")

const handleLogin = () => {
  if (email.value === "test@dom.pl" && password.value === "1234") {
    authStore.login({ email: email.value }, "fakeToken")
    router.push("/calendar")
  } else {
    alert("Niepoprawne dane logowania")
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: Arial, sans-serif;
  animation: fadeIn 0.6s ease-in;
}

/* Lewa kolumna z obrazkiem */
.login-left {
  flex: 1;
  position: relative;
  overflow: hidden;
}
.login-left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.login-left .overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  max-width: 300px;
}
.login-left .overlay-text h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.login-left .overlay-text p {
  font-size: 1.2rem;
}

/* Prawa kolumna – formularz logowania */
.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f3f4f6;
}

/* Karta logowania */
.login-card {
  background: #fff;
  padding: 2.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  text-align: center;
  animation: slideUp 0.5s ease-in;
}

/* Nagłówek */
.login-header .logo {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}
.login-header h2 {
  font-size: 1.5rem;
  margin: 0.5rem 0;
}
.login-header p {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1.5rem;
}

/* Formularz */
.form-group {
  text-align: left;
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  color: #444;
}
.form-group input {
  width: 100%;
  padding: 0.65rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.form-group input:focus {
  outline: none;
  border-color: #2563eb;
}

/* Przycisk */
.btn {
  width: 100%;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn:hover {
  background: #1d4ed8;
}

/* RESPONSYWNOŚĆ MOBILE */
@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .login-left, .login-right {
    width: 100%;
    padding: 1rem;
  }

  /* Obrazek nad formularzem */
  .login-left {
    height: 250px;
  }

  .login-left img {
    height: 100%;
  }

  .login-left .overlay-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-shadow: 0 2px 8px rgba(0,0,0,0.5);
    color: white;
  }

  .login-card {
    margin-top: 1rem;
  }
}

/* Animacje */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>