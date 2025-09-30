import { createApp } from "vue";
import App from "./App.vue";

// PrimeVue setup
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

// 样式导入
import "primeicons/primeicons.css";
import "@/styles/tokens.css";
import "@/styles/components.css";
import "@/styles/editor.css";

const app = createApp(App);
app.use(PrimeVue, { theme: { preset: Aura } });
app.mount("#app");
