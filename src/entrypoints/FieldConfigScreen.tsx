import { useState } from "react";
import { Canvas, Section, Button } from "datocms-react-ui";
import { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { getCtxParams } from "../utils/helpers";

import LinkSettings from "../components/controls/LinkSettings";
import StylingSettings from "../components/controls/StylingSettings";
import IconSettings from "../components/controls/IconSettings";

type PropTypes = {
	ctx: RenderManualFieldExtensionConfigScreenCtx;
};

export default function FieldConfigScreen({ ctx }: PropTypes) {
	const [linkSettingIsOpen, setLinkSettingIsOpen] = useState(false);
	const [stylingSettingIsOpen, setStylingSettingIsOpen] = useState(false);
	const [iconSettingIsOpen, setIconSettingIsOpen] = useState(false);
	const ctxPluginParameters: any = getCtxParams(ctx, "plugin_settings");

	return (
		<Canvas ctx={ctx}>
			<Section
				title="Link setting"
				collapsible={{
					isOpen: linkSettingIsOpen,
					onToggle: () => setLinkSettingIsOpen((prev) => !prev),
				}}
			>
				<LinkSettings ctx={ctx} configType="field_settings" />
			</Section>
			<Section
				title="Styling settings"
				collapsible={{
					isOpen: stylingSettingIsOpen,
					onToggle: () => setStylingSettingIsOpen((prev) => !prev),
				}}
			>
				<StylingSettings ctx={ctx} configType="field_settings" />
			</Section>
			<Section
				title="Icon settings"
				collapsible={{
					isOpen: iconSettingIsOpen,
					onToggle: () => setIconSettingIsOpen((prev) => !prev),
				}}
			>
				<IconSettings ctx={ctx} configType="field_settings" />
			</Section>

			<Button
				fullWidth
				buttonType="primary"
				onClick={() => {
					ctx.setParameters({ field_settings: ctxPluginParameters });
				}}
			>
				Reset to Plugin default settings
			</Button>
		</Canvas>
	);
}
