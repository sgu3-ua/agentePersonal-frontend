<template>
    <button @click="newChat">Nueva Conversación</button>

    <div class="chat-container">
        <div class="messages">
            <div
                v-for="(msg, i) in chat.messages"
                :key="msg.chatMessageId + i"
                class="message"
                :class="msg.role"
            >
                <div
                    v-for="(part, j) in msg.content"
                    :key="j"
                    class="part"
                    :data-type="getType(part)"
                    :class="getType(part)"
                >
                    {{ format(part) }}
                </div>
            </div>
            <div v-if="loading" class="loading">Generando respuesta...</div>
        </div>

        <div class="input-bar">
            <input v-model="input" @keydown.enter="send" />
            <button @click="send" :disabled="loading">
                {{ loading ? "..." : "Enviar" }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { createProvider } from "@/api/providerFactory";
import { useProviderStore } from "@/stores/provider";
import { useModelsStore } from "@/stores/models";
import type { Chat, ChatMessage } from "@/api/types";

const providerStore = useProviderStore();
const modelsStore = useModelsStore();

const input = ref("");
const loading = ref(false);

const chat = ref<Chat>({
    messages: [],
});

const lastMessageId = ref<string | null>(null);

function activeModel() {
    const model = modelsStore.models.find((m) => m.loadedInstances?.length);
    return model?.loadedInstances?.[0]?.id ?? modelsStore.models[0]?.key;
}

function newChat() {
    chat.value = {
        messages: [],
    };
    lastMessageId.value = null;
}

async function send() {
    if (!input.value.trim()) return;

    const prompt = input.value;
    input.value = "";

    // USER MESSAGE
    chat.value.messages.push({
        role: "user",
        chatMessageId: crypto.randomUUID(),
        content: [`[message]${prompt}`],
    });

    loading.value = true;

    try {
        const provider = createProvider(providerStore.provider, {
            url: providerStore.url,
            token: providerStore.token,
        });

        const model = activeModel();
        if (!model) return;

        const result: ChatMessage = await provider.generateText(
            lastMessageId.value,
            model,
            prompt,
            { integrations: ["mcp/agente-personal"] },
        );

        // ASSISTANT MESSAGE (directo del provider)
        chat.value.messages.push(result);

        lastMessageId.value = result.chatMessageId;
    } catch (err: any) {
        chat.value.messages.push({
            role: "assistant",
            chatMessageId: crypto.randomUUID(),
            content: [`[invalid_tool_call]${err.message}`],
        });
    } finally {
        loading.value = false;
    }
}

function getType(part: string) {
    if (part.startsWith("[message]")) return "msg";
    if (part.startsWith("[thinking]")) return "thinking";
    if (part.startsWith("[toolcall]")) return "tool";
    if (part.startsWith("[invalid_tool_call]")) return "error";
    return "unknown";
}

function format(part: string) {
    return part.replace(/^\[[^\]]+\]/, "");
}
</script>

<style scoped>
.chat-container {
    background: #0b0f14; /* mismo fondo pero separado */
}

.messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.msg {
    color: white;
}
.thinking {
    color: #9ca3af;
}
.tool {
    color: #3b82f6;
}
.error {
    color: #f87171;
}

/* burbujas */
.message {
    padding: 10px 12px;
    border-radius: 12px;
    max-width: 75%;
    white-space: pre-wrap;
    line-height: 1.4;
}

/* USER / ASSISTANT normales */
.user {
    background: #1e293b;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
}

.assistant {
    background: #111827;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
}

.system {
    background: #0f172a;
    opacity: 0.7;
}

/* tipos de contenido */
.part {
    margin-bottom: 4px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
}

.part[data-type="thinking"],
.part[data-type="tool"],
.part[data-type="error"] {
    font-size: 12px;
    opacity: 0.7;
    padding: 2px 6px;
    margin-bottom: 2px;
}
.loading {
    align-self: flex-start;
    color: #9ca3af;
    font-size: 13px;
    padding: 8px 12px;
    font-style: italic;
}

.input-bar {
    position: sticky;
    bottom: 0;
    display: flex;
    gap: 10px;
    padding: 16px;
    background: rgba(11, 15, 20, 0.95);
    backdrop-filter: blur(10px);
    border-top: 1px solid #1f2937;
}

/* input más grande */
input {
    flex: 1;
    padding: 14px 14px;
    border-radius: 12px;
    border: 1px solid #1f2937;
    background: #0f172a;
    color: white;
    outline: none;

    font-size: 14px;
    max-height: 120px; /* límite visual */
}

/* botón más grande */
button {
    padding: 12px 16px;
    border-radius: 12px;
    border: none;
    background: #3b82f6;
    color: white;
    cursor: pointer;
}

input:focus {
    border-color: #3b82f6;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
