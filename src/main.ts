import { createApp } from 'vue'
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-600.css'
// Poppins covers Latin; Prompt is loaded for Thai only.
import '@fontsource/prompt/thai-400.css'
import '@fontsource/prompt/thai-500.css'
import '@fontsource/prompt/thai-600.css'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
