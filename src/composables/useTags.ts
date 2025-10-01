import { ref, computed } from "vue";
import type { Tag } from "@/types";
import { mockTags } from "@/mock/tags";
import { generateTagId } from "@/utils/idGenerator";

export function useTags() {
  const tags = ref<Tag[]>(mockTags);
  const activeTagId = ref<string>("all");

  const activeTag = computed(() => 
    tags.value.find(tag => tag.id === activeTagId.value)
  );

  function selectTag(id: string) {
    activeTagId.value = id;
  }

  function createTag(tag: Omit<Tag, "id">) {
    const newTag: Tag = {
      ...tag,
      id: generateTagId(),
    };
    tags.value.push(newTag);
    return newTag;
  }

  function updateTag(id: string, updates: Partial<Tag>) {
    const tag = tags.value.find(t => t.id === id);
    if (tag) {
      Object.assign(tag, updates);
    }
  }

  function deleteTag(id: string) {
    const index = tags.value.findIndex(t => t.id === id);
    if (index > -1) {
      tags.value.splice(index, 1);
      if (activeTagId.value === id) {
        activeTagId.value = "all";
      }
    }
  }

  return {
    tags,
    activeTagId,
    activeTag,
    selectTag,
    createTag,
    updateTag,
    deleteTag,
  };
}
