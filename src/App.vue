<script setup lang="ts">
import SetupView from "@/views/SetupView.vue";
import ModelsView from "@/views/ModelsView.vue";
import { useProviderStore } from "@/stores/provider";
import ChatView from "./views/ChatView.vue";
import { ref } from "vue";

const providerStore = useProviderStore();

const isConfigured = () => {
    return !!providerStore.url;
};

const sidebarWidth = ref(25); // porcentaje inicial
let isResizing = false;

const startResize = () => {
    isResizing = true;
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
};

const resize = (e: MouseEvent) => {
    if (!isResizing) return;

    const newWidth = (e.clientX / window.innerWidth) * 100;

    // límites
    if (newWidth < 15 || newWidth > 50) return;

    sidebarWidth.value = newWidth;
};

const stopResize = () => {
    isResizing = false;
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
};
</script>

<template>
    <div class="app">
        <SetupView v-if="!isConfigured()" />

        <div v-else>
            <header>
                <h1>Model Manager</h1>
                <small
                    >{{ providerStore.provider }} ·
                    {{ providerStore.url }}</small
                >
            </header>

            <div class="layout">
                <aside class="sidebar" :style="{ width: sidebarWidth + '%' }">
                    <ModelsView />
                </aside>

                <div class="resizer" @mousedown="startResize"></div>

                <main class="chat">
                    <ChatView />
                </main>
            </div>
        </div>
    </div>
</template>

<style scoped>
.app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
}
.layout {
    display: flex;
    height: calc(100vh - 60px); /* header real */
    width: 100%;
    overflow: hidden;
}

/* sidebar ahora dinámico */
.sidebar {
    min-width: 200px;
    height: 100%;
    overflow-y: auto;
}

/* barra de resize */
.resizer {
    width: 5px;
    cursor: col-resize;
    background: #1f2937;
}

.resizer:hover {
    background: #3b82f6;
}

/* chat ocupa resto */
.chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
    overflow-y: auto;
}

header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 16px;
}
</style>
