import { defineStore } from "pinia";

import { createProvider } from "@/api/providerFactory";
import type { Model } from "@/api/types";

import { useProviderStore } from "./provider";

interface ModelsState {
  models: Model[];
  loading: boolean;
}

export const useModelsStore = defineStore("models", {
  state: (): ModelsState => ({
    models: [],
    loading: false,
  }),

  actions: {
    async refreshModels() {
      const providerStore = useProviderStore();

      const provider = createProvider(providerStore.provider, {
        url: providerStore.url,
        token: providerStore.token,
      });

      this.loading = true;

      try {
        this.models = await provider.listModels();
      } finally {
        this.loading = false;
      }
    },

    async loadModel(model: string) {
      const providerStore = useProviderStore();

      const provider = createProvider(providerStore.provider, {
        url: providerStore.url,
        token: providerStore.token,
      });

      await provider.loadModel(model);

      await this.refreshModels();
    },

    async unloadModel(instanceId: string) {
      const providerStore = useProviderStore();

      const provider = createProvider(providerStore.provider, {
        url: providerStore.url,
        token: providerStore.token,
      });

      await provider.unloadModel(instanceId);

      await this.refreshModels();
    },
  },
});
