import { createApp } from 'vue';
import App from './app/App.vue';
import { vuetify } from './plugins/vuetify';
import './styles/index.css';

createApp(App).use(vuetify).mount('#root');
