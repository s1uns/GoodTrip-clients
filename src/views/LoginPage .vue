<template>
  <div class="login-container">
    <q-card class="login-card">
      <q-card-section>
        <h1 class="text-h5 text-center q-mb-md">Log In</h1>
        <p class="text-center text-grey-7 q-mb-md">Welcome back! Please log in to your account.</p>

        <q-form @submit="handleLogin">
          <!-- Email -->
          <q-input
            v-model="email"
            type="email"
            label="Email"
            outlined
            dense
            class="q-mb-md"
            :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Invalid email']"
          />

          <!-- Password -->
          <q-input
            v-model="password"
            type="password"
            label="Password"
            outlined
            dense
            class="q-mb-md"
            :rules="[val => !!val || 'Password is required']"
          />

          <!-- Login Button -->
          <q-btn
            type="submit"
            label="Log In"
            color="black"
            text-color="white"
            class="full-width"
            :disable="loading"
          />

          <div class="text-center q-mt-md">
            <q-btn flat label="Forgot password?" class="text-grey-7" />
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pt-md">
        <div class="text-center text-grey-7">OR CONTINUE WITH</div>

        <div class="row justify-center q-mt-md">
          <q-btn icon="fa-brands fa-google" flat label="Google" class="q-mx-sm" />
          <q-btn icon="fa-brands fa-facebook" flat label="Facebook" class="q-mx-sm" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pt-md text-center">
        <span>Don't have an account?</span>
        <q-btn flat label="Sign Up" class="text-black" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const loading = ref(false);

const handleLogin = () => {
  if (!email.value || !password.value) return;
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    console.log("Logging in with:", email.value, password.value);
  }, 1500);
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.full-width {
  width: 100%;
}
</style>
