<script lang="ts">
  import type { Data } from "../../app";
  import DataDisplay from "./DataDisplay.svelte";

  export let messages: Array<{
    message: string;
    data: Data | Array<Data>;
  }>;
</script>

<div class="w-fit mx-auto">
  <h3 class="text-lg pb-5">Results</h3>
  <div class="space-y-5">
    {#each messages as message}
      <div class="collapse bg-base-200 collapse-plus">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
          {message.message}
        </div>
        <div class="collapse-content">
          <DataDisplay data={message.data} />
        </div>
      </div>
    {/each}
  </div>
</div>
