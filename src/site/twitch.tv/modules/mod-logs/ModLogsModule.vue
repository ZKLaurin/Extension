<template>
	<template v-if="open && buttonRef.current">
		<UiDraggable
			v-for="con of chatController.instance?.chatController.instances ?? []"
			:key="con.component.props.channelID"
			:handle="com?.handle"
			:initial-anchor="(buttonRef.current as HTMLDivElement)"
			:initial-middleware="[shift({ padding: { bottom: 96, right: 8 }, crossAxis: true })]"
		>
			<ModLogs ref="com" :channel-id="con.component.props.channelID" @close="open = false" />
		</UiDraggable>
	</template>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { until } from "@vueuse/shared";
import { declareModule, getModule } from "@/composable/useModule";
import ModLogs from "./ModLogs.vue";
import ModLogsButton from "./ModLogsButton.vue";
import UiDraggable from "@/ui/UiDraggable.vue";
import { shift } from "@floating-ui/core";
import { declareConfig } from "@/composable/useSettings";

const { dependenciesMet, markAsReady } = declareModule("mod-logs", {
	name: "Mod Logs",
	depends_on: ["chat", "chat-input-controller"],
});

const open = ref(false);
const com = ref<InstanceType<typeof ModLogs> | undefined>();

await until(dependenciesMet).toBe(true);

const inputController = getModule<"TWITCH", "chat-input-controller">("chat-input-controller");
if (!inputController?.instance) throw new Error("ChatInputController not found");

const chatController = getModule<"TWITCH", "chat">("chat");
if (!chatController?.instance) throw new Error("ChatController not found");

// insert button
const buttonRef = inputController.instance.addButton(
	"mod-logs",
	ModLogsButton,
	{
		onClick: () => {
			open.value = !open.value;
		},
	},
	2,
);

markAsReady();
</script>

<script lang="ts">
export const config = [
	declareConfig("chat.mod_logs.enabled", "TOGGLE", {
		path: ["Chat", "Moderation"],
		label: "Enable Mod Logs",
		hint: "Mod Logs allow you to view recent and active timeouts/bans in the current channel",
		defaultValue: true,
	}),
	declareConfig("chat.mod_logs.ack_risks", "NONE", {
		label: "",
		defaultValue: false,
	}),
];
</script>
