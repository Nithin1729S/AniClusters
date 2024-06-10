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
            Switch to Japanese
    {:else}
         Switch to English
    {/if}
</button>

<style>
    .lang-button {
        color: #ffffff;
        background: transparent;
        cursor: pointer;
        font-size: medium;
        border: none;
        padding-top: 10px;
        padding-right:30px ;
    }
</style>
