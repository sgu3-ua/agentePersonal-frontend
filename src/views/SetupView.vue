<script setup lang="ts">
import { ref } from "vue";
import { useProviderStore } from "@/stores/provider";

const providerStore = useProviderStore();

const provider = ref(providerStore.provider);
const url = ref(providerStore.url);
const token = ref(providerStore.token);

const save = () => {
    providerStore.setProvider(provider.value);
    providerStore.setUrl(url.value);
    providerStore.setToken(token.value);
};
</script>

<template>
    <div class="setup-view">
        <h2>Configuración del provider</h2>

        <div>
            <label>Provider</label>
            <select v-model="provider">
                <option value="lmstudio">LMStudio</option>
                <option value="ollama">Ollama</option>
                <option value="custom">Custom</option>
            </select>
        </div>

        <div>
            <label>URL</label>
            <input v-model="url" placeholder="http://localhost:3000" />
        </div>

        <div>
            <label>Token</label>
            <input v-model="token" type="password" />
        </div>

        <button @click="save">Guardar configuración</button>
    </div>
</template>
<style scoped>
.setup-view {
    max-width: 420px;
    margin: 60px auto;
    padding: 20px;
    background: #0f172a;
    border: 1px solid #1f2937;
    border-radius: 14px;
}

.setup-view div {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.setup-view input,
.setup-view select {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #1f2937;
    background: #0b0f14;
    color: white;
}

.setup-view button {
    width: 100%;
    margin-top: 10px;
    background: #3b82f6;
}
</style>
