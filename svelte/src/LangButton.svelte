<script lang="ts">
import { params_dict, updateHashParams } from "./ts/base_utils";

    import { currentLanguage } from "./ts/utils";

    function changeLanguage() {
        const newLang = currentLanguage() === "en" ? "ja" : "en";
        params_dict.language = newLang;
        updateHashParams();
        window.location.reload();
    }
</script>

<button class="lang-button" on:click={(e) => changeLanguage()}>
    {#if currentLanguage() === "en"}
        Japanese
    {:else}
        English
    {/if}
</button>

<style>
    .lang-button {
        color: #baa791;
        background: transparent;
        cursor: pointer;
        border: none;
    }
</style>
