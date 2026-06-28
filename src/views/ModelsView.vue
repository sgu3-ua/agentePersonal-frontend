<script setup lang="ts">
import { onMounted } from "vue";
import { useModelsStore } from "@/stores/models";

const modelsStore = useModelsStore();

onMounted(() => {
    modelsStore.refreshModels();
});

const handleLoad = async (key: string) => {
    await modelsStore.loadModel(key);
};

const handleUnload = async (instanceId: string) => {
    await modelsStore.unloadModel(instanceId);
};
</script>

<template>
    <div class="models-view">
        <h2>Modelos</h2>

        <div v-if="modelsStore.loading">Cargando...</div>

        <ul v-else>
            <li v-for="model in modelsStore.models" :key="model.key">
                <div>
                    <strong>{{ model.displayName }}</strong>
                </div>

                <div>
                    <small>{{ model.publisher }} · {{ model.type }}</small>
                </div>

                <div>Contexto: {{ model.maxContextLength }} tokens</div>

                <!-- Estado loaded -->
                <div v-if="model.loaded">
                    <span>🟢 Cargado</span>

                    <!-- puede haber varias instancias -->
                    <div v-if="model.loadedInstances.length">
                        <div
                            v-for="instance in model.loadedInstances"
                            :key="instance.id"
                        >
                            <button @click="handleUnload(instance.id)">
                                Descargar instancia
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <span>⚪ No cargado</span>
                    <button @click="handleLoad(model.key)">Cargar</button>
                </div>

                <!-- Extras opcionales -->
                <div v-if="model.capabilities">
                    <small>
                        🧠 Vision:
                        {{ model.capabilities.vision ? "sí" : "no" }} · Tool
                        use:
                        {{ model.capabilities.trainedForToolUse ? "sí" : "no" }}
                    </small>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.models-view {
    width: 100%;
    margin: 0;
    padding: 20px;
}

.models-view ul {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 12px;
}

.models-view li {
    background: #0f172a;
    border: 1px solid #1f2937;
    border-radius: 12px;
    padding: 14px;
}

.models-view button {
    margin-top: 8px;
    background: #111827;
    border: 1px solid #1f2937;
}

.models-view button:hover {
    border-color: #3b82f6;
}
</style>
